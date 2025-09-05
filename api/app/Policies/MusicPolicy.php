<?php

namespace App\Policies;

use App\Models\Music;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MusicPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Music $music): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Music $music): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Music $music): bool
    {
        return $user->isAdmin();
    }

    public function restore(User $user, Music $music): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, Music $music): bool
    {
        return $user->isAdmin();
    }

    public function approve(User $user, Music $music): bool
    {
        return $user->isAdmin();
    }

    public function contribute(User $user, Music $music): bool
    {
        return !$music->isApproved();
    }
}
