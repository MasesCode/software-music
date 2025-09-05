<?php

namespace Database\Seeders;

use App\Models\Music;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MusicSeeder extends Seeder
{
    public function run(): void
    {
        $userId = User::query()->where('email', 'admin@email.com')->first()->id ?? 1;
        $initialMusics = [
            [
                'title' => 'O Mineiro e o Italiano',
                'views' => 5200000,
                'youtube_id' => 's9kVG2ZaTS4',
                'thumb' => 'https://img.youtube.com/vi/s9kVG2ZaTS4/hqdefault.jpg',
                'user_id' => $userId,
            ],
            [
                'title' => 'Pagode em Brasília',
                'views' => 5000000,
                'youtube_id' => 'lpGGNA6_920',
                'thumb' => 'https://img.youtube.com/vi/lpGGNA6_920/hqdefault.jpg',
                'user_id' => $userId,
            ],
            [
                'title' => 'Rio de Lágrimas',
                'views' => 153000,
                'youtube_id' => 'FxXXvPL3JIg',
                'thumb' => 'https://img.youtube.com/vi/FxXXvPL3JIg/hqdefault.jpg',
                'user_id' => $userId,
            ],
            [
                'title' => 'Tristeza do Jeca',
                'views' => 154000,
                'youtube_id' => 'tRQ2PWlCcZk',
                'thumb' => 'https://img.youtube.com/vi/tRQ2PWlCcZk/hqdefault.jpg',
                'user_id' => $userId,
            ],
            [
                'title' => 'Terra roxa',
                'views' => 3300000,
                'youtube_id' => '4Nb89GFu2g4',
                'thumb' => 'https://img.youtube.com/vi/4Nb89GFu2g4/hqdefault.jpg',
                'user_id' => $userId,
            ]
        ];

        foreach ($initialMusics as $music) {
            Music::updateOrCreate($music);
        }
    }
}
