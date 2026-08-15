<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransportCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('admin');
    }

    public function rules(): array
    {
        return [
            'name_ar'   => ['required', 'string', 'max:255'],
            'name_en'   => ['required', 'string', 'max:255'],
            'phone'     => ['nullable', 'string', 'max:50'],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name_ar.required' => 'اسم الشركة بالعربي مطلوب',
            'name_en.required' => 'اسم الشركة بالإنجليزي مطلوب',
        ];
    }
}