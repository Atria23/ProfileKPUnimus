<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        Setting::updateOrCreate(
            ['id' => 1], // Selalu update baris dengan ID 1
            [
                'vision' => 'Menjadi klinik pratama pilihan yang unggul dalam pelayanan kesehatan dasar yang profesional dan Islami.',
                'mission' => "1. Memberikan pelayanan kesehatan yang bermutu dan terjangkau.\n2. Mengutamakan keselamatan dan kepuasan pasien.\n3. Mengembangkan sumber daya manusia yang kompeten dan berakhlak mulia.",
                'whatsapp_registration' => '62895616833383',
                'whatsapp_information' => '6289675873994',
                'address' => 'Jl. Petek Kp. Gayam RT. 02 RW. 06, Kel. Dadapsari, Kec. Semarang Utara., Semarang, Indonesia',
                'google_maps_link' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.203923838271!2d110.4132353147729!3d-6.98525299495404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70f386bfffffff%3A0x8a71f3a09328407!2sKlinik%20Pratama%20Unimus!5e0!3m2!1sen!2sid!4v1622012345678',
                'social_media' => [
                    ['platform' => 'Instagram', 'link' => 'https://instagram.com/klinikpratamaunimus_official'],
                    ['platform' => 'Facebook', 'link' => 'https://facebook.com/KlinikPratamaUnimus'],
                    ['platform' => 'TikTok', 'link' => 'https://tiktok.com/@KlinikUnimus'],
                    ['platform' => 'Youtube', 'link' => 'https://youtube.com/@klinikpratamaunimusofficial'],
                ]
            ]
        );
    }
}