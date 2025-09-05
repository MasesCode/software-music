<?php

namespace Tests\Feature;

use App\Models\Music;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Activitylog\Models\Activity;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class ActivityLogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
        $this->artisan('db:seed');
    }

    public function test_creates_log_when_music_is_created(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $token = JWTAuth::fromUser($user);

        $musicData = [
            'youtube_url' => 'https://www.youtube.com/watch?v=s9kVG2ZaTS4',
            'suggestion_reason' => 'Great song!'
        ];

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/musics', $musicData);

        $this->assertDatabaseHas('activity_log', [
            'description' => 'Music suggestion created',
            'causer_id' => $user->id,
            'causer_type' => User::class,
        ]);
    }

    public function test_creates_log_when_music_is_approved(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $music = Music::factory()->create(['is_approved' => false]);
        $token = JWTAuth::fromUser($admin);

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/musics/{$music->id}/approve", ['action' => 'approve']);

        $this->assertDatabaseHas('activity_log', [
            'description' => 'Music approved by admin',
            'causer_id' => $admin->id,
            'subject_id' => $music->id,
            'subject_type' => Music::class,
        ]);
    }

    public function test_creates_log_when_user_contributes(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $music = Music::factory()->create(['is_approved' => false, 'count_to_approve' => 3]);
        $token = JWTAuth::fromUser($user);

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/musics/{$music->id}/contribute");

        $this->assertDatabaseHas('activity_log', [
            'description' => 'Music contribution recorded',
            'causer_id' => $user->id,
            'subject_id' => $music->id,
            'subject_type' => Music::class,
        ]);
    }

    public function test_creates_log_when_music_is_auto_approved(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $music = Music::factory()->create(['is_approved' => false, 'count_to_approve' => 4]);
        $token = JWTAuth::fromUser($user);

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/musics/{$music->id}/contribute");

        $this->assertDatabaseHas('activity_log', [
            'description' => 'Music auto-approved after 5 contributions',
            'causer_id' => $user->id,
            'subject_id' => $music->id,
            'subject_type' => Music::class,
        ]);
    }

    public function test_creates_log_when_user_is_created(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $token = JWTAuth::fromUser($admin);

        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'is_admin' => false
        ];

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/users', $userData);

        $this->assertDatabaseHas('activity_log', [
            'description' => 'User created',
            'causer_id' => $admin->id,
        ]);
    }

    public function test_admin_can_view_activity_logs(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $token = JWTAuth::fromUser($admin);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/activity-logs');

        $response->assertOk();
        $response->assertJsonStructure([
            'message',
            'data' => [
                'data' => [
                    '*' => ['id', 'description', 'causer_id', 'subject_id', 'subject_type', 'created_at']
                ]
            ]
        ]);
    }

    public function test_non_admin_cannot_view_activity_logs(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $token = JWTAuth::fromUser($user);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/activity-logs');

        $response->assertStatus(403);
    }
}
