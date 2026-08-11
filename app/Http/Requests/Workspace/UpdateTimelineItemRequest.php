<?php

namespace App\Http\Requests\Workspace;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTimelineItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'planned_date' => ['sometimes', 'date', 'date_format:Y-m-d'],
            'planned_time' => ['sometimes', 'nullable', 'date_format:H:i'],
            'order_in_day' => ['sometimes', 'integer', 'min:0'],
            'label'        => ['sometimes', 'nullable', 'string', 'max:500'],
            'notes'        => ['sometimes', 'nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'planned_date.date'        => 'تاريخ النشاط غير صحيح',
            'planned_date.date_format' => 'تاريخ النشاط يجب أن يكون بصيغة YYYY-MM-DD',
            'planned_time.date_format' => 'وقت النشاط يجب أن يكون بصيغة HH:MM',
            'order_in_day.integer'     => 'الترتيب يجب أن يكون رقماً صحيحاً',
            'order_in_day.min'         => 'الترتيب يجب أن يكون 0 أو أكثر',
            'label.max'                => 'العنوان يجب أن لا يتجاوز 500 حرف',
            'notes.max'                => 'الملاحظات يجب أن لا تتجاوز 2000 حرف',
        ];
    }
}
