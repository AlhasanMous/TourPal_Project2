<?php

namespace App\Http\Requests\Guide;

use Illuminate\Foundation\Http\FormRequest;

class StoreGuideProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('guide', 'api');
    }

    public function rules(): array
    {
        return [
            'city_id'         => ['required', 'integer', 'exists:cities,id'],
            'specializations' => ['required', 'array', 'min:1'],
'specializations.*' => ['required', 'string', 'max:100'],
           
            'availability'    => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'city_id.required' => 'المدينة مطلوبة',
            'city_id.exists'   => 'المدينة غير موجودة',
        ];
    }
}