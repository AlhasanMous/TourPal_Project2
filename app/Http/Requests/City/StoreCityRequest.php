<?php

namespace App\Http\Requests\City;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
       return $this->user()->hasRole('admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
{
    $cityId = $this->route('city') instanceof \App\Models\City
        ? $this->route('city')->id
        : $this->route('city');

    return [
        'name_ar' => [
            'required',
            'string',
            'max:255',
            Rule::unique('cities', 'name_ar')->ignore($cityId),
        ],
        'name_en' => [
            'required',
            'string',
            'max:255',
            Rule::unique('cities', 'name_en')->ignore($cityId), // ← name_en
        ],
        'region' => ['required', 'string', 'max:255'],
    ];
}
      public function messages(): array
    {
        return [
            'name_ar.required' => 'اسم المدينة بالعربي مطلوب',
            'name_ar.unique'   => 'هذه المدينة موجودة مسبقاً',
            'name_en.required' => 'اسم المدينة بالإنجليزي مطلوب',
            'name_en.unique'   => 'هذه المدينة موجودة مسبقاً',
            'region.required'  => 'المنطقة مطلوبة',
        ];
    }
}
