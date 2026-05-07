import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

// --- Komponen Ikon SVG Statis ---
const PinIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);
const WhatsappIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
);
const EmailIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
);

export default function ContactPage({ setting }) {
    
    // Data Fallback
    const fallbackData = {
        address: "Jl. Petek Kp. Gayam RT. 02 RW. 06, Kel. Dadapsari, Kec. Semarang Utara., Semarang, Indonesia",
        whatsapp_registration: "+62 895-6168-33383",
        whatsapp_information: "+62 896-7587-3994",
        email: "klinikpratamarawatinap@unimus.ac.id",
        google_maps_link: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.3168233345465!2d110.42171817499695!3d-6.9719119930287235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70f3531649364b%3A0xf5980a3746a67137!2sKlinik%20Pratama%20UNIMUS!5e0!3m2!1sen!2sid!4v1709623694657!5m2!1sen!2sid",
        social_media: [] 
    };

    const safeSetting = setting || {};

    const displayData = {
        address: safeSetting.address || fallbackData.address,
        waReg: safeSetting.whatsapp_registration || fallbackData.whatsapp_registration,
        waInfo: safeSetting.whatsapp_information || fallbackData.whatsapp_information,
        email: safeSetting.email || fallbackData.email,
        mapsLink: safeSetting.google_maps_link || fallbackData.google_maps_link,
        socials: Array.isArray(safeSetting.social_media) 
            ? safeSetting.social_media 
            : (safeSetting.social_media ? Object.values(safeSetting.social_media) : [])
    };

    // Helper function untuk format link WhatsApp
    const formatWaLink = (number) => {
        if (!number) return '#';
        // Hapus karakter non-digit
        const cleanNumber = number.replace(/\D/g, '');
        // Ganti 0 di depan dengan 62 (Kode Negara Indonesia)
        if (cleanNumber.startsWith('0')) {
            return `https://wa.me/62${cleanNumber.slice(1)}`;
        }
        return `https://wa.me/${cleanNumber}`;
    };

    // Helper untuk link maps (Search query jika link embed, atau direct link)
    // Sederhananya, kita pakai link yang ada di DB.
    // Jika link DB adalah embed, membukanya di tab baru tetap akan menampilkan peta.
    const getMapRedirect = () => displayData.mapsLink;

    return (
        <>
            <Head title="Kontak - Klinik Pratama UNIMUS" />

            {/* Banner Header - Responsive Mobile */}
            <div className="relative h-48 md:h-64 bg-gray-900 flex flex-col justify-center items-center text-center overflow-hidden">
                <img 
                    src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/tampakdepan.webp" 
                    alt="Background" 
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-40 blur-[2px]" 
                />
                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-widest uppercase mb-2 px-2">KONTAK</h1>
                    <p className="text-gray-200 text-base md:text-base font-medium px-4">
                        Hubungi Klinik Pratama Unimus
                    </p>
                </div>
            </div>

            <div className="bg-white py-12 md:py-16">
                <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-7xl mb-16">
                    
                    {/* === BAGIAN 1: INFO ATAS (ALAMAT & FOTO) === */}
                    <div className="flex flex-col-reverse lg:flex-row items-stretch justify-between gap-8 md:gap-10 mb-10">
                        
                        {/* 1A. KOLOM KIRI: Teks & Kontak */}
                        <div className="w-full lg:w-7/12 flex flex-col justify-center">
                            
                            {/* Icon Lokasi Besar (Dapat Diklik) */}
                            <div className="mb-6">
                                <a 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="group inline-block"
                                    title="Lihat di Google Maps"
                                >
                                    <div className="inline-flex items-center justify-center bg-[#00b050] group-hover:bg-[#00994d] w-14 h-14 md:w-16 md:h-16 rounded-t-full rounded-b-2xl shadow-lg transition-all duration-300 group-hover:-translate-y-2 relative overflow-hidden">
                                        <PinIcon className="w-6 h-6 md:w-7 md:h-7 text-white relative z-10" />
                                        {/* Shine Effect */}
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                    </div>
                                </a>
                            </div>

                            {/* Teks Alamat - Mobile Responsive */}
                            <h2 className="text-lg md:text-xl lg:text-3xl font-bold text-gray-800 leading-relaxed md:leading-snug mb-8 md:mb-12 px-2 md:px-0">
                                {displayData.address}
                            </h2>

                            {/* 3 Kolom Kontak - Mobile Stacked, Desktop Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
                                
                                {/* Item 1: WA Pendaftaran */}
                                <div className="flex flex-col items-center text-center bg-gray-50 md:bg-transparent rounded-2xl md:rounded-none p-5 md:p-0">
                                    <a 
                                        href={formatWaLink(displayData.waReg)} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="group inline-block mb-3"
                                        title="Chat WhatsApp Pendaftaran"
                                    >
                                        <div className="bg-[#00b050] group-hover:bg-[#00994d] w-14 h-14 md:w-12 md:h-12 rounded-t-full rounded-b-xl shadow-md flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 relative overflow-hidden">
                                            <WhatsappIcon className="w-7 h-7 md:w-6 md:h-6 text-white relative z-10" />
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                        </div>
                                    </a>
                                    <p className="font-extrabold text-gray-900 text-base md:text-sm break-all md:break-normal">{displayData.waReg}</p>
                                    <p className="text-xs font-bold text-gray-500 mt-1">(Pendaftaran)</p>
                                </div>

                                {/* Item 2: Email */}
                                <div className="flex flex-col items-center text-center bg-gray-50 md:bg-transparent rounded-2xl md:rounded-none p-5 md:p-0">
                                    <a 
                                        href={`mailto:${displayData.email}`}
                                        className="group inline-block mb-3"
                                        title="Kirim Email"
                                    >
                                        <div className="bg-[#00b050] group-hover:bg-[#00994d] w-14 h-14 md:w-12 md:h-12 rounded-t-full rounded-b-xl shadow-md flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 relative overflow-hidden">
                                            <EmailIcon className="w-7 h-7 md:w-6 md:h-6 text-white relative z-10" />
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                        </div>
                                    </a>
                                    <p className="font-extrabold text-gray-900 text-base md:text-sm break-all px-2 md:px-0">
                                        {displayData.email}
                                    </p>
                                </div>

                                {/* Item 3: WA Informasi */}
                                <div className="flex flex-col items-center text-center bg-gray-50 md:bg-transparent rounded-2xl md:rounded-none p-5 md:p-0">
                                    <a 
                                        href={formatWaLink(displayData.waInfo)} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="group inline-block mb-3"
                                        title="Chat WhatsApp Informasi"
                                    >
                                        <div className="bg-[#00b050] group-hover:bg-[#00994d] w-14 h-14 md:w-12 md:h-12 rounded-t-full rounded-b-xl shadow-md flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 relative overflow-hidden">
                                            <WhatsappIcon className="w-7 h-7 md:w-6 md:h-6 text-white relative z-10" />
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                        </div>
                                    </a>
                                    <p className="font-extrabold text-gray-900 text-base md:text-sm break-all md:break-normal">{displayData.waInfo}</p>
                                    <p className="text-xs font-bold text-gray-500 mt-1">(Informasi)</p>
                                </div>

                            </div>
                            
                            {/* Garis Pembatas - Responsive Spacing */}
                            <div className="mt-10 md:mt-14 border-b-2 border-gray-300 md:border-gray-800 w-full opacity-90"></div>
                        </div>

                        {/* 1B. KOLOM KANAN: Gambar Gedung - Responsive */}
                        <div className="w-full lg:w-5/12 flex justify-center lg:justify-end items-start mb-8 md:mb-0">
                             <div className="relative w-full max-w-xs md:max-w-sm aspect-[4/5] lg:mt-[-20px]"> 
                                <div className="w-full h-full rounded-t-full rounded-b-3xl overflow-hidden shadow-lg md:shadow-xl bg-gray-100">
                                    <img 
                                        src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/tampakdepan.webp" 
                                        alt="Gedung Klinik Pratama Unimus" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* === BAGIAN 2: SOSIAL MEDIA (ARCH SHAPE ICONS) === */}
                    <div className="mb-10 md:mb-12">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 px-2 md:px-0">Sosial Media</h3>
                        
                        <div className="flex flex-wrap gap-4 md:gap-5 justify-center md:justify-start px-2 md:px-0">
                            {displayData.socials && displayData.socials.length > 0 ? (
                                displayData.socials.map((item, index) => (
                                    <a 
                                        key={index} 
                                        href={item.link || '#'} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        title={item.platform}
                                        className="group transform transition-transform active:scale-95"
                                    >
                                        <div className="w-16 h-16 md:w-16 md:h-16 bg-[#00b050] group-hover:bg-[#00994d] transition-all duration-300 rounded-t-full rounded-b-2xl shadow-lg md:group-hover:-translate-y-2 flex items-center justify-center relative overflow-hidden">
                                            {item.icon ? (
                                                <img 
                                                    src={item.icon} 
                                                    alt={item.platform} 
                                                    className="w-8 h-8 md:w-7 md:h-7 object-contain brightness-0 invert z-10" 
                                                />
                                            ) : (
                                                <span className="text-white font-bold text-xs md:text-xs z-10">Link</span>
                                            )}
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                        </div>
                                    </a>
                                ))
                            ) : (
                                <div className="w-full text-center py-4">
                                    <span className="text-gray-500 italic text-base md:text-base">Belum ada sosial media.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* === BAGIAN 3: LOKASI (MAPS) === */}
                    <div className="w-full">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 px-2 md:px-0">Lokasi</h3>
                        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 h-[300px] md:h-[350px] w-full bg-gray-100 relative">
                            <iframe 
                                src={displayData.mapsLink}
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                title="Google Maps Klinik Unimus"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0 w-full h-full"
                            ></iframe>
                        </div>
                        {/* Tombol Buka Maps untuk Mobile */}
                        <div className="mt-4 md:mt-6 text-center">
                            <a 
                                href={displayData.mapsLink.replace('embed', 'view')}
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center justify-center md:hidden w-full bg-[#00b050] hover:bg-[#00994d] text-white py-3 rounded-lg font-semibold text-sm transition-colors duration-300 shadow-md active:scale-95"
                            >
                                <PinIcon className="w-5 h-5 mr-2" />
                                Buka di Google Maps
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

ContactPage.layout = page => <AppLayout children={page} />;