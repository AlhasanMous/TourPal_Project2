<?php

namespace App\Http\Requests\Booking;

use Illuminate\Foundation\Http\FormRequest;

class StoreAccommodationBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'accommodation_id' => ['required', 'integer', 'exists:accommodations,id'],
            'check_in'         => ['required', 'date', 'date_format:Y-m-d', 'after_or_equal:today'],
            'check_out'        => ['required', 'date', 'date_format:Y-m-d', 'after:check_in'],
            'room_type'        => ['required', 'in:private,shared'],
            'workspace_id'     => ['nullable', 'integer', 'exists:workspaces,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'accommodation_id.required'   => 'مكان الإقامة مطلوب',
            'accommodation_id.exists'     => 'مكان الإقامة غير موجود',
            'check_in.required'           => 'تاريخ الوصول مطلوب',
            'check_in.date_format'        => 'تاريخ الوصول يجب أن يكون بصيغة YYYY-MM-DD',
            'check_in.after_or_equal'     => 'تاريخ الوصول يجب أن يكون اليوم أو بعده',
            'check_out.required'          => 'تاريخ المغادرة مطلوب',
            'check_out.date_format'       => 'تاريخ المغادرة يجب أن يكون بصيغة YYYY-MM-DD',
            'check_out.after'             => 'تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول',
            'room_type.required'          => 'نوع الغرفة مطلوب',
            'room_type.in'               => 'نوع الغرفة يجب أن يكون: private أو shared',
            'workspace_id.exists'         => 'مساحة العمل غير موجودة',
        ];
    }
}