import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

// --- KOMPONEN HELPER & IKON ---

const SearchIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const ClockIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// --- KOMPONEN KARTU LOWONGAN ---

const JobCard = ({ vacancy }) => {
    const isClosed = vacancy.status === 'closed';

    // Helper: Format Tanggal Indonesia
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    // Helper: Membersihkan HTML dari RichEditor untuk Preview Card
    const stripHtml = (html) => {
        if (!html) return '';
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    // Logika Teks Batas Waktu (Sesuai Resource Filament)
    const deadlineText = vacancy.open_until_type === 'date' 
        ? formatDate(vacancy.open_until_date)
        : 'Sampai Terisi';

    return (
        <div className="relative w-full bg-white rounded-[30px] flex flex-col md:flex-row overflow-hidden border border-white transition-all duration-300 hover:-translate-y-1
            shadow-[0px_10px_40px_-10px_rgba(16,185,129,0.25)] hover:shadow-[0px_20px_60px_-15px_rgba(16,185,129,0.4)]">
            
            {/* Poster Image 
                MOBILE: w-full h-56 (Responsive)
                DESKTOP: w-[240px] h-[301px] (FIXED PIXEL PERFECT)
            */}
            <div className="flex-shrink-0 bg-gray-100 w-full h-56 md:w-[240px] md:h-[301px]">
                <img
                    src={vacancy.poster_image}
                    alt={`Poster ${vacancy.profession}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>

            {/* Detail Content 
                MOBILE: h-auto (Flexible)
                DESKTOP: h-[301px] (FIXED PIXEL PERFECT)
            */}
            <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between h-auto md:h-[301px]"> 
                <div>
                    {/* Header: Judul & Badge Status */}
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight line-clamp-2">
                            {vacancy.profession}
                        </h3>
                        
                        <div className={`px-3 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ml-2 ${
                            isClosed 
                            ? 'border-gray-300 text-gray-500 bg-gray-50' 
                            : 'border-green-500 text-green-600 bg-white'
                        }`}>
                            {isClosed ? 'DITUTUP' : 'DIBUKA'}
                        </div>
                    </div>

                    {/* Deskripsi Singkat (Stripped HTML) */}
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-4 mb-4 font-medium">
                        {stripHtml(vacancy.description) || 'Klik detail untuk melihat deskripsi lengkap lowongan ini.'}
                    </p>
                </div>

                {/* Footer: Info Deadline & Tombol */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wide self-start sm:self-center">
                        <ClockIcon className="w-5 h-5 mb-0.5" />
                        {/* Menampilkan text deadline dinamis */}
                        <span>{deadlineText}</span>
                    </div>
                    
                    <Link 
                        href={route('jobs.show', vacancy.id)} 
                        className={`w-full sm:w-auto text-center px-8 py-2.5 rounded-lg font-bold text-sm tracking-wide shadow-md transition-all duration-300 ${
                            isClosed
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#00C06A] text-white hover:bg-[#00a85d] shadow-green-200 hover:shadow-green-300'
                        }`}
                    >
                        {isClosed ? 'DETAIL' : 'APPLY'}
                    </Link>
                </div>
            </div>
        </div>
    );
};


// --- KOMPONEN PAGINASI ---

const Pagination = ({ links }) => {
    return (
        <div className="mt-16 flex justify-center flex-wrap gap-2">
            {links.map((link, key) => (
                <Link
                    key={key}
                    href={link.url}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-bold rounded-md transition-colors duration-200 ${
                        link.active
                            ? 'bg-[#00C06A] text-white shadow-lg shadow-green-200'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                    as="button"
                    disabled={!link.url}
                />
            ))}
        </div>
    );
};


// --- HALAMAN UTAMA ---

export default function Index({ vacancies, filters }) {
    // State Filter
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [jobType, setJobType] = useState(filters.status || 'all');

    // Fungsi Submit Filter ke Backend
    const applyFilters = (search, type) => {
        router.get(
            route('jobs.index'),
            { search: search, status: type },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters(searchTerm, jobType);
    };
    
    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setJobType(newType);
        applyFilters(searchTerm, newType);
    }

    return (
        <AppLayout>
            <Head title="Karir" />

            <main className="bg-[#F8F9FA] min-h-screen">

                {/* --- HERO SECTION --- */}
                <div className="relative h-56 md:h-64 bg-gray-900 flex flex-col justify-center items-center text-center overflow-hidden">
                    <img
                        src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/tampakdepan.webp"
                        alt="Background"
                        className="absolute top-0 left-0 w-full h-full object-cover opacity-40 blur-[2px]"
                    />
                    <div className="relative z-10 max-w-4xl mx-auto px-4">
                        {/* Responsif Font Size: text-3xl di mobile, text-5xl di desktop */}
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase mb-2">
                            KARIR
                        </h1>
                        <p className="text-gray-200 text-xs md:text-base font-medium leading-relaxed max-w-xs md:max-w-none mx-auto">
                            Cari berbagai jenis pekerjaan di bidang kesehatan di Klinik Pratama Unimus.
                        </p>
                    </div>
                </div>

                {/* --- KONTEN UTAMA --- */}
                <div className="container max-w-7xl mx-auto px-4 pb-20 mt-10 mb-10">
                    
                    {/* --- FILTER BOX --- */}
                    <div className="rounded-2xl flex flex-col md:flex-row gap-4 items-center max-w-5xl mx-auto">
                        
                        {/* Input Pencarian (By Profession) */}
                        <div className="relative flex-grow w-full">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                <SearchIcon className="w-5 h-5" />
                            </span>
                            <form onSubmit={handleSearchSubmit} className="w-full">
                                <input 
                                    type="text" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari profesi / posisi..." 
                                    className="w-full border border-gray-300 text-gray-600 focus:border-green-500 focus:ring-green-500 rounded-xl pl-11 py-3 text-sm placeholder-gray-400" 
                                />
                            </form>
                        </div>

                        {/* Dropdown Status (Open/Closed) */}
                        <div className="relative w-full md:w-48 flex-shrink-0">
                             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                <ClockIcon className="w-5 h-5" />
                             </div>
                             <select 
                                value={jobType}
                                onChange={handleTypeChange}
                                className="w-full border border-gray-300 text-gray-700 font-medium focus:border-green-500 focus:ring-green-500 rounded-xl py-3 pl-10 pr-8 text-sm cursor-pointer appearance-none bg-white"
                                style={{ backgroundImage: 'none' }} 
                            >
                                <option value="all">Semua Status</option>
                                <option value="open">Dibuka</option>
                                <option value="closed">Ditutup</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>

                        {/* Tombol Cari */}
                        <button 
                            onClick={handleSearchSubmit}
                            className="w-full md:w-auto px-8 py-3 bg-[#00C06A] text-white font-bold rounded-xl hover:bg-[#00a85d] transition-colors duration-300 flex items-center justify-center gap-2 shadow-md shadow-green-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                            </svg>
                            <span>CARI</span>
                        </button>
                    </div>

                    {/* --- DAFTAR LOWONGAN --- */}
                    <div className="mt-12">
                        {vacancies.data && vacancies.data.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
                                {vacancies.data.map((vacancy) => (
                                    <JobCard key={vacancy.id} vacancy={vacancy} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24">
                                <div className="inline-block p-4 rounded-full bg-green-50 mb-4">
                                    <SearchIcon className="w-10 h-10 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Tidak Ada Lowongan Ditemukan</h3>
                                <p className="text-gray-500 mt-2">Belum ada lowongan yang sesuai kriteria pencarian Anda.</p>
                            </div>
                        )}
                    </div>
                    
                    {/* --- PAGINASI --- */}
                    {vacancies.links && vacancies.links.length > 3 && <Pagination links={vacancies.links} />}
                </div>
            </main>
        </AppLayout>
    );
}