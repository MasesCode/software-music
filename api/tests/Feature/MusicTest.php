<?php

namespace Tests\Feature;

use App\Models\Music;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class MusicTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
        $this->artisan('db:seed');
    }

    public function test_can_access_musics_without_authentication(): void
    {
        $response = $this->getJson('/api/musics');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'data' => [
                'top_five' => [
                    '*' => ['id', 'title', 'views', 'youtube_id', 'thumb', 'is_approved']
                ],
                'others' => [
                    'data' => [
                        '*' => ['id', 'title', 'views', 'youtube_id', 'thumb', 'is_approved']
                    ]
                ]
            ]
        ]);
    }

    public function test_can_get_top_five_musics_without_authentication(): void
    {
        $response = $this->getJson('/api/musics/top-five');

        $response->assertOk();
        $response->assertJsonStructure([
            'message',
            'data' => [
                '*' => ['id', 'title', 'views', 'youtube_id', 'thumb', 'is_approved']
            ]
        ]);
    }

    public function test_can_get_other_musics_without_authentication(): void
    {
        $response = $this->getJson('/api/musics/others');

        $response->assertOk();
        $response->assertJsonStructure([
            'message',
            'data' => [
                'data' => [
                    '*' => ['id', 'title', 'views', 'youtube_id', 'thumb', 'is_approved']
                ]
            ]
        ]);
    }

    public function test_can_get_pending_musics(): void
    {
        $user = User::factory()->create(['is_admin' => true]);
        $token = JWTAuth::fromUser($user);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/musics/pending');

        $response->assertOk();
        $response->assertJsonStructure([
            'message',
            'data' => [
                'data' => [
                    '*' => ['id', 'title', 'views', 'youtube_id', 'thumb', 'is_approved', 'user']
                ]
            ]
        ]);
    }

    public function test_can_create_music_suggestion(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $token = JWTAuth::fromUser($user);

        $musicData = [
            'youtube_url' => 'https://www.youtube.com/watch?v=s9kVG2ZaTS4',
            'suggestion_reason' => 'Great song!'
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/musics', $musicData);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
            'data' => ['id', 'title', 'views', 'youtube_id', 'thumb', 'is_approved', 'suggestion_reason']
        ]);
    }

    public function test_can_contribute_to_music_approval(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $music = Music::factory()->create(['is_approved' => false, 'count_to_approve' => 3]);
        $token = JWTAuth::fromUser($user);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/musics/{$music->id}/contribute");

        $response->assertOk();
        $response->assertJsonFragment(['message' => 'Music contribution recorded.']);
    }

    public function test_can_auto_approve_music_after_five_contributions(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $music = Music::factory()->create(['is_approved' => false, 'count_to_approve' => 4]);
        $token = JWTAuth::fromUser($user);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/musics/{$music->id}/contribute");

        $response->assertOk();
        $response->assertJsonFragment(['message' => 'Music contribution recorded and auto-approved!']);
        
        $music->refresh();
        $this->assertTrue($music->is_approved);
    }

    public function test_admin_can_approve_music(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $music = Music::factory()->create(['is_approved' => false]);
        $token = JWTAuth::fromUser($admin);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/musics/{$music->id}/approve", ['action' => 'approve']);

        $response->assertOk();
        $response->assertJsonFragment(['message' => 'Music approved successfully.']);
        
        $music->refresh();
        $this->assertTrue($music->is_approved);
    }

    public function test_admin_can_reject_music(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $music = Music::factory()->create(['is_approved' => false]);
        $token = JWTAuth::fromUser($admin);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/musics/{$music->id}/approve", ['action' => 'reject']);

        $response->assertOk();
        $response->assertJsonFragment(['message' => 'Music rejected and deleted successfully.']);
        
        $this->assertSoftDeleted('musics', ['id' => $music->id]);
    }

    public function test_non_admin_cannot_approve_music(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $music = Music::factory()->create(['is_approved' => false]);
        $token = JWTAuth::fromUser($user);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/musics/{$music->id}/approve", ['action' => 'approve']);

        $response->assertStatus(403);
    }

    public function test_cannot_contribute_to_approved_music(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $music = Music::factory()->create(['is_approved' => true]);
        $token = JWTAuth::fromUser($user);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/musics/{$music->id}/contribute");

        $response->assertStatus(403);
    }

    public function test_music_creation_validation(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $token = JWTAuth::fromUser($user);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/musics', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['youtube_url']);
    }

    public function test_requires_authentication_for_creation(): void
    {
        $response = $this->postJson('/api/musics', [
            'youtube_url' => 'https://www.youtube.com/watch?v=s9kVG2ZaTS4'
        ]);

        $response->assertStatus(401);
    }

    public function test_requires_authentication_for_pending_musics(): void
    {
        $response = $this->getJson('/api/musics/pending');
        $response->assertStatus(401);
    }
}
