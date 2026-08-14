<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class VerifyGuideRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('admin');
    }

    public function rules(): array
    {
        return [
            'action'           => ['required', 'in:verify,reject'],
            'rejection_reason' => ['required_if:action,reject', 'nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'action.required'              => 'القرار مطلوب',
            'action.in'                    => 'القرار يجب أن يكون verify أو reject',
            'rejection_reason.required_if' => 'سبب الرفض مطلوب عند رفض المرشد',
        ];
    }
}