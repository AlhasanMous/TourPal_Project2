<?php

namespace App\Http\Requests\Workspace;

use Illuminate\Foundation\Http\FormRequest;

class AddPlaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'place_id' => [
                'required',
                'integer',
                'exists:places,id',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'place_id.required' => 'المكان مطلوب',
            'place_id.exists'   => 'المكان غير موجود',
        ];
    }
}
