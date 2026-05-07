<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Facility;
use App\Models\Service;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ClinicAIController extends Controller
{
    protected string $geminiApiUrl;

    public function __construct()
    {
        $apiKey = config('services.gemini.key', env('GOOGLE_AI_API_KEY'));
        // Menggunakan model flash untuk respons cepat
        $this->geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";
    }

    

    public function processQuery(Request $request)
    {
        try {
            $query = $request->input('query', '');

            if (empty($query)) {
                return response()->json([
                    'reply' => [
                        'text' => "Halo! Saya asisten virtual Klinik Pratama UNIMUS. Saya dapat membantu memberikan informasi jadwal dokter, pendaftaran, dan layanan poli.",
                        'suggestions' => ['Jadwal Dokter Hari Ini', 'Nomor WA Pendaftaran', 'Layanan Poli Umum']
                    ]
                ]);
            }

            // Gunakan key cache baru (_v5) untuk memastikan struktur data baru termuat
            $knowledgeBase = Cache::remember('clinic_ai_knowledge_base_v5', 600, function () {
                return $this->buildKnowledgeBase();
            });

            $aiResponse = $this->askGemini($query, $knowledgeBase);

            if (!$aiResponse) {
                throw new \Exception("Tidak ada respon dari AI.");
            }

            return response()->json(['reply' => $aiResponse]);

        } catch (\Exception $e) {
            Log::error("ClinicAI Error: " . $e->getMessage());
            return response()->json([
                'reply' => [
                    'text' => "Mohon maaf, saat ini sistem sedang sibuk. Silakan coba tanyakan 'Jadwal Dokter' atau 'Kontak'.",
                    'suggestions' => ['Jadwal Dokter', 'Kontak Admin']
                ]
            ], 200);
        }
    }

    private function buildKnowledgeBase(): string
    {
        $info = [];

        // --- 1. SETTING (DISESUAIKAN DENGAN SettingResource) ---
        $setting = Setting::first();
        if ($setting) {
            $info[] = "=== KONTAK & PENDAFTARAN ===";
            $info[] = "Nama Klinik: Klinik Pratama UNIMUS";
            $info[] = "Alamat: " . ($setting->address ?? 'Semarang');
            
            // [FIX] Mengambil langsung dari kolom database sesuai SettingResource
            if (!empty($setting->whatsapp_registration)) {
                $info[] = "Nomor WhatsApp Pendaftaran: {$setting->whatsapp_registration}";
            }
            if (!empty($setting->whatsapp_information)) {
                $info[] = "Nomor WhatsApp Informasi: {$setting->whatsapp_information}";
            }
            if (!empty($setting->email)) {
                $info[] = "Email: {$setting->email}";
            }
            
            $info[] = ""; 
        }

        // --- 2. JADWAL DOKTER (DISESUAIKAN DENGAN DoctorResource) ---
        $doctors = Doctor::get();
        if ($doctors->count() > 0) {
            $info[] = "=== DATA DOKTER & JADWAL ===";
            
            // Urutan hari untuk pengecekan yang rapi
            $daysOrder = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

            foreach ($doctors as $doc) {
                // Handle spesialisasi (bisa array/tags atau string)
                $specs = is_array($doc->specialization) ? implode(', ', $doc->specialization) : ($doc->specialization ?? 'Umum');
                
                $info[] = "Dokter: {$doc->name}";
                $info[] = "Poli/Spesialis: {$specs}";

                // [FIX] Parsing Jadwal JSON dari DoctorResource
                $scheduleStr = [];
                $scheduleData = $doc->schedule; // Asumsi di model ada protected $casts = ['schedule' => 'array'];

                if (!empty($scheduleData) && is_array($scheduleData)) {
                    foreach ($daysOrder as $dayKey) {
                        // Cek apakah key hari ada dan memiliki jam start/end
                        if (isset($scheduleData[$dayKey]['start']) && !empty($scheduleData[$dayKey]['start'])) {
                            
                            $start = $scheduleData[$dayKey]['start'];
                            $end = $scheduleData[$dayKey]['end'] ?? 'Selesai';
                            
                            // Format: Senin (08:00 - 12:00)
                            $scheduleStr[] = "- " . ucfirst($dayKey) . ": {$start} s/d {$end} WIB";
                        }
                    }
                }

                if (!empty($scheduleStr)) {
                    $info[] = "Jadwal Praktik:\n" . implode("\n", $scheduleStr);
                } else {
                    $info[] = "Jadwal Praktik: Belum tersedia, silakan hubungi WA Pendaftaran.";
                }
                $info[] = "---";
            }
            $info[] = "";
        }

        // --- 3. LAYANAN (DISESUAIKAN DENGAN ServiceResource) ---
        // [FIX] Mengambil layanan aktif dan membersihkan HTML tags
        $services = Service::where('status', 1)->get();
        if ($services->count() > 0) {
            $info[] = "=== LAYANAN MEDIS ===";
            foreach ($services as $service) {
                // Strip tags karena field 'content' adalah RichEditor
                $cleanContent = strip_tags($service->content ?? '');
                $cleanContent = preg_replace('/\s+/', ' ', $cleanContent); // Hapus spasi berlebih
                $desc = Str::limit($cleanContent, 150); 
                
                $category = $service->is_featured ? "(Layanan Unggulan)" : "";
                
                $info[] = "Layanan: {$service->title} {$category}";
                $info[] = "Info: {$desc}";
                $info[] = "---";
            }
            $info[] = "";
        }

        // --- 4. FASILITAS ---
        $facilities = Facility::where('status', 1)->get();
        if ($facilities->count() > 0) {
            $info[] = "=== FASILITAS ===";
            foreach ($facilities as $facility) {
                 // Handle jika content array atau string
                 $desc = is_array($facility->content) ? implode(', ', $facility->content) : strip_tags($facility->content);
                 $info[] = "- {$facility->title}: {$desc}";
            }
        }

        return implode("\n", $info);
    }

    private function askGemini(string $userQuery, string $context): ?array
    {
        // [FIX] Paksa Timezone Jakarta agar "Pagi/Sore" akurat
        date_default_timezone_set('Asia/Jakarta');
        Carbon::setLocale('id');
        
        $now = Carbon::now('Asia/Jakarta');
        $todayIndo = strtolower($now->translatedFormat('l')); // senin, selasa...
        $fullDate = $now->translatedFormat('l, d F Y');
        $currentTime = $now->format('H:i');
        
        // Tentukan periode waktu
        $hour = $now->hour;
        if ($hour >= 4 && $hour < 11) $sapaan = "Pagi";
        elseif ($hour >= 11 && $hour < 15) $sapaan = "Siang";
        elseif ($hour >= 15 && $hour < 18) $sapaan = "Sore";
        else $sapaan = "Malam";

        $systemPrompt = "
        PERAN: Customer Service AI Klinik Pratama UNIMUS.
        
        WAKTU SEKARANG: 
        Hari: $todayIndo (Gunakan ini untuk cek jadwal dokter hari ini)
        Tanggal: $fullDate
        Jam: $currentTime WIB ($sapaan)

        DATA KLINIK (SUMBER KEBENARAN):
        $context

        ATURAN JAWABAN:
        1. Jawablah pertanyaan \"$userQuery\" dengan singkat, padat, dan ramah.
        2. JIKA DITANYA JADWAL HARI INI ($todayIndo): Cari dokter yang memiliki jadwal di hari '$todayIndo'. Jika tidak ada, katakan 'Tidak ada dokter yang praktik hari ini'.
        3. JIKA DITANYA WA PENDAFTARAN: Berikan nomor 'WhatsApp Pendaftaran' dari data di atas.
        4. JIKA DITANYA LAYANAN: Jelaskan layanan berdasarkan data 'LAYANAN MEDIS'.
        5. Jangan mengarang informasi yang tidak ada di data.
        6. Gunakan format list (bullet points) jika menyebutkan banyak item (seperti daftar dokter atau layanan).
        ";

        try {
            $response = Http::withHeaders(['Content-Type' => 'application/json'])
                ->post($this->geminiApiUrl, [
                    'contents' => [['parts' => [['text' => $systemPrompt]]]],
                    'generationConfig' => [
                        'temperature' => 0.3, 
                        'maxOutputTokens' => 10000, // [FIX] Token besar agar jawaban tidak terpotong
                    ]
                ]);

            if ($response->successful()) {
                $text = data_get($response->json(), 'candidates.0.content.parts.0.text');
                return [
                    'text' => $this->cleanFormatting(trim($text)),
                    'suggestions' => $this->generateSuggestions($userQuery)
                ];
            } else {
                Log::error('Gemini API Error: ' . $response->body());
                return null;
            }
        } catch (\Exception $e) {
            Log::error('Gemini Connection Error: ' . $e->getMessage());
            return null;
        }
    }

    private function cleanFormatting($text)
    {
        // Membersihkan markdown yang berlebihan jika perlu
        return str_replace(['**', '##'], '', $text);
    }

    private function generateSuggestions(string $query): array
    {
        $q = strtolower($query);
        if (str_contains($q, 'dokter') || str_contains($q, 'jadwal')) return ['Cara Pendaftaran', 'Layanan BPJS', 'Lokasi Klinik'];
        if (str_contains($q, 'daftar') || str_contains($q, 'wa')) return ['Jadwal Dokter', 'Syarat Pendaftaran'];
        if (str_contains($q, 'layanan') || str_contains($q, 'poli')) return ['Jadwal Dokter', 'Fasilitas'];
        
        return ['Jadwal Dokter Hari Ini', 'Nomor WA Pendaftaran', 'Layanan Poli Umum'];
    }
}