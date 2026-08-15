<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransportRouteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('admin');
    }

    public function rules(): array
    {
        return [
            'company_id'          => ['required', 'integer', 'exists:transport_companies,id'],
            'origin_city_id'      => ['required', 'integer', 'exists:cities,id'],
            'destination_city_id' => ['required', 'integer', 'exists:cities,id', 'different:origin_city_id'],
            'duration_minutes'    => ['required', 'integer', 'min:1'],
            'price_approx'        => ['nullable', 'numeric', 'min:0'],
            'transport_type'      => ['required', 'in:bus,taxi,minibus,train,other'],
            'schedule_notes'      => ['nullable', 'string'],
            'is_active'           => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'company_id.required'             => 'الشركة مطلوبة',
            'company_id.exists'               => 'الشركة غير موجودة',
            'origin_city_id.required'         => 'مدينة الانطلاق مطلوبة',
            'destination_city_id.required'    => 'مدينة الوصول مطلوبة',
            'destination_city_id.different'   => 'مدينة الوصول يجب أن تختلف عن مدينة الانطلاق',
            'duration_minutes.required'       => 'مدة الرحلة مطلوبة',
            'transport_type.required'         => 'نوع وسيلة النقل مطلوب',
            'transport_type.in'               => 'النوع يجب أن يكون: bus, taxi, minibus, train, other',
        ];
    }
}