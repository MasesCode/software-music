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
}
