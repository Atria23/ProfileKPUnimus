import React, { useState, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';

// 1. Placeholder Gambar
const ImagePlaceholder = ({ className }) => (
    <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    </div>
);

// 2. Formatter Tanggal
const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

// --- ANIMATION VARIANTS ---
const swipeVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 50 : -50,
        opacity: 0,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? 50 : -50,
        opacity: 0,
    }),
};

// --- MAIN COMPONENT ---

export default function ArticleIndex({ articles }) {
    const [[page, direction], setPage] = useState([1, 0]);
    const itemsPerPage = 4;
    const listTopRef = useRef(null);

    const allArticles = articles.data || articles || [];
    const featuredArticle = allArticles.length > 0 ? allArticles[0] : null;
    const subFeaturedArticles = allArticles.length > 1 ? allArticles.slice(1, 4) : [];
    const rawLatestArticles = allArticles.length > 4 ? allArticles.slice(4) : [];

    const totalPages = Math.ceil(rawLatestArticles.length / itemsPerPage);
    const displayedLatestArticles = rawLatestArticles.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const paginate = (newPage) => {
        const newDirection = newPage > page ? 1 : -1;
        setPage([newPage, newDirection]);

        if (listTopRef.current) {
            setTimeout(() => {
                listTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
        }
    };

    return (
        <>
            <Head title="Artikel" />

            {/* --- HERO SECTION --- */}
            <div className="relative h-56 md:h-64 bg-gray-900 flex flex-col justify-center items-center text-center overflow-hidden">
                <img
                    src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/tampakdepan.webp"
                    alt="Background"
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-40 blur-[2px]"
                />
                <div className="relative z-10 max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase mb-2">
                        ARTIKEL
                    </h1>
                    <p className="text-gray-200 text-xs md:text-base font-medium leading-relaxed max-w-xs md:max-w-none mx-auto">
                        Informasi edukasi kesehatan dan promosi layanan klinik.
                    </p>
                </div>
            </div>

            <div className="bg-white pb-20 pt-8 md:pt-12">
                <div className="container max-w-6xl mx-auto px-4 md:px-8">

                    {allArticles.length === 0 ? (
                        /* --- EMPTY STATE --- */
                        <div className="w-full flex flex-col items-center justify-center min-h-[60vh] text-center bg-gray-50 rounded-[30px] border-2 border-dashed border-gray-200 p-8">
                            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Artikel</h3>
                            <p className="text-gray-500 font-medium">
                                Saat ini belum ada artikel yang dipublikasikan.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* --- BAGIAN 1: ARTIKEL TERBARU --- */}
                            {featuredArticle && (
                                <div className="mb-12 md:mb-16">
                                    <h2 className="text-xl md:text-3xl font-bold text-gray-900 uppercase mb-6 md:mb-8 border-l-4 border-green-600 pl-3 md:border-none md:pl-0">
                                        ARTIKEL TERBARU
                                    </h2>

                                    {/* Featured Large */}
                                    <div className="mb-10 md:mb-12">
                                        <Link
                                            href={route('articles.show', featuredArticle.slug || featuredArticle.id)}
                                            // UPDATE HOVER: Tambah padding, border transparan -> hijau, shadow, dan background
                                            className="group block  p-4 -m-4 transition-all duration-300 hover:shadow-[0px_20px_60px_-15px_rgba(16,185,129,0.4)] border border-transparent "
                                        >
                                            <div className="w-full h-64 sm:h-[400px] md:h-[500px] overflow-hidden mb-4 md:mb-6 bg-gray-100  shadow-sm">
                                                {featuredArticle.image_url ? (
                                                    <img
                                                        src={featuredArticle.image_url}
                                                        alt={featuredArticle.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <ImagePlaceholder className="w-full h-full" />
                                                )}
                                            </div>
                                            <div className="space-y-2 md:space-y-3 px-1 md:px-0">
                                                <span className="text-gray-500 text-xs md:text-sm block font-semibold">
                                                    {formatDate(featuredArticle.created_at || featuredArticle.date)}
                                                </span>
                                                <h3 className="text-xl md:text-3xl font-bold text-gray-900 uppercase group-hover:text-green-800 transition-colors duration-200 leading-tight">
                                                    {featuredArticle.title}
                                                </h3>
                                                <p className="text-gray-600 md:text-gray-700 text-sm md:text-lg leading-relaxed line-clamp-3 whitespace-normal break-words">
                                                    {featuredArticle.excerpt || featuredArticle.body?.substring(0, 200)}...
                                                </p>
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Sub-Featured Grid */}
                                    {subFeaturedArticles.length > 0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                                            {subFeaturedArticles.map((item, index) => (
                                                <Link
                                                    key={index}
                                                    href={route('articles.show', item.slug || item.id)}
                                                    // UPDATE HOVER: Padding trick (-m-3 p-3) agar area hover lebih luas dan kotak terlihat jelas
                                                    className="group block flex flex-row sm:flex-col gap-4 sm:gap-0 items-start sm:items-stretch p-3 -m-3 transition-all duration-300 hover:shadow-[0px_20px_60px_-15px_rgba(16,185,129,0.4)]"
                                                >
                                                    <div className="w-1/3 sm:w-full aspect-[4/3] overflow-hidden sm:mb-4 bg-gray-100  flex-shrink-0 shadow-sm">
                                                        {item.image_url ? (
                                                            <img
                                                                src={item.image_url}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <ImagePlaceholder className="w-full h-full" />
                                                        )}
                                                    </div>
                                                    <div className="w-2/3 sm:w-full">
                                                        <h4 className="font-bold text-gray-900 uppercase text-sm md:text-base mb-1 md:mb-2 group-hover:text-green-800 transition-colors duration-200 line-clamp-2 leading-snug">
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-2 line-clamp-2 md:line-clamp-3 whitespace-normal break-words hidden sm:block">
                                                            {item.excerpt || item.body?.substring(0, 100)}...
                                                        </p>
                                                        <span className="text-gray-400 text-[10px] md:text-xs">
                                                            By {item.author?.name || 'Admin'}
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- BAGIAN 2: ARTIKEL LAINNYA --- */}
                            {/* PERUBAHAN 1: Hapus 'overflow-hidden' di sini agar shadow tidak kepotong */}
                            <div ref={listTopRef} className="scroll-mt-24">
                                {rawLatestArticles.length > 0 && (
                                    <>
                                        <h2 className="text-xl md:text-3xl font-bold text-gray-900 uppercase mb-6 md:mb-8 border-t pt-8 md:pt-10 border-gray-200">
                                            ARTIKEL LAINNYA
                                        </h2>

                                        <AnimatePresence mode="wait" custom={direction}>
                                            <motion.div
                                                key={page}
                                                custom={direction}
                                                variants={swipeVariants}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                transition={{
                                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                                    opacity: { duration: 0.2 }
                                                }}
                                                className="flex flex-col gap-6 md:gap-8 min-h-[300px]"
                                            >
                                                {displayedLatestArticles.map((article, index) => (
                                                    <Link
                                                        key={article.id || index}
                                                        href={route('articles.show', article.slug || article.id)}

                                                        // PERUBAHAN 2: 
                                                        // - Update hover shadow sesuai permintaan
                                                        // - Pastikan z-index naik saat hover (relative z-10) agar menumpuk di atas elemen lain
                                                        className="flex flex-col md:flex-row gap-4 md:gap-6 group p-4 md:p-3 md:-mx-3 transition-all duration-300 hover:shadow-[0px_20px_60px_-15px_rgba(16,185,129,0.4)] md:bg-transparent relative hover:z-10"
                                                    >
                                                        {/* Gambar List */}
                                                        <div className="w-full md:w-1/3 aspect-video md:h-52 overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm border border-gray-100">
                                                            {article.image_url ? (
                                                                <img
                                                                    src={article.image_url}
                                                                    alt={article.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <ImagePlaceholder className="w-full h-full" />
                                                            )}
                                                        </div>

                                                        <div className="w-full md:w-2/3 flex flex-col justify-center">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-gray-500 text-[10px] md:text-sm font-medium bg-gray-100 group-hover:bg-white px-2 py-1 rounded transition-colors">
                                                                    {formatDate(article.created_at || article.date)}
                                                                </span>
                                                            </div>
                                                            <h3 className="text-lg md:text-2xl font-bold text-gray-900 uppercase mb-2 md:mb-3 group-hover:text-green-800 transition-colors duration-200 line-clamp-2 leading-tight">
                                                                {article.title}
                                                            </h3>
                                                            <p className="text-gray-600 md:text-gray-700 text-sm md:text-base leading-relaxed line-clamp-3 whitespace-normal break-words">
                                                                {article.excerpt || article.body?.substring(0, 150)}...
                                                            </p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        </AnimatePresence>

                                        {/* --- PAGINATION CONTROLS --- */}
                                        {totalPages > 1 && (
                                            <div className="my-10 pt-8 border-t border-gray-200">
                                                <div className="flex flex-row justify-center md:justify-between items-center w-full">

                                                    <button
                                                        onClick={() => paginate(Math.max(1, page - 1))}
                                                        disabled={page === 1}
                                                        className={`hidden md:flex px-5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-200 items-center gap-2
                                ${page === 1
                                                                ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                                                                : 'border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600 hover:bg-green-50 active:scale-95'
                                                            }`}
                                                    >
                                                        <span className="text-lg leading-none pb-0.5">&larr;</span>
                                                        <span>Sebelumnya</span>
                                                    </button>

                                                    <div className="flex flex-wrap justify-center items-center gap-3 py-4">
                                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                                            <button
                                                                key={p}
                                                                onClick={() => paginate(p)}
                                                                className={`w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 border
                                        ${page === p
                                                                        ? 'bg-green-600 border-green-600 text-white shadow-lg scale-110 z-10'
                                                                        : 'bg-white border-transparent text-gray-500 hover:bg-gray-100'
                                                                    }`}
                                                            >
                                                                <span className="mt-[1px]">{p}</span>
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <button
                                                        onClick={() => paginate(Math.min(totalPages, page + 1))}
                                                        disabled={page === totalPages}
                                                        className={`hidden md:flex px-5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-200 items-center gap-2
                                ${page === totalPages
                                                                ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                                                                : 'border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600 hover:bg-green-50 active:scale-95'
                                                            }`}
                                                    >
                                                        <span>Selanjutnya</span>
                                                        <span className="text-lg leading-none pb-0.5">&rarr;</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}

                </div>
            </div>
        </>
    );
}

ArticleIndex.layout = page => <AppLayout children={page} />;