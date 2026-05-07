<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Inertia\Inertia;

class PublicDoctorController extends Controller
{
    /**
     * Helper LAMA: Format jadwal dari JSON ke String tunggal.
     * Fungsi ini tetap ada untuk method `show` jika masih digunakan di sana.
     */
    private function formatScheduleToString($schedule)
    {
        if (empty($schedule)) return null;

        $activeDays = [];
        $timeRange = '';
        $daysOrder = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

        foreach ($daysOrder as $day) {
            // Asumsi struktur DB: {"senin": {"start": "08:00", "end": "12:00"}}
            if (isset($schedule[$day]) && !empty($schedule[$day]['start']) && !empty($schedule[$day]['end'])) {
                $activeDays[] = ucfirst($day);
                if (empty($timeRange)) {
                    $timeRange = $schedule[$day]['start'] . ' - ' . $schedule[$day]['end'];
                }
            }
        }

        if (empty($activeDays)) return 'Jadwal Menyusul';
        $daysString = implode(', ', $activeDays);
        return $daysString . ($timeRange ? ' (' . $timeRange . ' WIB)' : '');
    }

    /**
     * BARU: Helper untuk mengubah jadwal JSON dari DB ke format yang dibutuhkan frontend.
     * Menghasilkan object: { senin: "08.00 - 12.00", selasa: null, ... }
     */
    private function transformScheduleForFrontend($schedule)
    {
        if (empty($schedule)) {
            return null;
        }

        $formattedSchedule = [];
        $daysOrder = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

        foreach ($daysOrder as $day) {
            if (isset($schedule[$day]) && !empty($schedule[$day]['start']) && !empty($schedule[$day]['end'])) {
                // Menggabungkan waktu mulai dan selesai menjadi satu string
                $formattedSchedule[$day] = $schedule[$day]['start'] . ' - ' . $schedule[$day]['end'];
            } else {
                // Jika hari tidak ada jadwal, kirim null
                $formattedSchedule[$day] = null;
            }
        }

        return $formattedSchedule;
    }

    /**
     * DIUBAH: Menyesuaikan data untuk halaman list dokter.
     */
    public function index()
    {
        // Mengambil semua dokter, diurutkan berdasarkan nama
        $doctorsFromDb = Doctor::orderBy('name', 'asc')->get();

        // Mapping data agar sesuai dengan props komponen React DoctorsIndex.jsx
        $doctors = $doctorsFromDb->map(function ($doctor) {
            return [
                'id' => $doctor->id,
                'name' => $doctor->name,
                'specialization' => $doctor->specialization, // Ini adalah array dari DB
                'photo' => $doctor->image_path,         // Mapping 'image_path' dari DB ke 'photo'

                // DIUBAH: Menggunakan helper baru untuk format jadwal yang terstruktur
                // Frontend mengharapkan array berisi satu objek jadwal: [ { senin: ... } ]
                'schedules' => [$this->transformScheduleForFrontend($doctor->schedule)],
            ];
        });

        // Render ke: resources/js/Pages/Doctors/Index.jsx
        return Inertia::render('Doctors/Index', [
            'doctors' => $doctors,
        ]);
    }

    /**
     * Tidak diubah: Method show tetap seperti semula.
     */
    public function show(Doctor $doctor)
    {
        // Ambil relasi untuk detail lengkap
        $doctor->load(['educations', 'subSpecializations', 'workExperiences']);

        // Tambahkan format jadwal yang mudah dibaca ke object doctor (menggunakan helper lama)
        $doctor->formatted_schedule = $this->formatScheduleToString($doctor->schedule);

        // Render ke: resources/js/Pages/Doctors/Show.jsx
        return Inertia::render('Doctors/Show', [
            'doctor' => $doctor,
        ]);
    }

    
    public function apiIndex()
    {
        // Mengambil semua dokter, diurutkan berdasarkan nama
        // TIDAK PERLU `with('specialization')` karena specialization adalah field di tabel Doctor itu sendiri (array/JSON), bukan relasi
        $doctorsFromDb = Doctor::orderBy('name', 'asc')->get();

        // Mapping data agar sesuai dengan kebutuhan aplikasi mobile
        $doctors = $doctorsFromDb->map(function ($doctor) {
            return [
                'id' => $doctor->id,
            'name' => $doctor->name,
            'specialization' => $doctor->specialization, // Sesuaikan jika structure specialization beda
            'photo' => $doctor->image_url, // Gunakan accessor 'image_url'
            'biography' => $doctor->description, // Asumsi 'description' di model mapping ke 'biography' di frontend
            'educations' => $doctor->educations->map(fn($edu) => $edu->title)->toArray(), 
            'workExperiences' => $doctor->workExperiences->map(fn($exp) => $exp->title)->toArray(), 
            'schedules' => $this->transformScheduleForFrontend($doctor->schedule),
            ];
        });

        return response()->json($doctors);
    }

    /**
     * Mengembalikan detail satu dokter berdasarkan ID dalam format JSON untuk aplikasi mobile.
     */
    public function apiShow(Doctor $doctor) // Laravel Model Binding otomatis menemukan dokter
    {
        // Ambil relasi yang dibutuhkan untuk detail lengkap di mobile
        // TIDAK PERLU `specialization` di sini karena itu field langsung
        $doctor->load(['educations', 'subSpecializations', 'workExperiences']);

        // Persiapkan data agar sesuai dengan kebutuhan aplikasi mobile
        $formattedDoctor = [
            'id' => $doctor->id,
            'name' => $doctor->name,
            'specialization' => $doctor->specialization, // Sesuaikan jika structure specialization beda
            'photo' => $doctor->image_url, // Gunakan accessor 'image_url'
            'biography' => $doctor->description, // Asumsi 'description' di model mapping ke 'biography' di frontend
            'educations' => $doctor->educations->map(fn($edu) => $edu->title)->toArray(), 
            'workExperiences' => $doctor->workExperiences->map(fn($exp) => $exp->title)->toArray(), 
            'schedules' => $this->transformScheduleForFrontend($doctor->schedule),
            // Tambahkan data lain yang Anda butuhkan
        ];

        return response()->json($formattedDoctor);
    }
}