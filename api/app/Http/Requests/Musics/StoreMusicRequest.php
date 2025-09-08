<?php

namespace App\Http\Requests\Musics;

use Illuminate\Foundation\Http\FormRequest;

class StoreMusicRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'youtube_url' => 'required|string|url',
            'suggestion_reason' => 'nullable|string|max:500',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->youtube_url) {
                $youtubeId = $this->extractYouTubeId($this->youtube_url);
                
                if ($youtubeId) {
                    $existingMusic = \App\Models\Music::where('youtube_id', $youtubeId)->first();
                    
                    if ($existingMusic) {
                        $validator->errors()->add('youtube_url', 'A music with this YouTube video has already been suggested.');
                    }
                }
            }
        });
    }

    private function extractYouTubeId($url)
    {
        $pattern = '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/';
        preg_match($pattern, $url, $matches);
        return isset($matches[1]) ? $matches[1] : null;
    }
}
