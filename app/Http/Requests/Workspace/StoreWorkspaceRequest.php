<?php

namespace App\Http\Requests\Workspace;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreWorkspaceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
   public function rules(): array
    {
        return [
            'name'            => ['required', 'string', 'max:255'],
            'description'     => ['nullable', 'string'],
            'trip_start_date' => ['nullable', 'date'],
            'trip_end_date'   => ['nullable', 'date', 'after_or_equal:trip_start_date'],
            'is_public'       => ['boolean'],
        ];
    }
     public function messages(): array
    {
        return [
            'name.required'              => 'اسم مساحة العمل مطلوب',
            'trip_end_date.after_or_equal' => 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية',
        ];
    }
}
