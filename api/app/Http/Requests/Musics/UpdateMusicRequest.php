<?php

namespace App\Http\Requests\Musics;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMusicRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'views' => 'sometimes|integer|min:0',
            'youtube_id' => 'sometimes|string|max:255',
            'thumb' => 'sometimes|string|url',
            'is_approved' => 'sometimes|boolean',
            'suggestion_reason' => 'sometimes|nullable|string|max:500',
        ];
    }
}
