import React, { useState, useRef, Suspense, lazy } from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';


// --- KOMPONEN ITEM LIST (CARD) ---
const ServiceCard = ({ service, index }) => {
    const isFeatured = parseInt(service.is_featured) === 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-[24px] shadow-lg overflow-hidden flex flex-col h-full"
        >
            <div className="relative">
                <img
                    src={service.image_path}
                    alt={service.title}
                    className="w-full h-48 md:h-56 object-cover"
                    loading="lazy"
                />
                {/* ribbon */}
                {isFeatured && (
                    <div className="absolute top-5 right-0 z-20 filter drop-shadow-md">
                        <div
                            className="bg-gradient-to-l from-[#179938] to-[#0DC93C] text-white h-7 flex items-center pl-6 pr-4 shadow-sm"
                            style={{
                                clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 12px 50%, 0 0)'
                            }}
                        >
                            <div className="flex flex-row items-center gap-1 text-center px-2">
                                <span className="text-[10px] font-bold tracking-wider uppercase leading-none">
                                    Layanan <br /> Unggulan
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="relative px-5 md:px-6 pb-6 -mt-12 z-10 flex-grow flex flex-col">
                <img
                    src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/VECTOR.svg"
                    alt="Background Shape"
                    className="absolute z-0 max-w-none opacity-100"
                    loading="lazy"
                    style={{
                        width: '691.66px',
                        height: '323.72px',
                        left: '-230px',
                        top: '10px',
                        transform: 'rotate(-2deg)'
                    }}
                />
                <div className="relative z-10 pt-10 flex-grow">
                    <h3 className="text-xl md:text-2xl font-bold text-[#009B4C] mb-3 flex items-center">
                        <span className="block w-6 h-1 md:w-8 bg-[#009B4C] mr-3 md:mr-4 flex-shrink-0"></span>
                        {service.title}
                    </h3>
                    <div
                        className="text-gray-700 text-sm leading-relaxed line-clamp-3"
                        dangerouslySetInnerHTML={{
                            __html: service.content.replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>')
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

// --- KOMPONEN ITEM LIST (FACILITY CARD - SPLIT BERSIH / TRANSPARAN) ---
const FacilityCardNew = ({ facility, index }) => {
    // Fallback jika excerpt kosong
    const description = facility.excerpt || "Fasilitas tersedia untuk kenyamanan pasien.";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            // Container Utama
            className="w-full bg-white rounded-[30px] shadow-xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[450px] border border-gray-100 relative"
        >
            {/* --- GAMBAR FULL BACKGROUND --- */}
            <div className="absolute inset-0 z-0">
                <img
                    src={facility.image_path}
                    alt={facility.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x600?text=No+Image';
                    }}
                />
            </div>

            {/* --- BAGIAN KIRI: KOSONG / TRANSPARAN (50%) --- */}
            <div className="relative w-full md:w-1/2 h-64 md:h-full flex-shrink-0 z-10">
                {/* Hanya placeholder, gambar background sudah full */}
                <div className="w-full h-full bg-transparent"></div>

                {/* Badge Nomor */}
                <div className="absolute top-6 left-6 w-14 h-14 bg-[#f3f4f6] rounded-full flex items-center justify-center shadow-lg z-20 border-2 border-white">
                    <span className="text-2xl font-extrabold text-[#9ca3af]">
                        {index + 1}
                    </span>
                </div>
            </div>

            {/* --- BAGIAN KANAN: KONTEN TEKS DENGAN OPACITY (50%) --- */}
            <div className="relative w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center z-10">
                {/* Background dengan opacity rendah - biar gambar terlihat */}
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-0"></div>

                {/* Konten teks */}
                <div className="relative z-10">
                    {/* Hiasan garis dekoratif */}
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full "></div>

                    <h3 className="text-2xl md:text-xl font-extrabold text-[#1a2e35] uppercase mb-4 leading-tight tracking-wide drop-shadow-sm">
                        {facility.title}
                    </h3>

                    <p className="text-sm md:text-base text-gray-800 font-medium leading-relaxed text-justify drop-shadow-sm">
                        {description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};




const AnimateOnScroll = ({ children, stagger = 0.15, once = true }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount: 0.2 });
    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: stagger } }
    };

    return (
        <motion.div
            ref={ref}
            className="container mx-auto px-4"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
        >
            {children}
        </motion.div>
    );
};

const CertificateModal = ({ src, alt, onClose }) => {
    if (!src) return null;

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center p-4"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.img
                src={src}
                alt={alt}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
                loading="lazy"
            />
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white text-3xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
            >
                &times;
            </button>
        </motion.div>
    );
};

// LAZY LOADING: Komponen fallback untuk ditampilkan saat section sedang dimuat
const FallbackComponent = () => (
    <div style={{ height: '400px' }} className="w-full bg-gray-200 animate-pulse my-10"></div>
);

// --- Data Statis ---
const facilitiesData = [];
const certificateData = [
    {
        id: 1,
        imagePath: 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/sertifikat/SERTIFIKAT%20FASYANKES%20KEMENKES.png',
        alt: 'Sertifikat Registrasi Fasyankes Klinik Unimus'
    },
    {
        id: 2,
        imagePath: 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/sertifikat/SERTIFIKAT%20AKREDITASI.png',
        alt: 'Sertifikat Akreditasi Paripurna Klinik Unimus'
    },
    {
        id: 3,
        imagePath: 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/sertifikat/SERTIFIKAT%20SERTIFIKASI%20USG.png',
        alt: 'Sertifikat Pelatihan USG'
    }
];

const simpleItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const dynamicTitleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const dynamicContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// === Komponen Utama ===
const LandingPage = ({ settings, services, articles, doctors, facilities }) => {
    const [selectedCertificate, setSelectedCertificate] = useState(null);

    // --- LOGIKA FILTER & SORTING ---
    let displayServices = [];
    if (services && services.length > 0) {
        const featured = services.filter(s => parseInt(s.is_featured) === 1).slice(0, 3);
        const ordinary = services.filter(s => parseInt(s.is_featured) === 0).slice(0, 3);
        displayServices = [...featured, ...ordinary];

        if (displayServices.length < 6) {
            const currentIds = displayServices.map(s => s.id);
            const remaining = services.filter(s => !currentIds.includes(s.id));
            displayServices.push(...remaining.slice(0, 6 - displayServices.length));
        }
    }

    const leftServices = displayServices.filter((_, i) => i % 3 === 0).sort((a, b) => parseInt(a.is_featured) - parseInt(b.is_featured));
    const centerServices = displayServices.filter((_, i) => i % 3 === 1).sort((a, b) => parseInt(b.is_featured) - parseInt(a.is_featured));
    const rightServices = displayServices.filter((_, i) => i % 3 === 2).sort((a, b) => parseInt(a.is_featured) - parseInt(b.is_featured));

    const facilitiesData = facilities || [];

    // Filter untuk bagian ATAS (Penunjang) - Sesuai Gambar 1
    const facilitiesPenunjang = facilitiesData.filter(f => f.category === 'Fasilitas Penunjang');

    // Filter untuk bagian BAWAH (Perawatan) - Sesuai Gambar 2
    const facilitiesPerawatan = facilitiesData.filter(f => f.category === 'Fasilitas Perawatan');

    return (
        <>
            <Head title="Klinik Pratama UNIMUS" />

            {/* === HERO SECTION === */}
<section id="hero" className="relative w-full h-[600px] md:h-[600px] lg:h-[650px] overflow-hidden">
    {/* Background Image */}
    <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: 'url(https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/FOTO%20KLINIK2.jpeg)' }}>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#064e3b] via-[#167E43] to-[#28E47A] opacity-90"></div>
    </div>

    {/* Gedung Image Animation */}
    <motion.div
        // PERUBAHAN: opacity-50 di mobile agar tidak menutupi teks, md:opacity-100 (desktop normal)
        className="absolute bottom-0 -right-1/4 w-[130%] h-1/2 opacity-50 md:opacity-100 md:h-full md:w-4/5 md:-right-16 lg:w-3/4 lg:-right-24 z-10 pointer-events-none"
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }} // Note: opacity akan di-override oleh class tailwind di atas untuk responsivitas visual
        transition={{ duration: 0.8, ease: "easeOut" }}
    >
        <img
            src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/tambakdepancut.png"
            alt="Gedung Klinik Pratama UNIMUS"
            className="w-full h-full object-contain object-right-bottom"
        />
    </motion.div>

    {/* Content */}
    <div className="relative container mx-auto px-6 h-full flex items-center z-20">
        <motion.div
            className="w-full md:w-2/3 lg:w-1/2 text-white text-center md:text-left mt-[-20px] md:mt-0"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
            <motion.p
                variants={simpleItemVariants}
                className="text-base md:text-xl font-light mb-1 md:mb-0"
                style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.6)' }}
            >
                Hello, Selamat datang di
            </motion.p>
            <motion.h1
                variants={simpleItemVariants}
                // PERUBAHAN: Ukuran font di mobile disesuaikan agar tidak pecah (text-4xl)
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight my-2 md:my-3 leading-tight"
                style={{
                    textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 0 10px rgba(255,255,255,0.7), 0 0 20px rgba(200,255,220,0.5)'
                }}
            >
                <span className="block whitespace-nowrap">KLINIK PRATAMA</span>
                <span className="block">UNIMUS</span>
            </motion.h1>
            <motion.p
                variants={simpleItemVariants}
                className="text-sm sm:text-lg md:text-xl font-medium tracking-wider pb-4 md:pb-12"
                style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.6)' }}
            >
                MELAYANI UMAT, MENEBAR MANFAAT
            </motion.p>

            {/* ACTION BUTTONS CONTAINER */}
            <motion.div
                variants={simpleItemVariants}
                // PERUBAHAN: Margin top dikurangi di mobile (mt-10) agar muat di layar kecil, desktop tetap (mt-16)
                className="flex flex-col mt-10 md:mt-16 gap-4 w-full sm:max-w-md mx-auto md:mx-0 px-2 sm:px-0"
            >
                {/* 1. BUTTON LIHAT LAYANAN (Style Transparan / Glassmorphism) */}
                <Link
                    href={route('services.index')}
                    // PERUBAHAN: w-full di mobile, sm:w-64 di desktop. justifyContent center untuk mobile.
                    className="group relative w-full sm:w-64 bg-white/10 backdrop-blur-md border border-white/30 rounded-full p-1.5 flex items-center justify-between sm:justify-start shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.2)] hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                    {/* Icon Circle */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-[#009B4D] shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 sm:w-6 sm:h-6 transform transition-transform group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>

                    {/* Text */}
                    <span className="flex-grow text-center pr-3 text-white font-bold text-lg sm:text-xl tracking-wide group-hover:text-white/90 transition-colors">
                        Lihat Layanan
                    </span>
                </Link>

                {/* 2. BUTTON TANYA AI */}
                <Link
                    href={route('ai.chat')}
                    className="relative w-full bg-white/10 backdrop-blur-md border border-white/30 rounded-full p-1.5 flex items-center shadow-lg hover:bg-white/20 transition-all duration-300 group"
                >
                    {/* Text Area */}
                    <span className="flex-grow pl-5 text-white/90 font-medium text-base sm:text-lg group-hover:text-white transition-colors text-left">
                        Tanya Asisten AI . . .
                    </span>

                    {/* Icon Circle */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-[#009B4D] rounded-full flex items-center justify-center shrink-0 shadow-sm">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 sm:w-6 sm:h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                </Link>

            </motion.div>
        </motion.div>
    </div>
</section>

            {/* LAZY LOADING: Semua section di bawah ini dibungkus dengan Suspense */}
            <Suspense fallback={<FallbackComponent />}>
                <section id="tentang" className="py-16 md:py-16 bg-white overflow-hidden">
                    <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-10 md:mb-16"
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1a1a2e] uppercase tracking-wide">
                                Tentang Kami
                            </h2>
                        </motion.div>
                        <AnimateOnScroll>
                            <div className="flex flex-col md:flex-row items-start gap-0 relative">
                                <motion.div
                                    variants={simpleItemVariants}
                                    className="relative w-full md:w-1/2 flex-shrink-0 z-10"
                                >
                                    <div className="relative pr-0 md:pr-0 md:pb-6 pb-2">
                                        <div className="absolute top-4 md:top-8 bottom-0 left-[-10px] md:left-[-25px] right-2 md:right-4 border-[4px] md:border-[8px] border-[#00A54F] rounded-tl-[20px] md:rounded-tl-[30px] rounded-br-[20px] md:rounded-br-[30px] -z-10 block"></div>
                                        <div className="relative overflow-hidden border-[4px] md:border-[8px] border-[#00A54F] rounded-tl-[30px] md:rounded-tl-[50px] rounded-br-[30px] md:rounded-br-[50px] shadow-2xl w-full aspect-video bg-black z-10">
                                            <iframe
                                                className="w-full h-full absolute inset-0"
                                                src="https://www.youtube.com/embed/J8sPJwXArFI?si=E5MkHOp7ALt7YPXN"
                                                title="Profil Klinik Pratama Unimus"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                referrerPolicy="strict-origin-when-cross-origin"
                                                allowFullScreen
                                                loading="lazy"
                                            ></iframe>
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    variants={simpleItemVariants}
                                    className="w-full md:w-1/2 flex flex-col mt-8 md:mt-0 relative z-20"
                                >
                                    <div className="bg-[#00a651] text-white py-3 px-6 md:-ml-2 md:pl-10 md:pr-12 rounded-lg md:rounded-r-[21px] md:rounded-l-none mb-4 md:mb-6 shadow-md md:shadow-none mx-2 md:mx-0">
                                        <h3 className="text-lg md:text-3xl font-bold uppercase tracking-wider text-center md:text-left">
                                            Klinik Pratama Unimus
                                        </h3>
                                    </div>
                                    <div className="px-2 md:pl-8 text-gray-700 leading-relaxed text-sm md:text-[1.05rem] text-justify">
                                        <p className="mb-6">
                                            Klinik Pratama UNIMUS merupakan hasil pemberian hibah dari Yayasan Pendidikan Wanita Islam yang berada di Jl. Petek Kp. Gayam RT. 02 RW.06, Kel. Dadapsari, Semarang Utara yang dahulunya bernama Rumah Bersalin Annisa, yang kemudian dihibahkan kepada UNIMUS untuk di kelola dan diaktifkan kembali. Klinik Pratama UNIMUS dibangun pada tahun 2020 dan mulai di operasionalkan pada bulan April 2022 yang dipimpin oleh dr. Chamim Faizin, M.M.R., FISPH, FISCM sebagai Direktur Klinik atas penunjukkan dari Rektor Universitas Muhammadiyah Semarang.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </AnimateOnScroll>
                    </div>
                </section>
            </Suspense>

            {/* === SECTION VISI & MISI === */}
            <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
                <section id="visi-misi" className="relative py-16 md:py-16 bg-gradient-to-br from-[#ecfdf5] via-[#dcfce7] to-[#ecfdf5] overflow-hidden">

                    {/* === DEKORASI BACKGROUND === */}
                    {/* Blob Hijau Kiri Atas - Ukuran lebih kecil di mobile */}
                    <div className="absolute top-0 left-0 w-40 h-40 md:w-60 md:h-60 bg-[#009B4C] opacity-5 md:opacity-5 rounded-full blur-[60px] md:blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                    {/* Blob Hijau Kanan Bawah - Ukuran lebih kecil di mobile */}
                    <div className="absolute bottom-0 right-0 w-60 h-60 md:w-80 md:h-80 bg-[#009B4C] opacity-10 md:opacity-10 rounded-full blur-[80px] md:blur-[100px] translate-x-1/4 md:translate-x-1/3 translate-y-1/4 md:translate-y-1/3 pointer-events-none" />

                    {/* Pattern Dot Grid Halus */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 md:opacity-20 pointer-events-none mix-blend-soft-light"></div>

                    {/* === DEKORASI TAMBAHAN UNTUK MOBILE === */}
                    {/* Lingkaran kecil kiri tengah (mobile only) */}
                    <div className="absolute top-1/4 -left-10 w-40 h-40 border-[20px] border-[#00b050] rounded-full opacity-30 md:hidden pointer-events-none"></div>

                    {/* Lingkaran kecil kanan bawah (mobile only) */}
                    <div className="absolute bottom-1/4 -right-10 w-32 h-32 border-[15px] border-[#009B4C] rounded-full opacity-25 md:hidden pointer-events-none"></div>

                    {/* Blob tengah atas (mobile only) */}
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-gradient-to-r from-[#009B4C] to-[#4ade80] opacity-5 rounded-full blur-[50px] md:hidden pointer-events-none"></div>

                    <AnimateOnScroll>
                        <div className="container mx-auto px-4 max-w-5xl relative z-10">
                            {/* Background Decor - Desktop only */}
                            <div className="absolute -top-52 -right-80 w-[32rem] h-[32rem] border-[38px] border-[#00b050] rounded-full opacity-80 z-0 hidden lg:block pointer-events-none"></div>
                            <div className="absolute -bottom-56 -left-80 w-[32rem] h-[32rem] border-[38px] border-[#00b050] rounded-full opacity-80 z-0 hidden lg:block pointer-events-none"></div>

                            {/* === BAGIAN VISI === */}
                            <motion.div
                                variants={simpleItemVariants}
                                className="mb-9 md:mb-12 text-center relative"
                            >

                                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a2e35] uppercase tracking-wide mb-6 relative z-10">
                                    Visi Kami
                                </h2>

                                {/* Desain Visi Modern & Compact */}
                                <div className="max-w-3xl mx-auto w-full">
                                    <div className="relative group">
                                        {/* Efek Glow - Perbaikan untuk mobile */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[#009B4C] to-[#4ade80] rounded-[30px] md:rounded-[45px] blur opacity-15 md:opacity-20 group-hover:opacity-35 transition duration-500"></div>

                                        <div className="relative bg-white rounded-[30px] md:rounded-[40px] p-1 md:p-1.5 shadow-lg border border-[#009B4C]/20">
                                            <div className="bg-[#f0fdf4] rounded-[25px] md:rounded-[35px] px-4 py-5 md:px-10 md:py-8 flex flex-col items-center justify-center min-h-[80px] md:min-h-[90px] relative overflow-hidden">

                                                {/* Icon Dekorasi SVG Manual - Ukuran mobile diperkecil */}
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="absolute top-2 left-3 md:top-3 md:left-4 text-[#009B4C]/10 w-6 h-6 md:w-12 md:h-12 transform -scale-x-100"
                                                >
                                                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                                                </svg>

                                                <p className="text-[#1a2e35] text-sm md:text-xl font-bold leading-relaxed text-center relative z-10 font-serif italic px-1 md:px-0">
                                                    "{settings?.vision || 'Menjadi klinik pratama yang unggul dalam layanan primer, pendidikan dan penelitian kesehatan berlandaskan nilai islam di Indonesia pada tahun 2030'}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* === BAGIAN MISI === */}
                            <div className="mb-6 md:mb-8 text-center relative">
                                {/* Dekorasi garis untuk judul Misi (mobile) */}
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-[#009B4C] to-transparent opacity-30 md:hidden"></div>

                                <h3 className="text-xl md:text-2xl font-bold text-[#1a2e35] mb-2 uppercase">Misi</h3>
                                <div className="w-12 h-1 bg-[#009B4C] mx-auto rounded-full"></div>
                            </div>

                            {/* === REVISI UTAMA: MOBILE LAYOUT BARU, DESKTOP TETAP === */}

                            {/* MOBILE LAYOUT (lg:hidden) */}
                            <div className="lg:hidden space-y-4 px-2 relative">
                                {/* Dekorasi dots pattern untuk mobile */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#009B4C_1px,transparent_1px)] bg-[length:20px_20px] opacity-[0.03] pointer-events-none"></div>

                                {settings?.mission && settings.mission.length > 0 ? (
                                    settings.mission.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            variants={simpleItemVariants}
                                            whileHover={{ y: -2 }}
                                            className="relative w-full"
                                        >
                                            {/* Garis vertikal dekoratif kiri card */}
                                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-[#009B4C] to-[#4ade80] rounded-full opacity-70"></div>

                                            {/* Card untuk Mobile */}
                                            <div className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,155,76,0.08)] border border-[#009B4C]/10 overflow-hidden ml-3 relative">
                                                {/* Efek gradien di sudut kanan atas */}
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#009B4C]/5 to-transparent rounded-bl-full pointer-events-none"></div>

                                                {/* Header dengan nomor dalam lingkaran */}
                                                <div className="flex items-center mb-3 relative z-10">
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#009B4C] to-[#0d4223] flex items-center justify-center shadow-sm mr-3 relative overflow-hidden">
                                                        {/* Efek cahaya dalam lingkaran */}
                                                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                                                        <span className="text-white text-base font-bold relative z-10">
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-[#1a2e35] font-bold text-base">
                                                        Misi {index + 1}
                                                    </h4>
                                                </div>

                                                {/* Konten Misi */}
                                                <div className="pl-1 relative z-10">
                                                    <p className="text-gray-700 text-sm leading-relaxed font-medium">
                                                        {item.content}
                                                    </p>
                                                </div>

                                                {/* Garis dekoratif di bawah */}
                                                <div className="mt-3 pt-3 border-t border-[#009B4C]/10">
                                                    <div className="w-16 h-0.5 bg-gradient-to-r from-[#009B4C] to-[#4ade80] rounded-full"></div>
                                                </div>

                                                {/* Icon kecil di pojok kanan bawah */}
                                                <div className="absolute bottom-2 right-2 opacity-10">
                                                    <svg className="w-5 h-5 text-[#009B4C]" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 relative z-10">
                                        <div className="bg-gradient-to-r from-[#009B4C]/5 to-[#4ade80]/5 rounded-2xl p-6 border border-[#009B4C]/20">
                                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-[#009B4C]/10 to-[#4ade80]/10 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-[#009B4C]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-400 italic text-sm">Data misi belum tersedia.</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* DESKTOP LAYOUT (hidden lg:grid) - TIDAK BERUBAH DARI KODE ASLI */}
                            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-y-6 lg:gap-x-12 px-1 md:px-4">
                                {settings?.mission && settings.mission.length > 0 ? (
                                    settings.mission.map((item, index) => {
                                        const isRightSide = index % 2 !== 0;

                                        return (
                                            <motion.div
                                                key={index}
                                                variants={simpleItemVariants}
                                                whileHover={{ y: -3 }}
                                                className="w-full flex justify-center"
                                            >
                                                <div className={`flex items-center w-full max-w-md h-[120px] relative group cursor-default`}>

                                                    {/* === LOGIKA LAYOUT KIRI (GANJIL: 01, 03) === */}
                                                    {!isRightSide && (
                                                        <>
                                                            {/* BAGIAN HIJAU (NOMOR) */}
                                                            <div className="w-24 h-full bg-gradient-to-br from-[#009B4C] to-[#0d4223] flex items-center justify-center rounded-l-2xl rounded-r-none z-10 flex-shrink-0 shadow-md relative overflow-hidden">
                                                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>

                                                                {/* Font size nomor */}
                                                                <span className="text-4xl font-extrabold text-white font-sans relative z-10 drop-shadow-sm">
                                                                    0{index + 1}
                                                                </span>
                                                            </div>

                                                            {/* BAGIAN PUTIH (TEXT) */}
                                                            <div className="flex-1 h-full bg-white flex items-center px-8 rounded-r-2xl rounded-l-[30px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] z-20 -ml-5 border border-gray-100 group-hover:shadow-[0_10px_25px_rgba(0,155,76,0.1)] transition-all duration-300">
                                                                <p className="text-gray-600 font-medium text-sm leading-snug line-clamp-3 text-ellipsis">
                                                                    {item.content}
                                                                </p>
                                                            </div>
                                                        </>
                                                    )}

                                                    {/* === LOGIKA LAYOUT KANAN (GENAP: 02, 04) === */}
                                                    {isRightSide && (
                                                        <>
                                                            {/* BAGIAN PUTIH (TEXT) */}
                                                            <div className="flex-1 h-full bg-white flex items-center px-8 rounded-l-2xl rounded-r-[30px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] z-20 -mr-5 border border-gray-100 text-right md:text-left group-hover:shadow-[0_10px_25px_rgba(0,155,76,0.1)] transition-all duration-300">
                                                                <p className="text-gray-600 font-medium text-sm leading-snug line-clamp-3 text-ellipsis w-full">
                                                                    {item.content}
                                                                </p>
                                                            </div>

                                                            {/* BAGIAN HIJAU (NOMOR) */}
                                                            <div className="w-24 h-full bg-gradient-to-bl from-[#009B4C] to-[#0d4223] flex items-center justify-center rounded-r-2xl rounded-l-none z-10 flex-shrink-0 shadow-md relative overflow-hidden">
                                                                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
                                                                <span className="text-4xl font-extrabold text-white font-sans relative z-10 drop-shadow-sm">
                                                                    0{index + 1}
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}

                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-1 lg:col-span-2 text-center py-8">
                                        <span className="text-gray-400 italic text-sm">Data misi belum tersedia.</span>
                                    </div>
                                )}
                            </div>

                        </div>
                    </AnimateOnScroll>
                </section>
            </Suspense>



            {/* === SECTION DOKTER === */}
            <Suspense fallback={<div className="py-20 text-center">Loading Doctors...</div>}>
                <section id="dokter" className="py-16 md:py-16 bg-white relative overflow-hidden">

                    {/* Dekorasi Background Halus */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#ecfdf5] to-transparent pointer-events-none"></div>
                    <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#009B4C] opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>

                    <div className="container mx-auto px-4 max-w-6xl relative z-10">

                        {/* Header Section */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12 md:mb-16"
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1a2e35] uppercase tracking-wide">
                                Dokter Kami
                            </h2>
                            <div className="w-20 h-1.5 bg-[#009B4C] mx-auto mt-4 rounded-full"></div>
                        </motion.div>

                        {/* Grid Dokter */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 justify-items-center">
                            {doctors && doctors.length > 0 ? (
                                doctors.map((doctor, index) => (
                                    <motion.div
                                        key={doctor.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                        // whileHover DIHILANGKAN
                                        className="w-full max-w-[320px] sm:max-w-none" // Membatasi lebar di mobile agar tidak raksasa
                                    >
                                        {/* Efek hover pada bayangan DIHILANGKAN */}
                                        <div className="bg-white rounded-[30px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100 transition-all duration-300 h-full flex flex-col">

                                            {/* IMAGE WRAPPER (Rasio 1:1) */}
                                            <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
                                                <img
                                                    src={doctor.image_url || 'https://via.placeholder.com/483x483?text=No+Image'}
                                                    alt={doctor.name}
                                                    // Efek hover scale DIHILANGKAN
                                                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out"
                                                    loading="lazy"
                                                />
                                            </div>

                                            {/* CONTENT TEXT */}
                                            <div className="p-6 text-center relative flex-1 flex flex-col justify-center bg-white">
                                                {/* Efek hover warna teks DIHILANGKAN */}
                                                <h3 className="text-xl font-bold text-[#1a2e35] mb-1 line-clamp-1 transition-colors">
                                                    {doctor.name}
                                                </h3>

                                                {/* --- PERBAIKAN UNTUK MENAMPILKAN ARRAY SPECIALIZATION --- */}
                                                <p className="text-gray-500 font-medium text-sm uppercase tracking-wide mb-3 h-10 flex items-center justify-center">
                                                    {/* Cek jika specialization ada dan merupakan array */}
                                                    {doctor.specialization && Array.isArray(doctor.specialization) && doctor.specialization.length > 0
                                                        ? doctor.specialization.join(', ') // Gabungkan array dengan koma
                                                        : 'Dokter Umum' // Teks fallback
                                                    }
                                                </p>
                                                {/* ----------------------------------------------------------- */}

                                                {/* Garis kecil dekorasi (efek hover DIHILANGKAN) */}
                                                <div className="w-8 h-1 bg-gray-200 mx-auto rounded-full transition-all duration-300"></div>
                                            </div>

                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12">
                                    <div className="inline-block px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400 italic">
                                        Data dokter sedang disiapkan.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tombol Jadwal Dokter (dibiarkan dengan hover effect karena terlihat bagus) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-16 flex justify-center"
                        >
                            <Link
                                href={route('doctors.index')}
                                className="group inline-flex items-center gap-2
                                        px-4 py-2 text-sm
                                        sm:px-5 sm:py-2.5 sm:text-base
                                        md:px-6 md:py-3 md:text-lg
                                        rounded-full
                                        border-2 border-[#009B4C]
                                        text-[#009B4C] font-bold
                                        hover:bg-[#009B4C] hover:text-white
                                        transition-all duration-300
                                        shadow-sm"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                <span className="relative z-10">Lihat Jadwal Dokter</span>
                                <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </Suspense>


            <Suspense fallback={<FallbackComponent />}>
                <section id="layanan" className="py-16 md:py-16 relative bg-[#CBFDE2] overflow-hidden">
                    <div className="absolute top-0 left-0 w-0 h-0 border-l-[100px] md:border-l-[250px] border-l-[#32CD78] border-t-[60px] md:border-t-[160px] border-t-transparent border-b-[60px] md:border-b-[160px] border-b-transparent z-10 opacity-60 md:opacity-100"></div>
                    <div className="absolute top-8 md:top-20 left-4 md:left-8 w-0 h-0 border-l-[100px] md:border-l-[250px] border-l-[#00A54F] border-t-[60px] md:border-t-[160px] border-t-transparent border-b-[60px] md:border-b-[160px] border-b-transparent z-10 opacity-60 md:opacity-100"></div>
                    <div className="absolute -bottom-20 -right-20 md:-bottom-52 md:-right-24 w-60 h-60 md:w-[32rem] md:h-[32rem] rounded-full border-[15px] md:border-[30px] border-[#009B4C] opacity-40 md:opacity-100 z-0"></div>
                    <div className="container max-w-7xl mx-auto px-4 relative z-20">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-8 md:mb-12"
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1a2e35] uppercase tracking-wide">
                                LAYANAN
                            </h2>
                            <p className="mt-2 md:mt-4 text-gray-700 font-semibold text-base md:text-lg max-w-2xl mx-auto px-4">
                                Berisi informasi tentang semua layanan yang ada di Klinik Pratama Unimus.
                            </p>
                        </motion.div>
                        {displayServices.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <div className="flex flex-col gap-8 md:gap-10 lg:pt-24 order-1">
                                        {leftServices.map((service, index) => (
                                            <div key={service.id} className={index > 0 ? "hidden md:block" : "block"}>
                                                <ServiceCard service={service} index={index} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-8 md:gap-10 order-2">
                                        {centerServices.map((service, index) => (
                                            <div key={service.id} className={index > 0 ? "hidden md:block" : "block"}>
                                                <ServiceCard service={service} index={index} />
                                            </div>
                                        ))}

                                        <div className="mt-auto pt-4 md:pt-8 hidden md:flex justify-center pb-4 lg:pb-0">
                                            <Link
                                                href={route('services.index')}
                                                className="group inline-flex items-center gap-2
                                                        px-4 py-2 text-sm
                                                        sm:px-5 sm:py-2.5 sm:text-base
                                                        md:px-6 md:py-3 md:text-lg
                                                        rounded-full
                                                        border-2 border-[#009B4C]
                                                        text-[#009B4C] font-bold
                                                        hover:bg-[#009B4C] hover:text-white
                                                        transition-all duration-300
                                                        shadow-sm"
                                            >
                                                Lihat Semua Layanan
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-8 md:gap-10 lg:pt-24 order-3">
                                        {rightServices.map((service, index) => (
                                            <div key={service.id} className={index > 0 ? "hidden md:block" : "block"}>
                                                <ServiceCard service={service} index={index} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-8 flex md:hidden justify-center w-full">
                                    <Link
                                        href={route('services.index')}
                                        className="group inline-flex items-center gap-2
                                                        px-4 py-2 text-sm
                                                        sm:px-5 sm:py-2.5 sm:text-base
                                                        md:px-6 md:py-3 md:text-lg
                                                        rounded-full
                                                        border-2 border-[#009B4C]
                                                        text-[#009B4C] font-bold
                                                        hover:bg-[#009B4C] hover:text-white
                                                        transition-all duration-300
                                                        shadow-sm"
                                    >
                                        Lihat Semua Layanan
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-[40vh] text-center bg-white/50 rounded-[30px] border-2 border-dashed border-gray-300 p-8">
                                <h3 className="text-xl font-bold text-gray-700 mb-2">Layanan Belum Tersedia</h3>
                                <p className="text-gray-500 font-medium max-w-md">Silakan kembali lagi nanti.</p>
                            </div>
                        )}
                    </div>
                </section>
            </Suspense>

            {/* === SECTION FASILITAS (DIBATASI 3 & TENGAH OTOMATIS) === */}
            <Suspense fallback={<FallbackComponent />}>
                <section id="fasilitas" className="py-16 md:py-24 bg-white relative">

                    {/* === BAGIAN 1: FASILITAS PENUNJANG === */}
                    <div className="container mx-auto px-4 max-w-7xl mb-24 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-10 md:mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a2e35] uppercase tracking-wide mb-3">
                                FASILITAS PENUNJANG
                            </h2>
                            <p className="text-gray-600 font-medium text-sm md:text-base max-w-2xl mx-auto">
                                Bagian ini menampilkan sarana dan prasarana yang tersedia di klinik untuk menunjang pelayanan kepada pasien.
                            </p>
                        </motion.div>

                        {/* LOGIKA LAYOUT:
                            1. flex flex-wrap justify-center: Agar item otomatis ke tengah jika kurang dari 3.
                            2. slice(0, 3): Membatasi maksimal 3 item.
                            3. w-full md:w-[48%] lg:w-[31%]: Mengatur lebar card agar muat 2 di tablet, 3 di desktop.
                        */}
                        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                            {facilitiesPenunjang.length > 0 ? (
                                facilitiesPenunjang.slice(0, 3).map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="w-full md:w-[48%] lg:w-[31%] flex justify-center"
                                    >
                                        <div className="w-full">
                                            <FacilityCardNew facility={item} index={index} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <p className="text-gray-500 italic">Belum ada data Fasilitas Penunjang.</p>
                                </div>
                            )}
                        </div>

                        {/* Button Lihat Selengkapnya - Penunjang */}
                        {facilitiesPenunjang.length > 0 && (
                            <div className="mt-12 flex justify-center">
                                <Link
                                    href={route('facilities.support')}
                                    className="group inline-flex items-center gap-2
                                            px-4 py-2 text-sm
                                            sm:px-5 sm:py-2.5 sm:text-base
                                            md:px-6 md:py-3 md:text-lg
                                            rounded-full
                                            border-2 border-[#009B4C]
                                            text-[#009B4C] font-bold
                                            hover:bg-[#009B4C] hover:text-white
                                            transition-all duration-300
                                            shadow-sm"
                                >
                                    Lihat Selengkapnya
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* === BAGIAN 2: FASILITAS PERAWATAN === */}
                    <div className="container mx-auto px-4 max-w-7xl relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-10 md:mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a2e35] uppercase tracking-wide mb-3">
                                FASILITAS PERAWATAN
                            </h2>
                            <p className="text-gray-600 font-medium text-sm md:text-base max-w-2xl mx-auto">
                                Bagian ini menampilkan sarana dan prasarana yang tersedia di klinik untuk menunjang pelayanan kepada pasien.
                            </p>
                        </motion.div>

                        {/* LOGIKA LAYOUT SAMA SEPERTI DI ATAS */}
                        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                            {facilitiesPerawatan.length > 0 ? (
                                facilitiesPerawatan.slice(0, 3).map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="w-full md:w-[48%] lg:w-[31%] flex justify-center"
                                    >
                                        <div className="w-full">
                                            <FacilityCardNew facility={item} index={index} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <p className="text-gray-500 italic">Belum ada data Fasilitas Perawatan.</p>
                                </div>
                            )}
                        </div>

                        {/* Button Lihat Selengkapnya - Perawatan */}
                        {facilitiesPerawatan.length > 0 && (
                            <div className="mt-12 flex justify-center">
                                <Link
                                    href={route('facilities.care')}
                                    className="group inline-flex items-center gap-2
                                        px-4 py-2 text-sm
                                        sm:px-5 sm:py-2.5 sm:text-base
                                        md:px-6 md:py-3 md:text-lg
                                        rounded-full
                                        border-2 border-[#009B4C]
                                        text-[#009B4C] font-bold
                                        hover:bg-[#009B4C] hover:text-white
                                        transition-all duration-300
                                        shadow-sm"
                                >
                                    Lihat Selengkapnya
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </Suspense>

            <Suspense fallback={<FallbackComponent />}>
                <section id="artikel" className="py-16 md:py-24 bg-[#CBFDE2] relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 md:-top-40 md:-left-32 w-32 h-32 md:w-[500px] md:h-[500px] rounded-full border-[15px] md:border-[50px] border-[#00A54F] bg-transparent z-0 opacity-50 md:opacity-100"></div>
                    <div className="absolute bottom-20 md:bottom-40 right-0 w-0 h-0 border-r-[60px] md:border-r-[200px] border-r-[#32CD78] border-t-[40px] md:border-t-[130px] border-t-transparent border-b-[40px] md:border-b-[130px] border-b-transparent z-0"></div>
                    <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[80px] md:border-r-[250px] border-r-[#00A54F] border-t-[50px] md:border-t-[160px] border-t-transparent border-b-[50px] md:border-b-[160px] border-b-transparent z-10"></div>
                    <div className="container mx-auto px-4 relative z-10 max-w-7xl">
                        <motion.h2
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-extrabold text-center text-[#1a2e35] uppercase tracking-wide mb-10 md:mb-14"
                        >
                            ARTIKEL
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                            {articles && articles.length > 0 ? (
                                articles.map((article, idx) => (
                                    <motion.div
                                        key={article.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.15 }}
                                        className="flex flex-col h-full bg-white/70 md:bg-transparent rounded-xl md:rounded-none p-4 md:p-0"
                                    >
                                        <Link
                                            href={route('articles.show', article.slug)}
                                            className="group flex flex-col h-full cursor-pointer"
                                        >
                                            <div className="w-full aspect-[448/297] rounded-xl overflow-hidden shadow-sm mb-4 md:mb-6 relative bg-transparent">
                                                <img
                                                    src={article.image_path}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                                            </div>
                                            <div className="flex flex-col flex-grow">
                                                <h3 className="text-lg md:text-xl font-bold text-[#1a2e35] uppercase mb-2 md:mb-3 leading-tight group-hover:text-[#00A54F] transition-colors">
                                                    {article.title}
                                                </h3>
                                                <p className="text-[#1a2e35] text-sm md:text-base mb-3 md:mb-4 leading-relaxed line-clamp-3 whitespace-normal break-words">
                                                    {article.excerpt}
                                                </p>
                                                <p className="text-gray-500 text-xs md:text-sm mt-auto font-medium">
                                                    By {article.author}
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-1 md:col-span-3 text-center text-gray-500 py-10 italic">
                                    Belum ada artikel yang diterbitkan.
                                </div>
                            )}
                        </div>
                        <div className="mt-8 md:mt-12 text-center items-center">
                            <Link
                                href={route('articles.index')}
                                className="group inline-flex items-center gap-2
                                        px-4 py-2 text-sm
                                        sm:px-5 sm:py-2.5 sm:text-base
                                        md:px-6 md:py-3 md:text-lg
                                        rounded-full
                                        border-2 border-[#009B4C]
                                        text-[#009B4C] font-bold
                                        hover:bg-[#009B4C] hover:text-white
                                        transition-all duration-300
                                        shadow-sm"
                            >
                                Lihat Artikel Lainnya
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>
            </Suspense>

            <Suspense fallback={<FallbackComponent />}>
                <section id="ulasan-google" className="py-12 md:py-16 bg-white overflow-hidden">
                    <AnimateOnScroll>
                        <div className='text-center px-4'>
                            <motion.div variants={simpleItemVariants}>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">
                                    Ulasan Pasien Kami di Google
                                </h2>
                                <p className="text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto text-sm md:text-base">
                                    Kami bangga dapat memberikan pelayanan terbaik. Lihat apa kata mereka yang telah mempercayakan kesehatannya kepada kami.
                                </p>
                            </motion.div>
                            <motion.div variants={simpleItemVariants} className="flex justify-center">
                                <div className="w-full">
                                    <script src="https://elfsightcdn.com/platform.js" async></script>
                                    <div className="elfsight-app-95ae2db7-32f6-4ebc-b191-b5b0ebeda6dc" data-elfsight-app-lazy></div>
                                </div>
                            </motion.div>
                            <motion.div variants={simpleItemVariants} className="text-center mt-8 md:mt-12">
                                <a
                                    href="https://search.google.com/local/reviews?placeid=ChIJ1YCDqxT1cC4Rn7_7w29e3n8"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2
  px-4 py-2 text-sm
  sm:px-5 sm:py-2.5 sm:text-base
  md:px-6 md:py-3 md:text-lg
  rounded-full
  border-2 border-[#009B4C]
  text-[#009B4C] font-bold
  hover:bg-[#009B4C] hover:text-white
  transition-all duration-300
  shadow-sm"
                                >
                                    Lihat Semua Ulasan di Google
                                </a>
                            </motion.div>
                        </div>
                    </AnimateOnScroll>
                </section>
            </Suspense>

            <Suspense fallback={<FallbackComponent />}>
                <section id="sertifikat" className="relative py-16 md:py-16 bg-[#dfffe8] overflow-hidden">
                    <div className="absolute top-1/2 left-0 md:left-[100px] transform -translate-y-1/2 w-24 md:w-48 h-32 md:h-64 z-0 opacity-50 md:opacity-90">
                        <svg viewBox="0 0 100 100" className="relative z-10 w-full h-full text-[#00a65a] fill-current">
                            <path d="M0,0 L60,50 L0,100 Z" />
                        </svg>
                        <div className="absolute top-5 md:top-10 left-[-15px] md:left-[-30px] z-0 w-0 h-0 border-t-[40px] md:border-t-[80px] border-t-transparent border-l-[60px] md:border-l-[120px] border-l-[#00a65a] border-b-[40px] md:border-b-[80px] border-b-transparent opacity-30"></div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 md:-bottom-20 md:-right-20 w-40 h-40 md:w-80 md:h-80 rounded-full border-[15px] md:border-[30px] border-[#00a65a] opacity-60 md:opacity-100 z-0"></div>
                    <motion.div
                        className="container mx-auto px-4 relative z-10"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <motion.h2
                            variants={dynamicTitleVariants}
                            className="text-3xl md:text-4xl font-bold text-center text-[#1a2e35] mb-8 md:mb-12 tracking-wide uppercase drop-shadow-sm"
                        >
                            SERTIFIKAT
                        </motion.h2>
                        <motion.div
                            variants={dynamicContainerVariants}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 max-w-6xl mx-auto items-start"
                        >
                            {certificateData.map((cert, index) => {
                                const isLastItem = index === 2;
                                return (
                                    <motion.div
                                        key={cert.id}
                                        variants={simpleItemVariants}
                                        className={`bg-white p-2 rounded-sm shadow-xl overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-300 ${isLastItem ? 'md:col-span-2 md:w-2/3 md:mx-auto lg:w-[60%]' : ''}`}
                                        onClick={() => setSelectedCertificate(cert)}
                                    >
                                        <div className="border border-gray-100 h-full w-full relative">
                                            <img
                                                src={cert.imagePath}
                                                alt={cert.alt}
                                                className="w-full h-auto object-contain transform transition-transform duration-500 group-hover:scale-[1.02]"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300"></div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </motion.div>
                </section>
            </Suspense>

            <Suspense fallback={<FallbackComponent />}>
                <section id="kerja-sama" className="py-12 bg-white overflow-hidden pb-20 mb-10 md:pb-32">
                    <AnimateOnScroll>
                        <motion.h2
                            variants={simpleItemVariants}
                            className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12 tracking-wider"
                        >
                            KERJA SAMA
                        </motion.h2>
                        <motion.div
                            variants={simpleItemVariants}
                            className="flex flex-wrap items-center justify-center gap-6 md:gap-x-16 gap-y-8 text-gray-500 px-4"
                        >
                            <img
                                src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/kerja-sama/logo_bpjs.png"
                                alt="Logo BPJS Kesehatan"
                                className="h-8 md:h-12 object-contain transition-all duration-300"
                                loading="lazy"
                            />
                            <img
                                src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/kerja-sama/logo_cito.png"
                                alt="Logo Laboratorium Klinik CITO"
                                className="h-10 md:h-14 object-contain transition-all duration-300"
                                loading="lazy"
                            />
                            <img
                                src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/kerja-sama/LOGO%20BARIKLANA%20AQIQAH.png"
                                alt="Logo Bariklana Catering & Aqiqah"
                                className="h-12 md:h-20 object-contain transition-all duration-300"
                                loading="lazy"
                            />
                            <img
                                src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/kerja-sama/logo_bni.png"
                                alt="Logo BNI Life"
                                className="h-8 md:h-12 object-contain transition-all duration-300"
                                loading="lazy"
                            />
                            <img
                                src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/kerja-sama/logo_lapklin.png"
                                alt="Logo LAPKLIN"
                                className="h-12 md:h-20 object-contain transition-all duration-300"
                                loading="lazy"
                            />
                        </motion.div>
                    </AnimateOnScroll>
                </section>
            </Suspense>

            <AnimatePresence>
                {selectedCertificate && (
                    <CertificateModal
                        src={selectedCertificate.imagePath}
                        alt={selectedCertificate.alt}
                        onClose={() => setSelectedCertificate(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

LandingPage.layout = page => <AppLayout children={page} />;

export default LandingPage;