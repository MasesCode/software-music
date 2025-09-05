<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Music extends Model
{
    protected $table = 'musics';

    protected $fillable = [
        'title',
        'views',
        'youtube_id',
        'thumb',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
