<?php

namespace App\Http\Requests\Guide;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGuideProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('guide');
    }

    public function rules(): array
    {
        return [
            'city_id'         => ['sometimes', 'integer', 'exists:cities,id'],
            'specializations' => ['sometimes', 'nullable', 'string', 'max:500'],
            'availability'    => ['sometimes', 'nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'city_id.exists' => 'المدينة غير موجودة',
        ];
    }
}