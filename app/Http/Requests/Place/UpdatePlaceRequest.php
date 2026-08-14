<?php

namespace App\Http\Requests\Place;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePlaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('admin');
    }

    public function rules(): array
    {
        $placeId = $this->route('place')?->id;

        return [
            'name_ar' => [
                'required',
                'string',
                'max:255',
                Rule::unique('places', 'name_ar')->ignore($placeId),
            ],
            'name_en' => [
                'required',
                'string',
                'max:255',
                Rule::unique('places', 'name_en')->ignore($placeId),
            ],
            'description_ar'       => ['required', 'string'],
            'description_en'       => ['required', 'string'],
            'city_id'              => ['required', 'exists:cities,id'],
            'category'             => ['required', 'in:historical,nature,beach,adventure'],
            'visit_duration_hours' => ['required', 'integer', 'min:1'],
            'opening_hours'        => ['nullable', 'array'],
            'opening_hours.*'      => ['nullable', 'array'],
            'opening_hours.*.open' => ['nullable', 'date_format:H:i'],
            'opening_hours.*.close' => ['nullable', 'date_format:H:i'],

            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
                'required_without:image_url',
            ],

            'image_url' => [
                'nullable',
                'url',
                'required_without:image',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name_ar.required'        => 'اسم المكان بالعربي مطلوب',
            'name_en.required'        => 'اسم المكان بالإنجليزي مطلوب',
            'description_ar.required' => 'الوصف بالعربي مطلوب',
            'description_en.required' => 'الوصف بالإنجليزي مطلوب',
            'city_id.required'        => 'المدينة مطلوبة',
            'city_id.exists'          => 'المدينة غير موجودة',
            'category.required'       => 'الفئة مطلوبة',
            'category.in'             => 'الفئة يجب أن تكون: historical, nature, beach, adventure',
            'visit_duration_hours.required' => 'مدة الزيارة مطلوبة',
            'visit_duration_hours.min'      => 'مدة الزيارة يجب أن تكون ساعة على الأقل',
            'image.image'             => 'الملف المرفوع يجب أن يكون صورة',
            'image_url.url'           => 'رابط الصورة غير صالح',
        ];
    }
}
