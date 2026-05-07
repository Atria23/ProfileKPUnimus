import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function FasilitasPerawatan({ facilities, pageTitle, pageDescription }) {

    // --- DATA LOGIC (TIDAK BERUBAH) ---
    const dataToShow = facilities || [];

    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/800x400?text=No+Image';
        return path.startsWith('http') ? path : `/storage/${path}`;
    };

    const extractAmenities = (content) => {
        if (!content) return [];
        try {
            if (Array.isArray(content)) {
                return content.map(item => {
                    if (item && typeof item === 'object' && item.item) return item.item;
                    if (typeof item === 'string') return item;
                    return null;
                }).filter(Boolean);
            }
            if (typeof content === 'string') {
                const trimmed = content.trim();
                if (!trimmed) return [];
                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) {
                        return parsed.map(item => {
                            if (item && typeof item === 'object' && item.item) return item.item;
                            if (typeof item === 'string') return item;
                            return null;
                        }).filter(Boolean);
                    }
                    if (parsed && typeof parsed === 'object') {
                        const values = Object.values(parsed);
                        return values.map(item => {
                            if (item && typeof item === 'object' && item.item) return item.item;
                            if (typeof item === 'string') return item;
                            return null;
                        }).filter(Boolean);
                    }
                } catch (e) {
                    return [];
                }
            }
            if (content && typeof content === 'object' && !Array.isArray(content)) {
                const values = Object.values(content);
                return values.map(item => {
                    if (item && typeof item === 'object' && item.item) return item.item;
                    if (typeof item === 'string') return item;
                    return null;
                }).filter(Boolean);
            }
        } catch (error) {
            console.error("Error extracting amenities:", error);
        }
        return [];
    };

    return (
        <AppLayout>
            <Head title="Fasilitas Perawatan" />

            <div className="bg-white min-h-screen overflow-hidden relative">

                {/* HEADER */}
                <div className="relative h-56 z-30 md:h-64 bg-gray-900 flex flex-col justify-center items-center text-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/tampakdepan.webp"
                            alt="Background"
                            className="absolute top-0 left-0 w-full h-full object-cover opacity-40 blur-[2px]"
                        />
                    </div>
                    <div className="relative z-10 max-w-4xl mx-auto px-4">
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase mb-2">
                            {pageTitle || "FASILITAS PERAWATAN"}
                        </h1>
                        <p className="text-gray-200 text-xs md:text-base font-medium leading-relaxed max-w-xs md:max-w-none mx-auto">
                            {pageDescription || "Bagian ini menampilkan sarana dan prasarana yang tersedia di klinik untuk menunjang pelayanan kepada pasien."}
                        </p>
                    </div>
                </div>

                {/* CONTENT SECTION */}
                <div className="relative px-4 md:px-8 max-w-7xl mx-auto mb-28 space-y-12">

                    {/* --- UPDATE: Background Decor Responsif --- */}
                    {/* Lingkaran Kanan Atas */}
                    <div className="absolute -top-16 -right-24 md:-top-32 md:-right-80 w-64 h-64 md:w-[32rem] md:h-[32rem] border-[20px] md:border-[38px] border-[#00b050] rounded-full opacity-50 md:opacity-80 z-0 pointer-events-none"></div>
                    
                    {/* Lingkaran Kiri Bawah */}
                    <div className="absolute -bottom-16 -left-24 md:-bottom-56 md:-left-80 w-64 h-64 md:w-[32rem] md:h-[32rem] border-[20px] md:border-[38px] border-[#00b050] rounded-full opacity-50 md:opacity-80 z-0 pointer-events-none"></div>
                    {/* ------------------------------------------ */}
                    
                    {dataToShow.length > 0 ? (
                        dataToShow.map((item, index) => {
                            const amenitiesList = extractAmenities(item.content);

                            return (
                                <div key={item.id || index} className="relative z-10">
                                    {/* CARD CONTAINER */}
                                    <div className="bg-white rounded-[30px] shadow-[0px_10px_40px_-10px_rgba(16,185,129,0.25)] hover:shadow-[0px_20px_60px_-15px_rgba(16,185,129,0.4)] overflow-hidden flex flex-col lg:flex-row min-h-[400px]">
                                        
                                        {/* BAGIAN GAMBAR (Kiri) */}
                                        <div className="w-full lg:w-5/12 h-64 lg:h-auto relative bg-gray-100">
                                            <img
                                                src={getImageUrl(item.image_path)}
                                                alt={item.title}
                                                className="absolute inset-0 w-full h-full object-cover"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=Image+Error'; }}
                                            />
                                        </div>

                                        {/* BAGIAN KONTEN (Kanan) */}
                                        <div className="w-full lg:w-8/12 p-8 lg:p-12 flex flex-col justify-center">
                                            
                                            {/* Header Card */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                                <h2 className="text-3xl font-extrabold text-black tracking-wide">
                                                    {item.title}
                                                </h2>
                                                <span className="bg-[#C8EAD9] text-[#00b050] px-6 py-1.5 rounded-full font-bold text-sm text-center w-fit">
                                                    Fasilitas
                                                </span>
                                            </div>

                                            {/* Subtitle & List */}
                                            <div className="mb-6">
                                                <h3 className="text-xl font-bold text-black mb-4">
                                                    Tersedia:
                                                </h3>

                                                <div className="flex flex-wrap gap-3">
                                                    {amenitiesList.length > 0 ? (
                                                        amenitiesList.map((text, i) => (
                                                            <AmenityPill key={i} text={text} />
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-500 italic">
                                                            Detail fasilitas belum ditambahkan.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        /* TAMPILAN KOSONG */
                        <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-[60vh] text-center bg-gray-50 rounded-[30px] border-2 border-dashed border-gray-200 p-8">
                            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Data Fasilitas</h3>
                            <p className="text-gray-500 font-medium max-w-md">
                                Saat ini belum ada data fasilitas yang dipublikasikan.
                            </p>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4">
                    <div className="w-96 h-96 bg-[#00b050] rounded-full opacity-10 blur-3xl"></div>
                </div>

            </div>
        </AppLayout>
    );
}

// KOMPONEN PIL KHUSUS
const AmenityPill = ({ text }) => (
    <div className="inline-flex items-center bg-[#00b050] rounded-full pl-1.5 pr-5 py-1.5 shadow-sm">
        <div className="flex-shrink-0 bg-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
            <svg className="w-3.5 h-3.5 text-[#00b050]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
            </svg>
        </div>
        <span className="text-white font-medium text-sm md:text-base leading-none pt-[1px]">
            {text}
        </span>
    </div>
);