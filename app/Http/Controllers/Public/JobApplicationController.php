<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\JobVacancy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class JobApplicationController extends Controller
{
    public function store(Request $request, JobVacancy $jobVacancy)
    {
        // Validasi input type (hanya menerima 'email' atau 'whatsapp')
        $request->validate([
            'type' => 'required|in:email,whatsapp',
        ]);

        $requestedType = $request->input('type');

        // Cari kanal spesifik yang diminta user dari daftar kanal lowongan ini
        // Asumsi: submission_channels adalah array atau collection JSON/Relasi
        // Kita filter collection untuk mencari tipe yang cocok
        $channel = collect($jobVacancy->submission_channels)
            ->where('type', $requestedType)
            ->first();

        if (!$channel) {
            return back()->withErrors(['submission' => "Kanal pengiriman via {$requestedType} tidak tersedia untuk lowongan ini."]);
        }

        Log::info('Applicant chose submission channel.', [
            'vacancy_id' => $jobVacancy->id,
            'channel' => $channel['type']
        ]);

        switch ($channel['type']) {
            case 'email':
                $subject = "Lamaran Pekerjaan: {$jobVacancy->profession}";
                
                // URL Gmail Compose
                $gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1" .
                            "&to=" . $channel['value'] .
                            "&su=" . rawurlencode($subject);

                return Inertia::location($gmailUrl);

            case 'whatsapp':
                $message = "Lamaran Pekerjaan: *{$jobVacancy->profession}*.";
                
                // URL WhatsApp API
                $waUrl = "https://wa.me/{$channel['value']}?text=" . urlencode($message);
                
                return Inertia::location($waUrl);
            
            default:
                return back()->withErrors(['submission' => 'Tipe kanal tidak valid.']);
        }
    }
}