<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DoctorController extends Controller
{
    private function getDoctorData()
    {
        return [
            ['id' => 1, 'name' => 'Dr. dr. Rochman Basuki, M.Sc', 'specialty' => 'Dokter Umum', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 2, 'name' => 'dr. Chamim Faizin, M.M.R., FISPH, FISCM', 'specialty' => 'Dokter Umum', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 3, 'name' => 'dr. Agus Sunarto', 'specialty' => 'Dokter Umum', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 4, 'name' => 'dr. Bintang Tatius Nasrullah, M. Biomed', 'specialty' => 'Dokter Umum', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 5, 'name' => 'dr. Nabil Hajar, M.Biomed,AIFO-K', 'specialty' => 'Dokter Umum', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 6, 'name' => 'dr. Nina Anggraeni Noviasari,M.Kes', 'specialty' => 'Dokter Umum', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 7, 'name' => 'drg. Seffy Vera Faylina', 'specialty' => 'Dokter Gigi Umum', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 8, 'name' => 'dr. Arum Sekar Latih', 'specialty' => '', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 9, 'name' => 'dr. Exviana Putri Indiarti Nurjianto', 'specialty' => '', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 10, 'name' => 'Dr.apt.Muslimah.S.Si.MM', 'specialty' => 'Apoteker', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 11, 'name' => 'Isnainiyanti, A.Md.Farm', 'specialty' => 'TTK', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 12, 'name' => 'Quratul Uyun, A.Md.Farm', 'specialty' => 'TTK', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 13, 'name' => 'Nurkolipa', 'specialty' => 'Asisten Apoteker', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 14, 'name' => 'Maulida Rindu Nur Syafa\'ati', 'specialty' => 'Asisten Apoteker', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 15, 'name' => 'Afifah Eka Ardani, A.Md.RMIK', 'specialty' => 'Rekam Medis', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 16, 'name' => 'Fitri Nur Chasanah, A.Md.Kep', 'specialty' => 'Perawat Umum', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 17, 'name' => 'Ns. Fariz Yulian Pratama, S. Kep', 'specialty' => 'Perawat Umum', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 18, 'name' => 'Ns. Niken Hapsari, S.kep', 'specialty' => 'Perawat Umum', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 19, 'name' => 'Alya Nida Hanifa, Amd. Kep', 'specialty' => 'Perawat Umum', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 20, 'name' => 'Ns. Findi Arfiani, S.Kep', 'specialty' => 'Perawat Umum', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 21, 'name' => 'Ihda Nafilah Almardiyah, A.Md.Keb', 'specialty' => 'Bidan', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 22, 'name' => 'Herlinda Damayanti, A.Md.Keb', 'specialty' => 'Bidan', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 23, 'name' => 'Yudhit Veronika Laily Maleva, A.Md.Keb', 'specialty' => 'Bidan', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 24, 'name' => 'Noviyanti Mughni Pratiwi, A.Md.Keb', 'specialty' => 'Bidan', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 25, 'name' => 'Bynka Almira Jade, S.Gz', 'specialty' => 'Gizi', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 26, 'name' => 'Infut Susi Mudhowati, A.Md. AK', 'specialty' => 'Analis laboran', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 27, 'name' => 'Risna Ade Pratiwi, A.Md.TLM', 'specialty' => 'Analis laboran', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 28, 'name' => 'Deaneta Anjarsari', 'specialty' => 'Admin', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 29, 'name' => 'Romy Dwi Putra, S.Ak', 'specialty' => '', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 30, 'name' => 'Arief Purwanto', 'specialty' => 'Sarpras/Umum', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 31, 'name' => 'Arjib Yusriyanto', 'specialty' => '', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 32, 'name' => 'Imam', 'specialty' => 'Kebersihan', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 33, 'name' => 'Suep', 'specialty' => '', 'schedule' => '', 'photo' => '/images/staff.jpg'],
            ['id' => 34, 'name' => 'Eko Heriyanto', 'specialty' => '', 'schedule' => '', 'photo' => '/images/staff.jpg'],
        ];
    }
    
    private function getContactData()
    {
        return [
            'facebook' => 'https://www.facebook.com/people/klinikpratamaunimus_official/100083638056092/?_rdr',
            'instagram' => 'https://www.instagram.com/klinikpratamaunimus_official?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
            'tiktok' => 'https://www.tiktok.com/@klinik.unimus?is_from_webapp=1&sender_device=pc',
            'whatsapp' => '62895616833383',
            'whatsappInfo' => '6289675873994',
            'email' => 'klinikpratamarawatinap@unimus.ac.id',
            'operatingHours' => '24 Jam Setiap Hari (Hari Libur Buka)',
            'address' => 'Jl. Petek Kp. Gayam RT. 02 RW. 06, Kel. Dadapsari, Kec. Semarang Utara., Semarang, Indonesia',
            'googleMapsLink' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.350360767373!2d110.41688021057558!3d-6.967929793003591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70f514ab8380d5%3A0x7fde5e6fc3fbbf9f!2sKlinik%20Pratama%20UNIMUS!5e0!3m2!1sid!2sid!4v1756783641742!5m2!1sid!2sid'
        ];
    }

    public function index()
    {
        // Mengambil data dokter dari fungsi privat yang sudah dibuat
        $doctors = $this->getDoctorData();

        // Merender halaman Inertia khusus untuk dokter
        // Sebaiknya buat file Vue/React baru, contohnya: resources/js/Pages/Doctors/Index.vue
        return Inertia::render('Doctors/Index', [
            'doctors' => $doctors,
            'contact' => $this->getContactData()
        ]);
    }

    public function apiIndex()
    {
        $doctors = $this->getDoctorData();
        // Cukup kembalikan data sebagai JSON.
        return response()->json($doctors);
    }

    /**
     * Mengembalikan detail satu dokter berdasarkan ID dalam format JSON.
     */
    public function apiShow($id)
    {
        $doctors = $this->getDoctorData();
        
        // Cari dokter dengan ID yang cocok
        $doctor = collect($doctors)->firstWhere('id', $id);

        if ($doctor) {
            // Jika dokter ditemukan, kembalikan datanya sebagai JSON
            return response()->json($doctor);
        } else {
            // Jika tidak ditemukan, kembalikan pesan error 404
            return response()->json(['message' => 'Doctor not found'], 404);
        }
    }
}