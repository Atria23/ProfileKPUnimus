<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Setting;

class ContactController extends Controller
{
    /**
     * Menampilkan halaman kontak.
     */
    
    public function index()
    {
        // Mengambil data setting (menggunakan first() karena biasanya hanya ada 1 baris setting)
        $setting = Setting::first();

        return Inertia::render('Contact', [
            'setting' => $setting
        ]);
    }

    public function apiIndex()
    {
        // Mengambil data setting
        $setting = Setting::first();

        // Jika tidak ada data setting, kembalikan 404 atau data default kosong
        if (!$setting) {
            return response()->json(['message' => 'Contact information not found'], 404);
        }

        // Siapkan data dalam format yang diinginkan untuk API, sesuai dengan model Setting Anda.
        $contactDataForApi = [
            'vision' => $setting->vision ?? null, // <-- TAMBAHKAN INI
            'mission' => $setting->mission ?? null, // <-- TAMBAHKAN INI (ini akan menjadi array PHP)
            'whatsappRegistration' => $setting->whatsapp_registration ?? null,
            'whatsappInformation' => $setting->whatsapp_information ?? null,
            'address' => $setting->address ?? null,
            'googleMapsLink' => $setting->google_maps_link ?? null,
            'email' => $setting->email ?? null,
            'operatingHours' => '24 Jam Setiap Hari (Hari Libur Buka)', // Asumsi statis
            
            'socialMedia' => $setting->social_media ?? [], // Akan jadi JSON object/array

            // Tambahkan platform lain jika ada di array social_media Anda
        ];

        return response()->json($contactDataForApi);
    }
}