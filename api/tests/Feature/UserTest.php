<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_should_require_authentication_to_access_users(): void
    {
        $response = $this->getJson('/api/users');
        $response->assertStatus(401);
    }

    public function test_admin_can_see_all_users(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        User::factory()->count(3)->create(['is_admin' => false]);
        
        $token = JWTAuth::fromUser($admin);
        
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/users');

        $response->assertOk();
        $response->assertJsonCount(4, 'data');
    }

    public function test_non_admin_can_only_see_non_admin_users(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        User::factory()->create(['is_admin' => true]);
        $nonAdminUsers = User::factory()->count(2)->create(['is_admin' => false]);
        
        $token = JWTAuth::fromUser($user);
        
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/users');

        $response->assertOk();
        $response->assertJsonCount(3, 'data');
    }

    public function test_admin_can_create_user(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $token = JWTAuth::fromUser($admin);
        
        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'is_admin' => false
        ];
        
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/users', $userData);

        $response->assertStatus(201);
        $response->assertJsonFragment(['name' => 'Test User']);
        $response->assertJsonFragment(['message' => 'User created successfully.']);
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    public function test_non_admin_cannot_create_user(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $token = JWTAuth::fromUser($user);
        
        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123'
        ];
        
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/users', $userData);

        $response->assertStatus(403);
    }

    public function test_admin_can_view_any_user(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $targetUser = User::factory()->create(['is_admin' => false]);
        $token = JWTAuth::fromUser($admin);
        
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/users/{$targetUser->id}");

        $response->assertOk();
        $response->assertJsonFragment(['id' => $targetUser->id]);
        $response->assertJsonFragment(['message' => 'User retrieved successfully.']);
    }

    public function test_non_admin_cannot_view_admin_user(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $adminUser = User::factory()->create(['is_admin' => true]);
        $token = JWTAuth::fromUser($user);
        
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/users/{$adminUser->id}");

        $response->assertStatus(403);
    }

    public function test_non_admin_can_view_non_admin_user(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $targetUser = User::factory()->create(['is_admin' => false]);
        $token = JWTAuth::fromUser($user);
        
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/users/{$targetUser->id}");

        $response->assertOk();
        $response->assertJsonFragment(['id' => $targetUser->id]);
        $response->assertJsonFragment(['message' => 'User retrieved successfully.']);
    }

    public function test_admin_can_update_user(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $targetUser = User::factory()->create(['is_admin' => false]);
        $token = JWTAuth::fromUser($admin);
        
        $updateData = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com'
        ];
        
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/users/{$targetUser->id}", $updateData);

        $response->assertOk();
        $response->assertJsonFragment(['name' => 'Updated Name']);
        $response->assertJsonFragment(['message' => 'User updated successfully.']);
        $this->assertDatabaseHas('users', ['name' => 'Updated Name']);
    }

    public function test_non_admin_cannot_update_user(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $targetUser = User::factory()->create(['is_admin' => false]);
        $token = JWTAuth::fromUser($user);
        
        $updateData = [
            'name' => 'Updated Name'
        ];
        
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/users/{$targetUser->id}", $updateData);

        $response->assertStatus(403);
    }

    public function test_admin_can_delete_user(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $targetUser = User::factory()->create(['is_admin' => false]);
        $token = JWTAuth::fromUser($admin);
        
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/users/{$targetUser->id}");

        $response->assertOk();
        $response->assertJsonFragment(['message' => 'User deleted successfully.']);
        $this->assertSoftDeleted('users', ['id' => $targetUser->id]);
    }

    public function test_admin_cannot_delete_themselves(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $token = JWTAuth::fromUser($admin);
        
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/users/{$admin->id}");

        $response->assertStatus(403);
        $response->assertJsonFragment(['message' => 'This action is unauthorized.']);
    }

    public function test_non_admin_cannot_delete_user(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $targetUser = User::factory()->create(['is_admin' => false]);
        $token = JWTAuth::fromUser($user);
        
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/users/{$targetUser->id}");

        $response->assertStatus(403);
    }

    public function test_user_creation_validation(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $token = JWTAuth::fromUser($admin);
        
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/users', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_user_update_validation(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $targetUser = User::factory()->create(['is_admin' => false]);
        $token = JWTAuth::fromUser($admin);
        
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/users/{$targetUser->id}", [
            'email' => 'invalid-email',
            'password' => '123'
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_admin_can_update_user_password(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $targetUser = User::factory()->create(['is_admin' => false]);
        $token = JWTAuth::fromUser($admin);
        
        $updateData = [
            'password' => 'newpassword123'
        ];
        
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/users/{$targetUser->id}", $updateData);

        $response->assertOk();
        $response->assertJsonFragment(['message' => 'User updated successfully.']);
    }
}
