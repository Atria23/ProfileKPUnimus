import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function BpjsIndex() {
    return (
        <>
            <Head title="Prosedur Pindah Faskes BPJS" />

            <div className="bg-white min-h-screen pb-20 font-sans text-gray-800">

                {/* HERO SECTION */}
                <div className="relative h-56 md:h-64 bg-gray-900 flex flex-col justify-center items-center text-center overflow-hidden">
                    <img
                        src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/tampakdepan.webp"
                        alt="Background"
                        className="absolute top-0 left-0 w-full h-full object-cover opacity-40 blur-[2px]"
                    />
                    <div className="relative z-10 max-w-4xl mx-auto px-4">
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase mb-2">
                            PROSEDUR PINDAH FASKES BPJS
                        </h1>
                        <p className="text-gray-200 text-xs md:text-base font-medium leading-relaxed max-w-xs md:max-w-none mx-auto">
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 max-w-6xl space-y-16 mb-10">

                    {/* SECTION 1: DESKRIPSI PROSEDUR */}
                    <div className="bg-white rounded-3xl p-8 md:p-10 ">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 border-l-4 border-green-500 pl-4">
                            Deskripsi Prosedur:
                        </h2>
                        <ul className="list-disc list-outside ml-6 space-y-3 text-gray-700 text-lg leading-relaxed">
                            <li>
                                Melayani proses pemindahan faskes 1 (untuk pemindahan ke Klinik Pratama UNIMUS) via Chat atau Langsung di Jam Kerja
                            </li>
                            <li>
                                Melayani tanya jawab seputar pemindahan faskes
                            </li>
                            <li>
                                Prosedur Pemindahan FASKES secara Mandiri
                            </li>
                            <li>
                                Bisa menghubungi nomor : <span className="font-bold text-green-600">Humas (089675873994)</span>
                            </li>
                        </ul>
                    </div>

                    {/* SECTION 2: GRID GAMBAR (PANDAWA & MOBILE JKN) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                        {/* Kolom Kiri: Pandawa */}
                        <div className="flex flex-col items-center">
                            <h3 className="text-xl md:text-2xl font-black text-gray-800 uppercase mb-6 text-center tracking-tight">
                                PINDAH FASKES VIA WA PANDAWA
                            </h3>
                            <div className="bg-white p-2 rounded-xl duration-300 w-full">
                                <img
                                    src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/PINDAH%20FASKES%20PANDAWA.png"
                                    alt="Cara Pindah Faskes via WA Pandawa"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>

                        {/* Kolom Kanan: Mobile JKN */}
                        <div className="flex flex-col items-center">
                            <h3 className="text-xl md:text-2xl font-black text-gray-800 uppercase mb-6 text-center tracking-tight">
                                PINDAH FASKES VIA MOBILE JKN
                            </h3>
                            <div className="bg-white p-2 rounded-xl duration-300 w-full">
                                <img
                                    src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/PINDAH%20FASKES%20MOBILE%20JKN.png"
                                    alt="Cara Pindah Faskes via Mobile JKN"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>

                    </div>

                    {/* SECTION 3: BPJS BARU MANDIRI (CENTER) */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-xl md:text-2xl font-black text-gray-800 uppercase mb-6 text-center tracking-tight">
                            BUAT BPJS BARU MANDIRI
                        </h3>
                        <div className="bg-white p-2 rounded-xl duration-300 max-w-2xl w-full">
                            <img
                                src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/BUAT%20BPJS%20BARU%20MANDIRI.png"
                                alt="Buat BPJS Baru Mandiri"
                                className="w-full h-auto "
                            />
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

BpjsIndex.layout = page => <AppLayout children={page} />;