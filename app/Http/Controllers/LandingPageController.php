<?php

// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Http; // Menggunakan HTTP Client bawaan Laravel
// use Illuminate\Support\Facades\Log;
// use Inertia\Inertia;

// class LandingPageController extends Controller
// {
    
//     private function getContactData()
//     {
//         return [
//             'facebook' => 'https://www.facebook.com/people/klinikpratamaunimus_official/100083638056092/?_rdr',
//             'instagram' => 'https://www.instagram.com/klinikpratamaunimus_official?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
//             'tiktok' => 'https://www.tiktok.com/@klinik.unimus?is_from_webapp=1&sender_device=pc',
//             'whatsapp' => '62895616833383',
//             'whatsappInfo' => '6289675873994',
//             'email' => 'klinikpratamarawatinap@unimus.ac.id',
//             'operatingHours' => '24 Jam Setiap Hari (Hari Libur Buka)',
//             'address' => 'Jl. Petek Kp. Gayam RT. 02 RW. 06, Kel. Dadapsari, Kec. Semarang Utara., Semarang, Indonesia',
//             'googleMapsLink' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.350360767373!2d110.41688021057558!3d-6.967929793003591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70f514ab8380d5%3A0x7fde5e6fc3fbbf9f!2sKlinik%20Pratama%20UNIMUS!5e0!3m2!1sid!2sid!4v1756783641742!5m2!1sid!2sid'
//         ];
//     }

//     /**
//      * Menampilkan halaman utama (landing page).
//      *
//      * @return \Inertia\Response
//      */
//     public function index()
//     {
//         $services = [
//             ['id' => 1, 'name' => 'Konsultasi Dokter Umum'],
//             ['id' => 2, 'name' => 'Pemeriksaan Laboratorium'],
//             ['id' => 3, 'name' => 'Vaksinasi'],
//             ['id' => 4, 'name' => 'Kesehatan Ibu & Anak'],
//         ];

//         // Data cadangan jika API gagal atau tidak ada ulasan
//         $googleReviews = [
//             ['id' => 1, 'name' => 'Belum Ada Ulasan', 'avatar' => '/images/avatar-default.jpg', 'rating' => 5, 'text' => 'Jadilah yang pertama memberikan ulasan untuk layanan kami di Google!', 'time' => 'Baru saja'],
//         ];

//         return Inertia::render('LandingPage', [
//             'services' => $services,
//             'googleReviews' => $googleReviews,
//             'testimonials' => array_slice($googleReviews, 0, 2), // Hanya ambil 2 ulasan pertama untuk testimoni
//             'contact' => [
//                 'phone' => '+62 895-6168-33383',
//                 'facebook' => 'https://www.facebook.com/people/klinikpratamaunimus_official/100083638056092/?_rdr',
//                 'instagram' => 'https://www.instagram.com/klinikpratamaunimus_official?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
//                 'tiktok' => 'https://www.tiktok.com/@klinik.unimus?is_from_webapp=1&sender_device=pc',
//                 'whatsapp' => '62895616833383',
//                 'whatsappInfo' => '6289675873994',
//                 'email' => 'klinikpratamarawatinap@unimus.ac.id',
//                 'operatingHours' => '24 Jam Setiap Hari (Hari Libur Buka)',
//                 'address' => 'Jl. Petek Kp. Gayam RT. 02 RW. 06, Kel. Dadapsari, Kec. Semarang Utara., Semarang, Indonesia',
//                 'googleMapsLink' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.350360767373!2d110.41688021057558!3d-6.967929793003591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70f514ab8380d5%3A0x7fde5e6fc3fbbf9f!2sKlinik%20Pratama%20UNIMUS!5e0!3m2!1sid!2sid!4v1756783641742!5m2!1sid!2sid'
//             ]
//         ]);
//     }

//     public function contact()
//     {
//         // Merender halaman Inertia khusus untuk kontak
//         // Sebaiknya buat file Vue/React baru, contohnya: resources/js/Pages/Contact.vue
//         return Inertia::render('Contact', [
//             'contact' => $this->getContactData()
//         ]);
//     }
// }



namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Setting;
use App\Models\Service;
use App\Models\Article; // <--- PENTING: Tambahkan Import Model Article
use App\Models\Doctor;
use App\Models\Facility; // <--- JANGAN LUPA IMPORT MODEL INI


class LandingPageController extends Controller
{
    /**
     * Metode terpusat untuk mengambil data pengaturan.
     */
    private function getSettingsData()
    {
        return Setting::firstOrCreate([]);
    }

    /**
     * Menampilkan halaman utama (landing page).
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $doctors = Doctor::limit(3)->get(); 
        $settings = Setting::first(); 
        $facilities = Facility::where('status', 1)
            ->where('published_at', '<=', now())
            ->orderBy('published_at', 'desc')
            ->get();



        // 1. Mengambil data Layanan (Service)
        $services = Service::query()
            ->where('status', 1)              // Hanya ambil yang statusnya "Tampilkan"
            ->orderBy('is_featured', 'desc')  // Urutkan "Unggulan" (1) paling atas
            ->orderBy('published_at', 'desc') // Kemudian urutkan yang terbaru
            ->get();

        // 2. Mengambil data Artikel (Article) --- BARU ---
        $articles = Article::query()
            ->where('status', 1)              // Hanya ambil yang statusnya aktif/published
            ->orderBy('published_at', 'desc') // Urutkan dari yang paling baru
            ->limit(3)                        // Batasi hanya 3 artikel untuk tampilan Home
            ->get();

        // Data cadangan ulasan (opsional/biarkan saja)
        $googleReviews = [
            ['id' => 1, 'name' => 'Pasien Umum', 'avatar' => null, 'rating' => 5, 'text' => 'Pelayanan sangat ramah dan tempatnya nyaman.', 'time' => 'Baru saja'],
        ];

        return Inertia::render('LandingPage', [
            'services'      => $services,
            'articles'      => $articles, // <--- Kirim data artikel ke React Props
            'googleReviews' => $googleReviews,
            'testimonials'  => array_slice($googleReviews, 0, 2),
            'settings'      => $this->getSettingsData(),
            'doctors' => $doctors,
            'settings' => $settings, 
            'facilities' => $facilities, 


        ]);
    }
}