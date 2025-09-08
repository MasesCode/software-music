<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MusicContribution extends Model
{
    protected $fillable = [
        'music_id',
        'user_id',
    ];

    public function music(): BelongsTo
    {
        return $this->belongsTo(Music::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
