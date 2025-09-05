<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, User $model): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, User $model): bool
    {
        if (!$user->isAdmin()) {
            return false;
        }
        
        if ($user->id === $model->id) {
            return false;
        }
        
        return true;
    }

    public function restore(User $user, User $model): bool
    {
        return false;
    }

    public function forceDelete(User $user, User $model): bool
    {
        return false;
    }

    public function viewAny(User $user): bool
    {
        return $user !== null;
    }

    public function view(User $user, User $model): bool
    {
        return $user->isAdmin() || $model->is_admin === false;
    }

    public function getViewableUsers(User $user)
    {
        if ($user->isAdmin()) {
            return User::all();
        }
        
        return User::where('is_admin', false)->get();
    }
}
