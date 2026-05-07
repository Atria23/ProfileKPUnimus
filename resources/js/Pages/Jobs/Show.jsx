import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

// --- ICONS ---

const ArrowLeftIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

const CheckCircleIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CloseIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ZoomInIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
    </svg>
);

export default function Show({ vacancy }) {
    // --- STATE ---
    const [isImageOpen, setIsImageOpen] = useState(false);

    // --- LOGIC ---
    const hasDeadline = !!vacancy.open_until_date;
    const isExpired = hasDeadline
        ? new Date(vacancy.open_until_date) < new Date().setHours(0, 0, 0, 0)
        : false;
    const isClosed = vacancy.status === 'closed' || isExpired;

    const availableChannels = (vacancy.submission_channels || []).filter(ch =>
        ['email', 'whatsapp'].includes(ch.type) && ch.value
    );

    function handleApply(type) {
        if (isClosed) return;
        router.post(route('jobs.apply', vacancy.id), { type: type });
    }

    return (
        <AppLayout>
            <Head title={`Lowongan: ${vacancy.profession}`} />

            <main className="bg-white min-h-screen py-10 font-sans relative mb-16">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 items-start">

                        {/* ================= KOLOM KIRI (KONTEN) ================= */}
                        <div className="lg:col-span-2">

                            {/* Header */}
                            <div className="flex items-center gap-4 mb-2">
                                <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight">
                                    {vacancy.profession}
                                </h1>
                                {isClosed ? (
                                    <span className="border border-gray-300 text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide">
                                        Closed
                                    </span>
                                ) : (
                                    <span className="border border-[#00C06A] text-[#00C06A] bg-[#E6F9F0] px-4 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide">
                                        OPEN
                                    </span>
                                )}
                            </div>

                            <hr className="border-t border-gray-300 my-6" />

                            {/* Deskripsi */}
                            <div className="mb-10">
                                <h2 className="text-2xl font-bold text-black mb-4">Deskripsi Pekerjaan</h2>
                                <div
                                    className="prose max-w-none text-gray-700 leading-relaxed text-justify text-base md:text-lg"
                                    dangerouslySetInnerHTML={{ __html: vacancy.description }}
                                />
                            </div>

                            {/* Persyaratan (DIUPDATE AGAR RAPI) */}
                            {Array.isArray(vacancy.requirements) && vacancy.requirements.some(req => req?.requirement_text) && (
                                <div className="mb-10">
                                    <hr className="border-t border-gray-300 my-6" />

                                    <h2 className="text-2xl font-bold text-black mb-6">Persyaratan</h2>
                                    <ul className="flex flex-col gap-4">
                                        {vacancy.requirements
                                            .filter(req => req?.requirement_text)
                                            .map((req, index) => (
                                                <li key={index} className="flex items-start gap-4">
                                                    {/* 
                                                        flex-shrink-0: Agar ikon tidak gepeng/mengecil 
                                                        mt-[3px]: Menurunkan ikon sedikit agar sejajar tengah dengan baris pertama teks (optical adjustment)
                                                    */}
                                                    <div className="flex-shrink-0 mt-[3px]">
                                                        <CheckCircleIcon className="w-6 h-6 text-[#00C06A]" />
                                                    </div>

                                                    {/* Teks mengisi sisa ruang */}
                                                    <span className="text-gray-600 font-medium text-base md:text-lg leading-relaxed flex-1">
                                                        {req.requirement_text}
                                                    </span>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            )}

                            {/* Dokumen Pendukung */}
                            {Array.isArray(vacancy.required_documents) && vacancy.required_documents.some(doc => doc?.document_name) && (
                                <div className="mb-10">
                                    <hr className="border-t border-gray-300 my-6" />

                                    <h2 className="text-xl font-bold text-black mb-4">Dokumen Pendukung</h2>
                                    <ul className="list-disc list-inside text-gray-700 ml-2 space-y-2">
                                        {vacancy.required_documents
                                            .filter(doc => doc?.document_name)
                                            .map((doc, index) => (
                                                <li key={index} className="text-base md:text-lg">
                                                    {doc.document_name}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* ================= KOLOM KANAN (POSTER & BUTTON) ================= */}
                        <div className="lg:col-span-1 flex flex-col gap-6">

                            {/* 
                                POSTER IMAGE (INTERAKTIF) 
                                - cursor-pointer: Menunjukkan bisa diklik
                                - group & hover: Efek overlay saat mouse di atas gambar
                            */}
                            <div
                                className="w-full bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 relative group cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                                onClick={() => vacancy.poster_image && setIsImageOpen(true)}
                            >
                                {vacancy.poster_image ? (
                                    <>
                                        <img
                                            src={vacancy.poster_image}
                                            alt={`Poster ${vacancy.profession}`}
                                            className="w-full h-auto object-cover"
                                        />
                                        {/* Overlay Hover Effect */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 bg-white/90 rounded-full p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                <ZoomInIcon className="w-6 h-6 text-gray-800" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="aspect-[3/4] flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                                        No Poster
                                    </div>
                                )}
                            </div>

                            {/* Keterangan kecil di bawah gambar */}
                            {vacancy.poster_image && (
                                <p className="text-center text-xs text-gray-400 -mt-3">
                                    Klik gambar untuk memperbesar
                                </p>
                            )}

                            {/* Tombol APPLY */}
                            <div className="mt-2">
                                {isClosed ? (
                                    <button disabled className="w-full py-3 bg-gray-300 text-white font-bold text-lg rounded shadow-sm cursor-not-allowed tracking-wider uppercase">
                                        CLOSED
                                    </button>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {availableChannels.length > 0 ? (
                                            availableChannels.map((channel, index) => (
                                                <button
                                                    key={index}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Mencegah klik tembus jika ada
                                                        handleApply(channel.type);
                                                    }}
                                                    className="w-full py-3 px-6 rounded font-black text-lg text-white uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform active:scale-95 bg-[#00C06A] hover:bg-[#00a65c]"
                                                >
                                                    {channel.type === 'whatsapp' ? 'APPLY (WHATSAPP)' : 'APPLY (EMAIL)'}
                                                </button>
                                            ))
                                        ) : (
                                            <button className="w-full py-3 bg-[#00C06A] hover:bg-[#00a65c] text-white font-black text-lg rounded shadow-md uppercase tracking-wider">
                                                APPLY
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* ================= MODAL IMAGE PREVIEW (FULLSCREEN) ================= */}
                {isImageOpen && vacancy.poster_image && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsImageOpen(false)}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            onClick={() => setIsImageOpen(false)}
                        >
                            <CloseIcon className="w-8 h-8" />
                        </button>

                        {/* Image Container */}
                        <div
                            className="relative max-w-5xl max-h-full overflow-hidden rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()} // Agar klik di gambar tidak menutup modal
                        >
                            <img
                                src={vacancy.poster_image}
                                alt="Full Preview"
                                className="max-h-[90vh] w-auto object-contain rounded-lg"
                            />
                        </div>
                    </div>
                )}

            </main>
        </AppLayout>
    );
}