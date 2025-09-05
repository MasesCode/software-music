<?php

namespace App\Http\Requests\Musics;

use Illuminate\Foundation\Http\FormRequest;

class ApproveMusicRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => 'required|string|in:approve,reject',
        ];
    }
}
