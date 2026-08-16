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
            'image'     => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120', 'required_without:image_url'],
            'image_url' => ['nullable', 'url', 'required_without:image'],
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