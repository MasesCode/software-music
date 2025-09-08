<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Music extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $table = 'musics';

    protected $fillable = [
        'title',
        'views',
        'youtube_id',
        'thumb',
        'user_id',
        'is_approved',
        'count_to_approve',
        'suggestion_reason',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'count_to_approve' => 'integer',
        'views' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contributions()
    {
        return $this->hasMany(MusicContribution::class);
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('is_approved', true);
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('is_approved', false);
    }

    public function scopeTopFive(Builder $query): Builder
    {
        return $query->approved()->orderBy('views', 'desc')->limit(5);
    }

    public function scopeAfterTopFive(Builder $query): Builder
    {
        return $query->approved()->orderBy('views', 'desc')->offset(5);
    }

    public function isApproved(): bool
    {
        return $this->is_approved;
    }

    public function isPending(): bool
    {
        return !$this->is_approved;
    }

    public function incrementApprovalCount(): void
    {
        $this->increment('count_to_approve');
    }

    public function shouldAutoApprove(): bool
    {
        return $this->count_to_approve >= 5;
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['title', 'views', 'youtube_id', 'is_approved', 'count_to_approve', 'suggestion_reason'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
