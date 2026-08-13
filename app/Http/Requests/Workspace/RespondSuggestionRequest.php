<?php

namespace App\Http\Requests\Workspace;

use Illuminate\Foundation\Http\FormRequest;

class RespondSuggestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action'           => ['required', 'in:accept,reject'],
            'rejection_reason' => ['required_if:action,reject', 'nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'action.required'                  => 'القرار مطلوب (accept أو reject)',
            'action.in'                        => 'القرار يجب أن يكون accept أو reject',
            'rejection_reason.required_if'     => 'سبب الرفض مطلوب عند رفض الاقتراح',
        ];
    }
}