<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class RegistrationController extends Controller
{
    public function index()
    {
        // Kita bisa mengirim data poli/layanan dari database jika mau
        // Untuk sekarang kita hardcode di frontend atau kirim list sederhana
        return Inertia::render('Registration/Index', [
            'whatsapp_registration' => $setting->whatsapp_registration ?? '6289675873994',
        ]);
    }
}