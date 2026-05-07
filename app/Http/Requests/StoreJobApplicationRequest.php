<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Business Rule: Cek apakah lowongan masih dibuka
        $vacancy = $this->route('jobVacancy');
        return $vacancy && $vacancy->status->value === 'open';
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'whatsapp' => 'required|string|max:20',
            'message' => 'nullable|string|max:2000',
            'attachments' => 'required|array|max:10', // Batasi maksimal 5 file
            'attachments.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120', // 2MB per file
        ];
    }
}