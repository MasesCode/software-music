<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    public function getJWTIdentifier(): string
    {
        return (string) $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }

    /** @var list<string> */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
    ];

    /** @var list<string> */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }

    public function musics()
    {
        return $this->hasMany(Music::class);
    }

    public function isAdmin(): bool
    {
        return $this->is_admin;
    }

    public function isNotAdmin(): bool
    {
        return !$this->is_admin;
    }

    public function scopeViewableBy(Builder $query, User $user): Builder
    {
        return $user->isAdmin()
            ? $query
            : $query->where('is_admin', false);
    }
}
