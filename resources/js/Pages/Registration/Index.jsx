import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function RegistrationIndex({ whatsapp_registration }) {

    // --- LOGIC (TIDAK BERUBAH) ---
    const formatPhoneNumber = (number) => {
        if (!number) return '6289675873994';
        let cleanNumber = number.replace(/\D/g, '');
        if (cleanNumber.startsWith('0')) {
            cleanNumber = '62' + cleanNumber.slice(1);
        }
        return cleanNumber;
    };

    const whatsappNumber = formatPhoneNumber(whatsapp_registration);

    const [formData, setFormData] = useState({
        kategori: 'Pasien Baru',
        nama: '',
        noBpjs: '',
        alamat: '',
        noHp: '',
        keluhan: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const message =
            `*PENDAFTARAN ONLINE KLINIK PRATAMA UNIMUS*
----------------------------------------
Halo Admin, saya ingin mendaftar dengan data berikut:

*Kategori:* ${formData.kategori}
*Nama Pasien:* ${formData.nama}
*Nomor BPJS:* ${formData.noBpjs || '-'}
*Alamat:* ${formData.alamat}
*No. HP/WA:* ${formData.noHp}

*Keluhan:* 
${formData.keluhan}

Mohon konfirmasinya, Terima kasih.`;

        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(waUrl, '_blank');
    };

    // --- STYLING BARU SESUAI GAMBAR ---

    // Input seperti di gambar: Background abu-abu muda, border halus, rounded tumpul
    const inputClass = "w-full rounded-lg border-transparent bg-gray-100 px-4 py-3 text-gray-700 placeholder-gray-400 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 shadow-sm";

    // Label tebal dan gelap
    const labelClass = "block text-sm font-bold text-gray-800 mb-1.5";

    return (
        <>
            <Head title="Pendaftaran Pasien" />

            <div className="bg-white min-h-screen py-8 flex justify-center items-start pb-24">
                <div className="container px-4 max-w-3xl"> {/* Lebar dibatasi agar mirip mobile view/kartu */}

                    {/* Main Card Container */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

                        {/* HEADER SECTION (HIJAU) */}
                        <div className="relative bg-[#00a651] p-16  text-center">
                            {/* Background Image Overlay Effect */}
                            <div className="absolute inset-0 overflow-hidden opacity-20">
                                {/* Menggunakan gambar placeholder gedung atau pattern, bisa diganti url real-nya */}
                                <img
                                    src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/tampakdepan.webp"
                                    alt="Background"
                                    className="w-full h-full object-cover grayscale"
                                    onError={(e) => e.target.style.display = 'none'} // Fallback jika gambar tidak ada
                                />
                            </div>

                            {/* Content Header */}
                            {/* Content Header */}
                            <div className="relative z-10 w-full px-0"> {/* Tambahkan w-full & px-0 */}
                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    Pendaftaran Pasien
                                </h1>

                                {/* Hapus 'px-2' di sini agar teks merentang penuh ke samping */}
                                <p className="text-white text-xs md:text-sm font-medium leading-relaxed opacity-90">
                                    Silakan lengkapi formulir di bawah ini. Data akan otomatis terformat ke WhatsApp Admin.
                                </p>
                            </div>
                        </div>

                        {/* FORM SECTION (PUTIH) */}
                        <div className="p-6 md:p-8 -mt-4 bg-white relative z-20">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* 1. Kategori Pasien */}
                                <div>
                                    <label className={labelClass}>Kategori Pasien</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['Pasien Baru', 'Pasien Lama'].map((type) => (
                                            <label
                                                key={type}
                                                className={`cursor-pointer rounded-xl border py-3 px-2 flex items-center justify-center text-center transition-all duration-200
                                                ${formData.kategori === type
                                                        ? 'border-green-500 bg-white text-gray-800 font-bold shadow-sm ring-1 ring-green-500'
                                                        : 'border-gray-200 bg-white text-gray-500 font-semibold hover:bg-gray-50'}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="kategori"
                                                    value={type}
                                                    checked={formData.kategori === type}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                <span className="text-sm">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Nama Lengkap */}
                                <div>
                                    <label className={labelClass}>Nama Lengkap</label>
                                    <input
                                        type="text"
                                        name="nama"
                                        required
                                        value={formData.nama}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="Sesuai KTP/Identitas"
                                    />
                                </div>

                                {/* 3. Nomor BPJS */}
                                <div>
                                    <label className={labelClass}>
                                        Nomor BPJS <span className="text-gray-400 font-normal text-xs">(Opsional)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="noBpjs"
                                        value={formData.noBpjs}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="13 digit nomor kartu"
                                    />
                                </div>

                                {/* 4. Nomor WhatsApp */}
                                <div>
                                    <label className={labelClass}>Nomor WhatsApp/HP</label>
                                    <input
                                        type="tel"
                                        name="noHp"
                                        required
                                        value={formData.noHp}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="08xxxxxxxxxx"
                                    />
                                </div>

                                {/* 5. Alamat */}
                                <div>
                                    <label className={labelClass}>Alamat Domisili</label>
                                    <div className="relative">
                                        <textarea
                                            name="alamat"
                                            required
                                            rows="2"
                                            value={formData.alamat}
                                            onChange={handleChange}
                                            className={`${inputClass} resize-none`}
                                            placeholder="Jalan, RT/RW, Kelurahan..."
                                        ></textarea>
                                        {/* Icon resize corner visual (opsional, aesthetic only) */}
                                        <div className="absolute bottom-2 right-2 pointer-events-none">
                                            <svg className="w-3 h-3 text-gray-400" viewBox="0 0 10 10" fill="currentColor"><path d="M10 10H0l10-10v10z" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* 6. Keluhan Utama */}
                                {/* 6. Keluhan Utama */}
                                <div className="bg-[#f4f7f9] rounded-2xl p-6 border border-gray-100"> {/* Container Luar (Warna Abu/Biru Muda) */}

                                    {/* Label di dalam container */}
                                    <label className="block text-base font-bold text-gray-900 mb-3">
                                        Keluhan Utama
                                    </label>

                                    <div className="relative">
                                        <textarea
                                            name="keluhan"
                                            required
                                            rows="5" /* Sedikit lebih tinggi agar proporsional */
                                            value={formData.keluhan}
                                            onChange={handleChange}
                                            className="w-full bg-white rounded-xl border border-gray-300 px-5 py-4 text-gray-700 placeholder-gray-400 focus:border-[#00a651] focus:ring-4 focus:ring-[#00a651]/10 transition-all resize-none shadow-sm"
                                            placeholder="Ceritakan gejala yang dirasakan..."
                                        ></textarea>


                                    </div>
                                </div>

                                {/* Tombol Submit */}
                                <div className="pt-4 pb-2">
                                    <button
                                        type="submit"
                                        className="w-full bg-[#00a651] hover:bg-[#008c44] text-white font-bold py-3.5 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <span>KIRIM VIA WHATSAPP</span>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                                        </svg>
                                    </button>
                                    <p className="text-center text-[10px] text-gray-400 mt-4 font-medium">
                                        Privasi Anda aman. Data hanya terkirim ke Whatsapp Resmi Klinik
                                    </p>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

RegistrationIndex.layout = page => <AppLayout children={page} />;