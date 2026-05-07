import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';

// Ikon Sederhana
const WarningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

export default function AiConsultation() {
    const [showDisclaimer, setShowDisclaimer] = useState(true);
    const [customInput, setCustomInput] = useState(''); // State untuk input manual

    // Form Handling Inertia
    const { data, setData, post, processing, errors } = useForm({
        symptoms: [],
        description: '',
    });

    const symptomOptions = [
        "Demam", "Batuk", "Pusing", "Sakit Gigi",
        "Mual/Muntah", "Luka Luar", "Gatal", "Sesak Nafas",
        "Diare", "Nyeri Perut"
    ];

    // Fungsi Toggle (Hapus/Tambah) dari preset
    const toggleSymptom = (symptom) => {
        if (data.symptoms.includes(symptom)) {
            setData('symptoms', data.symptoms.filter(s => s !== symptom));
        } else {
            setData('symptoms', [...data.symptoms, symptom]);
        }
    };

    // Fungsi Menambah Gejala Manual
    const addCustomSymptom = (e) => {
        e.preventDefault(); // Mencegah submit form saat tekan Enter di input ini
        const val = customInput.trim();

        if (val && !data.symptoms.includes(val)) {
            setData('symptoms', [...data.symptoms, val]);
            setCustomInput('');
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('ai.analyze'));
    };

    return (
        <AppLayout>
            <Head title="Asisten Layanan AI" />

            <div className="py-12 bg-gray-50 min-h-screen relative">

<AnimatePresence>
    {showDisclaimer && (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4 backdrop-blur-sm"
        >
            {/* 
              MODIFIKASI DI SINI:
              - Ditambahkan max-h-[90vh] untuk membatasi tinggi modal.
              - Ditambahkan overflow-y-auto untuk membuat konten bisa di-scroll jika melebihi batas tinggi.
            */}
            <motion.div
                initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 md:p-8 text-center border-t-4 border-yellow-500 max-h-[90vh] overflow-y-auto"
            >
                <WarningIcon />

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Tujuan Layanan & Penyangkalan</h2>

                <p className="text-gray-600 mb-6 leading-relaxed">
                    Fitur ini menggunakan AI untuk menganalisis gejala awal Anda dengan tujuan mengarahkan Anda ke poli yang paling sesuai. <strong> Klinik secara tegas melepaskan tanggung jawab atas segala klaim yang timbul dari rekomendasi yang diberikan oleh AI.</strong>
                </p>

                <div className="space-y-4 text-gray-700 text-left mb-8">
                    <p className="font-semibold">Dengan melanjutkan, Anda memahami dan menyetujui seluruh poin berikut:</p>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>
                            <strong>Rekomendasi Poli, Bukan Diagnosis:</strong> Hasil dari AI adalah rekomendasi administratif untuk pemilihan poli, BUKAN diagnosis medis final.
                        </li>
                        <li>
                            <strong>Tanggung Jawab Pengguna:</strong> Penggunaan layanan ini untuk menentukan kunjungan poli sepenuhnya menjadi tanggung jawab Anda.
                        </li>
                        <li>
                            <strong>Wajib Konsultasi Dokter:</strong> Diagnosis dan penanganan medis yang akurat hanya akan diberikan oleh dokter profesional saat Anda berkonsultasi di poli yang dituju.
                        </li>
                        <li>
                            <strong>Keterbatasan AI:</strong> Anda mengakui bahwa AI memiliki keterbatasan dan rekomendasi poli yang diberikan bisa jadi tidak sempurna.
                        </li>
                    </ol>
                </div>

                <button
                    onClick={() => setShowDisclaimer(false)}
                    className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors"
                >
                    Saya Mengerti & Lanjutkan
                </button>
            </motion.div>
        </motion.div>
    )}
</AnimatePresence>

                {/* --- KONTEN UTAMA --- */}
                <div className="container mx-auto px-4 max-w-3xl">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        className="text-center mb-10"
                    >
                        <h1 className="text-3xl font-black text-gray-800">Cek Rekomendasi Layanan</h1>
                        <p className="text-gray-600 mt-2">Ceritakan apa yang Anda rasakan, AI kami akan mengarahkan ke Poli yang tepat.</p>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
                    >
                        <form onSubmit={submit}>

                            {/* --- BAGIAN 1: PILIH GEJALA --- */}
                            <div className="mb-8">
                                <label className="block text-lg font-bold text-gray-800 mb-4">
                                    Pilih Gejala yang Dirasakan
                                </label>

                                {/* Pilihan Preset */}
                                <div className="flex flex-wrap gap-3 mb-4">
                                    {symptomOptions.map((symptom) => (
                                        <button
                                            type="button"
                                            key={symptom}
                                            onClick={() => toggleSymptom(symptom)}
                                            className={`px-4 py-2 rounded-full border transition-all duration-200 ${data.symptoms.includes(symptom)
                                                ? 'bg-[#50cd89] text-white border-[#50cd89] shadow-md transform scale-105'
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-[#50cd89] hover:text-[#50cd89]'
                                                }`}
                                        >
                                            {symptom}
                                        </button>
                                    ))}
                                </div>

                                {/* Input Gejala Lainnya */}
                                <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                                    <label className="text-sm font-semibold text-gray-500 mb-2 block">Gejala Lainnya:</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={customInput}
                                            onChange={(e) => setCustomInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addCustomSymptom(e)}
                                            placeholder="Misal: Mata merah, Kaki bengkak..."
                                            className="flex-1 px-4 border-gray-300 rounded-lg focus:border-[#50cd89] focus:ring-[#50cd89] text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={addCustomSymptom}
                                            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1 text-sm font-bold"
                                        >
                                            <PlusIcon /> Tambah
                                        </button>
                                    </div>

                                    {/* Menampilkan Gejala Manual yang Ditambahkan */}
                                    {data.symptoms.filter(s => !symptomOptions.includes(s)).length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {data.symptoms
                                                .filter(s => !symptomOptions.includes(s))
                                                .map((s, idx) => (
                                                    <span
                                                        key={idx}
                                                        onClick={() => toggleSymptom(s)}
                                                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-2 cursor-pointer hover:bg-red-100 hover:text-red-800 transition-colors group"
                                                    >
                                                        {s}
                                                        <span className="group-hover:text-red-600"><XIcon /></span>
                                                    </span>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>

                                {errors.symptoms && <p className="text-red-500 text-sm mt-2">{errors.symptoms}</p>}
                            </div>

                            {/* --- BAGIAN 2: DESKRIPSI --- */}
                            <div className="mb-8">
                                <label className="block text-lg font-bold text-gray-800 mb-2">
                                    Deskripsi Tambahan (Opsional)
                                </label>
                                <textarea
                                    className="w-full p-4 border-gray-300 rounded-lg shadow-sm focus:border-[#50cd89] focus:ring-[#50cd89]"
                                    rows="4"
                                    placeholder="Contoh: Demam sudah 3 hari naik turun, disertai mual..."
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                ></textarea>
                            </div>

                            {/* Tombol Submit */}
                            <button
                                type="submit"
                                disabled={processing || data.symptoms.length === 0}
                                className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg flex items-center justify-center transition-all ${processing || data.symptoms.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#50cd89] to-[#38a36a] hover:scale-[1.02]'
                                    }`}
                            >
                                {processing ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Menganalisis...
                                    </span>
                                ) : (
                                    "Daftar Layanan Sekarang"
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}