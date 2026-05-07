<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiConsultationController extends Controller
{
    public function index()
    {
        return Inertia::render('Consult/AiConsultation');
    }

    public function analyze(Request $request)
    {
        // [DEBUG] 1. Log saat request masuk
        Log::info('>>> START AI CONSULTATION: Request diterima', [
            'gejala_awal' => $request->symptoms
        ]);

        $request->validate([
            'symptoms' => 'required|array|min:1',
            'description' => 'nullable|string|max:500',
        ]);

        try {
            $apiKey = config('services.gemini.key', env('GOOGLE_AI_API_KEY'));
            
            if (empty($apiKey)) {
                throw new \Exception('API Key Google AI belum disetting.');
            }

            // Konteks Klinik
            $klinikContext = [
                ['poli' => 'POLI UMUM', 'dokter' => 'dr. Ahmad', 'jam' => '08.00 - 12.00', 'fokus' => 'Demam, flu, batuk, pusing, nyeri badan, penyakit umum.'],
                ['poli' => 'POLI UMUM', 'dokter' => 'dr. Budi', 'jam' => '13.00 - 16.00', 'fokus' => 'Demam, flu, batuk, pusing, nyeri badan, penyakit umum.'],
                ['poli' => 'POLI GIGI', 'dokter' => 'drg. Siti', 'jam' => '09.00 - 15.00', 'fokus' => 'Sakit gigi, gusi bengkak, cabut gigi.'],
                ['poli' => 'KIA (Ibu & Anak)', 'dokter' => 'Bidan Rina', 'jam' => '08.00 - 14.00', 'fokus' => 'Kehamilan, imunisasi, balita sakit ringan, KB.'],
                ['poli' => 'IGD', 'dokter' => 'Tim Medis Jaga', 'jam' => '24 Jam', 'fokus' => 'Pendarahan, sesak nafas berat, pingsan, kecelakaan, luka bakar parah.'],
            ];

            $contextString = "DAFTAR LAYANAN & DOKTER TERSEDIA DI KLINIK:\n";
            foreach ($klinikContext as $ctx) {
                $contextString .= "- Poli: {$ctx['poli']} | Dokter: {$ctx['dokter']} ({$ctx['jam']}) | Menangani: {$ctx['fokus']}\n";
            }

            $symptoms = implode(', ', $request->symptoms);
            $description = $request->description ?? 'Tidak ada deskripsi tambahan.';

            $prompt = "Kamu adalah asisten triase medis virtual.\n\n" .
                      $contextString . "\n" .
                      "DATA PASIEN:\n- Gejala: {$symptoms}\n- Detail: {$description}\n\n" .
                      "TUGAS: Analisis keluhan & tentukan Poli Tujuan.\n" .
                      "PENTING: Output HANYA JSON valid. Format:\n" .
                      "{\n" .
                      "  \"urgensi\": \"Rendah/Sedang/Tinggi\",\n" .
                      "  \"poli\": \"...\",\n" .
                      "  \"dokter\": [{\"nama\": \"...\", \"jam\": \"...\"}],\n" .
                      "  \"ringkasan\": \"...\",\n" .
                      "  \"saran\": \"...\"\n" .
                      "}";

            Log::info('>>> MENGHUBUNGI GOOGLE GEMINI...');

            // --- PERBAIKAN PENTING: Menggunakan gemini-1.5-flash (Versi Stabil) ---
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

            $response = Http::timeout(60)
                ->withoutVerifying()
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($url, [
                    'contents' => [['parts' => [['text' => $prompt]]]]
                ]);

            if ($response->failed()) {
                Log::error('>>> GAGAL: Google API Error', ['body' => $response->body()]);
                throw new \Exception('Gagal menghubungi layanan AI. Silakan coba lagi.');
            }

            Log::info('>>> SUKSES: Respon diterima');

            $result = $response->json();
            $aiText = $result['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
            $cleanJson = str_replace(['```json', '```'], '', $aiText);
            $parsedData = json_decode($cleanJson, true);

            if (!$parsedData) {
                throw new \Exception("Format data dari AI tidak valid.");
            }

            // --- PERBAIKAN: Mengirim nomor WA ke Frontend ---
            return Inertia::render('Consult/AiResult', [
                'result' => $parsedData,
                'input' => [
                    'symptoms' => $request->symptoms,
                    'description' => $description
                ],
                // Nomor WA Admin ditambahkan di sini
                'admin_wa' => '62895616833383' 
            ]);

        } catch (\Exception $e) {
            Log::error('>>> EXCEPTION: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }
}