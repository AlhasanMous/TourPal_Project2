<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreGuideRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('admin');
    }

    public function rules(): array
    {
        return [
            'user_id'         => ['required', 'integer', 'exists:users,id'],
            'city_id'         => ['required', 'integer', 'exists:cities,id'],
            'specializations' => ['nullable', 'string', 'max:500'],
            'availability'    => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required'  => 'المستخدم مطلوب',
            'user_id.exists'    => 'المستخدم غير موجود',
            'city_id.required'  => 'المدينة مطلوبة',
            'city_id.exists'    => 'المدينة غير موجودة',
        ];
    }
}