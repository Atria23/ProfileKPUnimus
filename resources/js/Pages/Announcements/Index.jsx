import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ announcements = [] }) {
    const [search, setSearch] = useState('');
    
    // --- STATE UNTUK PAGINASI BAWAH ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter data
    const filteredAnnouncements = announcements.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    // Reset pagination saat search berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // --- LOGIKA SLICING ---
    const mainFeatured = filteredAnnouncements[0];
    const rightFeatured = filteredAnnouncements[1];
    const rightList = filteredAnnouncements.slice(2, 4);
    const wideBanners = filteredAnnouncements.slice(4, 6);
    const rawBottomList = filteredAnnouncements.slice(6);

    // --- LOGIKA PAGINASI (LIST BAWAH) ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBottomList = rawBottomList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(rawBottomList.length / itemsPerPage);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }).format(date).replace(/\//g, '.');
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        const element = document.getElementById('bottom-list-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    

    // --- HELPER COMPONENT: MOBILE CARD (CLICKABLE) ---
    const MobileCard = ({ item, badgeText, badgeColor }) => (
        <Link 
            href={route('announcements.show', item.slug)} 
            className="bg-white rounded-[20px] overflow-hidden shadow-lg flex flex-col h-full group block transition-transform active:scale-95"
        >
            <div className="relative h-56 w-full overflow-hidden">
                <img
                    src={item.image_url || 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/PENGUMUMAN.png'}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                    <span className={`text-white text-[10px] font-bold px-3 py-1 rounded-lg shadow-md uppercase tracking-wide ${badgeColor || 'bg-green-500'}`}>
                        {badgeText || 'Baru'}
                    </span>
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                    <span className="h-px flex-1 bg-gray-200"></span>
                    <span className="text-xs text-gray-400 font-bold tracking-widest">
                        {formatDate(item.date)}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-green-600 transition-colors">
                    {item.title}
                </h3>
                {/* UPDATE: line-clamp-3 & break-words */}
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 break-words">
                    {item.excerpt}
                </p>
                <div className="mt-auto flex justify-end">
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 uppercase">
                        Baca Selengkapnya
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </div>
                </div>
            </div>
        </Link>
    );

    return (
        <>
            <Head title="Pengumuman" />

            <div className="bg-gray-50 min-h-screen pb-20 font-sans text-gray-800">

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
                            Informasi edukasi kesehatan kepada pengunjung sebagai bentuk pengetahuan dan promosi layanan klinik.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 max-w-6xl mb-10">

                    {/* SEARCH HEADER */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h2 className="text-2xl md:text-3xl font-bold uppercase text-gray-900 tracking-tight">
                            Pengumuman Terkini
                        </h2>
                        <div className="relative w-full md:w-1/3">
                            <input
                                type="text"
                                placeholder="Cari Pengumuman"
                                className="w-full border border-gray-300 rounded-full py-2 px-5 pl-10 focus:outline-none focus:border-green-500 transition-colors"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>

                    {/* KONDISI 1: DATA KOSONG */}
                    {filteredAnnouncements.length === 0 ? (
                        <div className="w-full flex flex-col items-center justify-center min-h-[50vh] text-center bg-white rounded-[30px] border-2 border-dashed border-gray-200 p-8 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Pengumuman</h3>
                            <p className="text-gray-500 text-sm">Tidak ditemukan data yang cocok.</p>
                            {search && <button onClick={() => setSearch('')} className="mt-4 text-green-600 font-bold text-sm">Hapus Pencarian</button>}
                        </div>

                    /* KONDISI 2: DATA TEPAT ADA 2 (TWIN CARDS) */
                    ) : filteredAnnouncements.length === 2 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
                            {filteredAnnouncements.map((item, index) => (
                                <MobileCard 
                                    key={item.id} 
                                    item={item} 
                                    badgeText={index === 0 ? 'Utama' : 'Terbaru'}
                                    badgeColor={index === 0 ? 'bg-gray-900' : 'bg-green-500'}
                                />
                            ))}
                        </div>

                    /* KONDISI 3: LAYOUT KOMPLEKS */
                    ) : (
                        <>
                            {/* --- GRID UTAMA (Index 0-3) --- */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 lg:mb-16">

                                {/* 1. KARTU BESAR KIRI (MAIN FEATURED) */}
                                {/* Mobile View (Clickable via MobileCard) */}
                                <div className="block lg:hidden">
                                    {mainFeatured && <MobileCard item={mainFeatured} badgeText="Utama" badgeColor="bg-gray-900" />}
                                </div>

                                {/* Desktop View (Clickable Wrapper) */}
                                <div className="hidden lg:block relative h-full">
                                    {mainFeatured && (
                                        <Link 
                                            href={route('announcements.show', mainFeatured.slug)}
                                            className="block h-full min-h-[600px] rounded-[30px] overflow-hidden shadow-2xl group relative"
                                        >
                                            <img
                                                src={mainFeatured.image_url || 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/PENGUMUMAN.png'}
                                                alt={mainFeatured.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                                            <div className="absolute top-8 left-8">
                                                <span className="bg-white text-gray-900 text-sm font-bold px-6 py-2 rounded-xl shadow-md uppercase tracking-wide">
                                                    Utama
                                                </span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 p-8 pb-24 w-full md:w-4/5">
                                                <h3 className="text-3xl font-bold text-white mb-4 leading-snug">
                                                    {mainFeatured.title}
                                                </h3>
                                                {/* UPDATE: line-clamp-3 (sebelumnya 4) & break-words */}
                                                <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 break-words">
                                                    {mainFeatured.excerpt}
                                                </p>
                                            </div>
                                            {/* Fake Button (Visual Only) */}
                                            <div
                                                className="absolute bottom-0 right-0 bg-white text-gray-900 font-bold text-sm px-8 py-5 rounded-tl-[30px] group-hover:bg-gray-100 transition-colors tracking-widest uppercase shadow-lg z-10"
                                            >
                                                Selengkapnya
                                            </div>
                                        </Link>
                                    )}
                                </div>

                                {/* 2. KOLOM KANAN */}
                                <div className="flex flex-col gap-6">
                                    
                                    {/* A. KARTU KANAN ATAS */}
                                    {/* Mobile View */}
                                    <div className="block lg:hidden">
                                        {rightFeatured && <MobileCard item={rightFeatured} />}
                                    </div>

                                    {/* Desktop View (Clickable Wrapper) */}
                                    {rightFeatured && (
                                        <Link 
                                            href={route('announcements.show', rightFeatured.slug)}
                                            className="hidden lg:flex bg-white rounded-[30px] overflow-hidden shadow-xl flex-col h-full relative group transition-transform hover:-translate-y-1"
                                        >
                                            <div className="relative h-56 overflow-hidden">
                                                <img
                                                    src={rightFeatured.image_url || 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/PENGUMUMAN.png'}
                                                    alt={rightFeatured.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <span className="absolute top-6 left-6 bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase shadow-sm">
                                                    Baru
                                                </span>
                                            </div>
                                            <div className="p-8 pb-20 relative flex-1">
                                                <p className="text-xs text-gray-400 font-medium mb-2">
                                                    {formatDate(rightFeatured.date)}
                                                </p>
                                                <h4 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                                                    {rightFeatured.title}
                                                </h4>
                                                {/* UPDATE: line-clamp-3 (sudah benar, ditambahkan break-words) */}
                                                <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 break-words">
                                                    {rightFeatured.excerpt}
                                                </p>
                                            </div>
                                            {/* Fake Button */}
                                            <div
                                                className="absolute bottom-0 right-0 bg-green-500 text-white font-bold text-xs px-8 py-4 rounded-tl-[30px] group-hover:bg-green-600 transition-colors uppercase tracking-wider"
                                            >
                                                Selengkapnya
                                            </div>
                                        </Link>
                                    )}

                                    {/* B. LIST KARTU KECIL */}
                                    {rightList.map((item) => (
                                        <React.Fragment key={item.id}>
                                            {/* Mobile View */}
                                            <div className="block lg:hidden">
                                                <MobileCard item={item} />
                                            </div>

                                            {/* Desktop View (Clickable Wrapper) */}
                                            <Link 
                                                href={route('announcements.show', item.slug)}
                                                className="hidden lg:block bg-white rounded-[30px] p-8 shadow-lg relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                            >
                                                <p className="text-xs text-gray-400 font-medium mb-2">
                                                    {formatDate(item.date)}
                                                </p>
                                                <h4 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                                                    {item.title}
                                                </h4>
                                                {/* UPDATE: line-clamp-3 (sebelumnya 2) & break-words */}
                                                <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 break-words mb-8">
                                                    {item.excerpt}
                                                </p>
                                                <div className="absolute bottom-6 right-6">
                                                    <span className="bg-green-500 text-white text-[10px] font-bold px-6 py-2 rounded-full group-hover:bg-green-600 transition-colors uppercase">
                                                        Baru
                                                    </span>
                                                </div>
                                            </Link>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            {/* 3. WIDE BANNERS */}
                            {wideBanners.length > 0 && (
                                <div className="space-y-6 mb-12 md:mb-16">
                                    {wideBanners.map((banner) => (
                                        <React.Fragment key={banner.id}>
                                            {/* Mobile View */}
                                            <div className="block md:hidden">
                                                <MobileCard item={banner} />
                                            </div>

                                            {/* Desktop View */}
                                            <Link 
                                                href={route('announcements.show', banner.slug)} 
                                                className="hidden md:block group"
                                            >
                                                <div className="bg-white rounded-[20px] shadow-lg border border-gray-100 overflow-hidden flex flex-row h-48 transition-transform duration-300 hover:scale-[1.01] hover:shadow-xl">
                                                    <div className="w-2/5 relative overflow-hidden flex-shrink-0">
                                                        <div className="absolute top-3 left-3 z-10 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded">
                                                            BARU
                                                        </div>
                                                        <img
                                                            src={banner.image_url || 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/PENGUMUMAN.png'}
                                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="p-6 flex flex-col justify-center flex-1">
                                                        <span className="text-xs text-gray-400 mb-2 font-medium">
                                                            {formatDate(banner.date)}
                                                        </span>
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-green-600 transition-colors">
                                                            {banner.title}
                                                        </h3>
                                                        {/* UPDATE: line-clamp-3 (sebelumnya 2) & break-words */}
                                                        <p className="text-gray-500 text-sm line-clamp-3 break-words leading-relaxed">
                                                            {banner.excerpt}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}

                            {/* --- SECTION: SEMUA PENGUMUMAN (LIST BAWAH) --- */}
                            {rawBottomList.length > 0 && (
                                <div id="bottom-list-section" className="scroll-mt-24">
                                    <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                        <h2 className="text-2xl md:text-3xl font-bold uppercase text-gray-900">
                                            Semua Pengumuman
                                        </h2>
                                        <span className="text-sm text-gray-500 font-medium">
                                            Halaman {currentPage} dari {totalPages}
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        {currentBottomList.map((item) => (
                                            <Link 
                                                key={item.id} 
                                                href={route('announcements.show', item.slug)} 
                                                className="block group"
                                            >
                                                <div className="bg-white p-5 md:p-6 border border-gray-200 rounded-[20px] shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300 hover:bg-gray-50 cursor-pointer">
                                                    <p className="text-xs md:text-sm text-gray-500 mb-1">
                                                        {formatDate(item.date)}
                                                    </p>
                                                    <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2 transition-colors duration-300 group-hover:text-green-600">
                                                        {item.title}
                                                    </h3>
                                                    {/* UPDATE: line-clamp-3 (sebelumnya 2) & break-words */}
                                                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 break-words">
                                                        {item.excerpt}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {/* CONTROLLER PAGINASI */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center gap-2 mt-8 md:mt-10">
                                            <button
                                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                                disabled={currentPage === 1}
                                                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-green-50 hover:border-green-500 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                            </button>

                                            <div className="hidden md:flex gap-2">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                                    <button
                                                        key={number}
                                                        onClick={() => handlePageChange(number)}
                                                        className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                                                            currentPage === number
                                                                ? 'bg-green-500 text-white shadow-md transform scale-110'
                                                                : 'bg-white text-gray-600 border border-gray-300 hover:border-green-500 hover:text-green-600'
                                                        }`}
                                                    >
                                                        {number}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="md:hidden flex items-center px-4 font-bold text-gray-600">
                                                {currentPage} / {totalPages}
                                            </div>

                                            <button
                                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                                disabled={currentPage === totalPages}
                                                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-green-50 hover:border-green-500 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = page => <AppLayout children={page} />;