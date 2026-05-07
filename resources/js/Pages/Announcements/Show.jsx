import React, { useState } from 'react'; // Tambahkan useState
import { Head, Link, router } from '@inertiajs/react'; // Tambahkan router
import AppLayout from '@/Layouts/AppLayout';
import { route } from 'ziggy-js';



// --- KOMPONEN: ContentRenderer ---
// --- KOMPONEN: ContentRenderer ---
const ContentRenderer = ({ content }) => {
    // 1. Handle jika content berupa string HTML biasa (Backward Compatibility)
    if (!Array.isArray(content)) {
        return <div className="prose prose-lg max-w-none text-gray-700 text-justify leading-loose" dangerouslySetInnerHTML={{ __html: content }} />;
    }

    // 2. Handle jika content berupa JSON Array (Builder Filament)
    return (
        <div className="space-y-6 text-gray-700">
            {content.map((block, index) => {
                switch (block.type) {
                    
                    // --- BAGIAN INI YANG DIUBAH AGAR ADA "ENTER" ---
                    case 'paragraph':
                        return (
                            <div
                                key={index}
                                // PENJELASAN CLASS:
                                // text-justify       : Rata kanan-kiri agar rapi
                                // leading-loose      : Jarak antar baris kalimat lebih renggang
                                // [&>p]:mb-6         : Memberi jarak (enter) antar paragraf sebesar 1.5rem
                                // [&>p:last-child]:mb-0 : Menghapus jarak di paragraf terakhir agar tidak double margin
                                // text-base md:text-lg : Ukuran font responsif (HP agak kecil, PC besar)
                                className="text-gray-700 text-base md:text-lg leading-loose text-justify [&>p]:mb-6 [&>p:last-child]:mb-0 mb-6"
                                dangerouslySetInnerHTML={{ __html: block.data.content }}
                            />
                        );

                    case 'image_banner':
                        return (
                            <figure key={index} className="my-8 flex flex-col items-center">
                                <div className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
                                    <img
                                        src={block.data.url}
                                        alt={block.data.caption || 'Gambar Banner'}
                                        // Menggunakan max-h-[500px] agar gambar tidak terlalu panjang ke bawah
                                        className="w-full h-auto max-h-[500px] object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/error-svgrepo-com.png'; }}
                                    />
                                </div>
                                {block.data.caption && (
                                    <figcaption className="text-center text-xs md:text-sm italic text-gray-500 mt-3 px-2">
                                        {block.data.caption}
                                    </figcaption>
                                )}
                            </figure>
                        );

                    case 'gallery':
                        if (!block.data.images || block.data.images.length === 0) return null;
                        return (
                            <div key={index} className="my-8 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                {block.data.images.map((image, imgIndex) => (
                                    <a key={imgIndex} href={image} target="_blank" rel="noopener noreferrer" className="block aspect-square overflow-hidden rounded-lg shadow-md hover:scale-105 transition duration-300">
                                        <img src={image} alt={`Galeri ${imgIndex}`} className="w-full h-full object-cover" />
                                    </a>
                                ))}
                            </div>
                        );

                    // Tambahan: Handle List (Bullet points) jika ada
                    case 'list':
                        return (
                            <ul key={index} className="list-disc list-outside ml-5 mb-6 text-gray-700 text-base md:text-lg leading-loose">
                                {block.data.items.map((item, i) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} className="mb-2" />
                                ))}
                            </ul>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
};

// --- WIDGET SIDEBAR: PENCARIAN ---
// --- WIDGET SIDEBAR: PENCARIAN (UPDATED) ---
const SearchWidget = () => {
    // State untuk menyimpan kata kunci
    const [keyword, setKeyword] = useState('');

    // Fungsi untuk melakukan pencarian
    const handleSearch = () => {
        if (keyword.trim() !== '') {
            // Redirect ke route index dengan parameter search
            router.get(route('announcements.index'), { search: keyword });
        }
    };

    // Handle tombol Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="bg-gray-50 p-5 md:p-6 rounded-lg mb-6 md:mb-8 border border-gray-100">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Cari Pengumuman</h3>
            <div className="relative">
                <input 
                    type="text" 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Masukkan kata kunci..." 
                    className="w-full pl-4 pr-10 py-3 rounded border border-gray-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm shadow-sm"
                />
                <button 
                    onClick={handleSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

// --- WIDGET SIDEBAR: PENGUMUMAN LAINNYA ---
const OtherAnnouncementsSidebar = ({ announcements }) => (
    <div className="bg-gray-50 p-5 md:p-6 rounded-lg mb-6 md:mb-8 border border-gray-100">
        <h3 className="font-bold text-lg text-gray-800 mb-6 border-l-4 border-green-500 pl-3">
            Pengumuman Lainnya
        </h3>
        
        <ul className="space-y-5 md:space-y-6">
            {announcements.length === 0 ? (
                <li className="text-gray-500 text-sm">Tidak ada pengumuman lain.</li>
            ) : (
                announcements.map(item => (
                    <li key={item.id} className="group">
                        <div className="text-xs text-gray-500 mb-1">{item.date}</div>
                        <Link href={route('announcements.show', item.slug)} className="block font-bold text-gray-800 text-sm leading-snug group-hover:text-green-600 transition-colors">
                            {item.title}
                        </Link>
                    </li>
                ))
            )}
        </ul>

        <div className="mt-8">
            <Link href={route('announcements.index')} className="block w-full text-center py-3 border border-gray-400 text-gray-700 font-semibold text-sm rounded hover:bg-gray-100 hover:text-green-600 transition uppercase tracking-wide">
                LIHAT SEMUA
            </Link>
        </div>
    </div>
);

// --- MAIN COMPONENT ---
export default function Show({ announcement, otherAnnouncements }) {
    return (
        <>
            <Head title={announcement.title} />

            <div className="bg-white min-h-screen font-sans">
                
                {/* --- HERO SECTION --- */}
                

                {/* HERO SECTION */}
                <div className="relative h-56 md:h-64 bg-gray-900 flex flex-col justify-center items-center text-center overflow-hidden mb-12">
                    <img
                        src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/tampakdepan.webp"
                        alt="Background"
                        className="absolute top-0 left-0 w-full h-full object-cover opacity-40 blur-[2px]"
                    />
                    <div className="relative z-10 max-w-4xl mx-auto px-4">
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase mb-2">
                            PENGUMUMAN
                        </h1>
                        <p className="text-gray-200 text-xs md:text-base font-medium leading-relaxed max-w-xs md:max-w-none mx-auto">
                            Halaman ini berfungsi memberikan informasi edukasi kesehatan dan promosi layanan klinik.
                        </p>
                    </div>
                </div>

                {/* --- CONTENT CONTAINER --- */}
                <div className="container mx-auto px-4 py-4 mb-20 md:py-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

                        {/* KOLOM KIRI: KONTEN UTAMA */}
                        <div className="lg:col-span-8">
                            
                            {/* META DATA & TITLE */}
                            <div className="mb-4 md:mb-6">
                                <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3 md:mb-4">
                                    <span className="bg-[#e6f4ea] text-[#00a651] px-3 py-1 md:px-4 md:py-1.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                        PENGUMUMAN
                                    </span>
                                    <span className="text-gray-400 text-xs md:text-sm font-medium flex items-center gap-1 md:gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {announcement.date}
                                    </span>
                                </div>

                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                    {announcement.title}
                                </h1>
                            </div>

                            {/* MAIN IMAGE */}
                            {announcement.image_url && (
                                <div className="w-full mb-6 md:mb-8 flex justify-center md:justify-start rounded-xl overflow-hidden">
                                    <img
                                        src={announcement.image_url}
                                        alt={announcement.title}
                                        // RESPONSIVE LOGIC:
                                        // w-full: Memaksa gambar selebar container pada Mobile agar jelas.
                                        // md:w-auto: Kembali ke ukuran asli (proporsional) pada Desktop.
                                        className="w-full md:w-auto h-auto max-w-full max-h-[400px] md:max-h-[696px] rounded-xl shadow-sm object-contain bg-gray-50"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/error-svgrepo-com.png'; }}
                                    />
                                </div>
                            )}

                            {/* CONTENT BODY */}
                            <div className="text-gray-600">
                                <ContentRenderer content={announcement.content} />
                            </div>
                        </div>

                        {/* KOLOM KANAN: SIDEBAR */}
                        {/* mt-8: Memberi jarak atas jika layout menumpuk (mobile) */}
                        <aside className="lg:col-span-4 space-y-6 md:space-y-8 mt-8 lg:mt-0 lg:top-6">
                            <SearchWidget />
                            <OtherAnnouncementsSidebar announcements={otherAnnouncements} />
                        </aside>

                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = page => <AppLayout children={page} />;