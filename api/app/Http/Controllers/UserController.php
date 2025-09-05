<?php

namespace App\Http\Controllers;

use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Response;

class UserController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', User::class);

        $users = User::query()
            ->viewableBy(auth()->user())
            ->get();

        return response()->json([
            'message' => 'Users retrieved successfully.',
            'data' => $users
        ], Response::HTTP_OK);
    }

    public function store(StoreUserRequest $request)
    {
        $this->authorize('create', User::class);

        $user = User::create($request->validated());

        activity()
            ->performedOn($user)
            ->withProperties($request->validated())
            ->log('User created');

        return response()->json([
            'message' => 'User created successfully.',
            'data' => $user
        ], Response::HTTP_CREATED);
    }

    public function show(string $id)
    {
        $targetUser = User::findOrFail($id);
        $this->authorize('view', $targetUser);

        return response()->json([
            'message' => 'User retrieved successfully.',
            'data' => $targetUser
        ], Response::HTTP_OK);
    }

    public function update(UpdateUserRequest $request, string $id)
    {
        $targetUser = User::findOrFail($id);
        $this->authorize('update', $targetUser);

        $targetUser->update($request->validated());

        activity()
            ->performedOn($targetUser)
            ->withProperties($request->validated())
            ->log('User updated');

        return response()->json([
            'message' => 'User updated successfully.',
            'data' => $targetUser
        ], Response::HTTP_OK);
    }

    public function destroy(string $id)
    {
        $targetUser = User::findOrFail($id);
        $this->authorize('delete', $targetUser);

        activity()
            ->performedOn($targetUser)
            ->log('User deleted');

        $targetUser->delete();

        return response()->json([
            'message' => 'User deleted successfully.'
        ], Response::HTTP_OK);
    }
}
