<?php

namespace Tests\Unit;

use App\Models\User;
use App\Policies\UserPolicy;
use Tests\TestCase;

class UserPolicyTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_admin_can_view_any_user(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $targetUser = User::factory()->create(['is_admin' => false]);
        
        $policy = new UserPolicy();
        
        $this->assertTrue($policy->view($admin, $targetUser));
    }

    public function test_admin_can_view_admin_user(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $targetAdmin = User::factory()->create(['is_admin' => true]);
        
        $policy = new UserPolicy();
        
        $this->assertTrue($policy->view($admin, $targetAdmin));
    }

    public function test_non_admin_cannot_view_admin_user(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $adminUser = User::factory()->create(['is_admin' => true]);
        
        $policy = new UserPolicy();
        
        $this->assertFalse($policy->view($user, $adminUser));
    }

    public function test_non_admin_can_view_non_admin_user(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $targetUser = User::factory()->create(['is_admin' => false]);
        
        $policy = new UserPolicy();
        
        $this->assertTrue($policy->view($user, $targetUser));
    }

    public function test_admin_can_create_user(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        
        $policy = new UserPolicy();
        
        $this->assertTrue($policy->create($admin));
    }

    public function test_non_admin_cannot_create_user(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        
        $policy = new UserPolicy();
        
        $this->assertFalse($policy->create($user));
    }

    public function test_admin_can_update_user(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $targetUser = User::factory()->create(['is_admin' => false]);
        
        $policy = new UserPolicy();
        
        $this->assertTrue($policy->update($admin, $targetUser));
    }

    public function test_non_admin_cannot_update_user(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $targetUser = User::factory()->create(['is_admin' => false]);
        
        $policy = new UserPolicy();
        
        $this->assertFalse($policy->update($user, $targetUser));
    }

    public function test_admin_can_delete_user(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $targetUser = User::factory()->create(['is_admin' => false]);
        
        $policy = new UserPolicy();
        
        $this->assertTrue($policy->delete($admin, $targetUser));
    }

    public function test_admin_cannot_delete_themselves(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        
        $policy = new UserPolicy();
        
        $this->assertFalse($policy->delete($admin, $admin));
    }

    public function test_non_admin_cannot_delete_user(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $targetUser = User::factory()->create(['is_admin' => false]);
        
        $policy = new UserPolicy();
        
        $this->assertFalse($policy->delete($user, $targetUser));
    }

    public function test_get_viewable_users_for_admin(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        User::factory()->create(['is_admin' => false]);
        User::factory()->create(['is_admin' => true]);
        
        $policy = new UserPolicy();
        $users = $policy->getViewableUsers($admin);
        
        $this->assertCount(3, $users);
    }

    public function test_get_viewable_users_for_non_admin(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        User::factory()->create(['is_admin' => false]);
        User::factory()->create(['is_admin' => true]);
        
        $policy = new UserPolicy();
        $users = $policy->getViewableUsers($user);
        
        $this->assertCount(2, $users);
    }
}
