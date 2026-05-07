import React from "react";
import { Link, usePage } from "@inertiajs/react";

/* ================= STYLED ICONS ================= */

// Helper: Wrapper Icon dengan props 'shape' untuk mengatur bentuk (bulat/kotak)
const IconWrapper = ({ children, className = "", shape = "rounded-full" }) => (
  <div className={`
    w-10 h-10 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center 
    ${shape} /* Class bentuk dinamis */
    bg-white/10 backdrop-blur-md text-white shadow-sm border border-white/20
    transition-all duration-300 ease-in-out
    group-hover:bg-white group-hover:text-[#009B4C] group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]
    ${className}
  `}>
    {children}
  </div>
);

const MapPinIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TiktokIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.58-1.09v10.92c-.06 3.91-3.66 6.89-7.58 6.27-2.95-.47-5.12-3.03-5.09-6.02.02-3.32 2.72-6.02 6.04-6.02.32 0 .64.03.95.09v4.18c-.14-.04-.28-.06-.43-.06-1.07.03-1.92.93-1.89 2 .03 1.05.9 1.87 1.95 1.84 1.05-.03 1.9-.9 1.9-1.95V0h.03z"/>
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

/* ================= LOGO ================= */
const LogoUnimus = () => (
  <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
    <div className="p-1 w-[3.5rem] h-[3.5rem] md:w-[4rem] md:h-[4rem] flex-shrink-0 flex items-center justify-center shadow-sm order-1 md:order-none">
      <img
        src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/inventaris-fotos/aset/logo_klinik.png"
        alt="Logo Unimus"
        className="w-full h-full object-contain rounded-full ring-2 ring-white"
      />
    </div>
    <div className="leading-none text-white font-sans text-center md:text-left order-2 md:order-none">
      <p className="text-xl md:text-2xl font-extrabold tracking-wide uppercase">KLINIK PRATAMA</p>
      <p className="text-xl md:text-2xl font-extrabold tracking-wide uppercase">UNIMUS</p>
    </div>
  </div>
);

/* ================= FOOTER ================= */
export default function Footer() {
  const { settings } = usePage().props;

  const formatSocialMedia = (socialsData) => {
    let socialsArray;
    if (!socialsData || typeof socialsData !== 'object') {
        return {};
    }
    if (Array.isArray(socialsData)) {
        socialsArray = socialsData;
    } else {
        socialsArray = Object.values(socialsData);
    }
    return socialsArray.reduce((acc, item) => {
      if (item && item.platform) {
        acc[item.platform.toLowerCase()] = item.link;
      }
      return acc;
    }, {});
  };

  const social = formatSocialMedia(settings?.social_media);

  const contact = {
    wa_reg: settings?.whatsapp_registration || "62 895-6168-33383",
    wa_info: settings?.whatsapp_information || "62 896-7587-3994",
    email: settings?.email || "klinikpratamarawatinap@unimus.ac.id",
    address: settings?.address || "Jl. Petek Kp. Gayam RT. 02 RW. 06, Kel. Dadapsari, Kec. Semarang Utara., Semarang, Indonesia",
    gmaps: settings?.google_maps_link || "#",
  };

  const cleanPhone = (num) => num ? num.replace(/\D/g,'') : '';

  return (
    <div className="font-sans relative bg-gray-50">

      {/* ================= CTA FLOAT ================= */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[90%] md:w-[94%] max-w-5xl">
        <div className="bg-[#D1FBE9] rounded-2xl px-5 py-6 md:px-10 md:py-6 flex flex-col md:flex-row items-center justify-between shadow-lg text-center md:text-left">
          
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-4 md:mb-0">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-black leading-tight">
              Melayani <span className="text-[#009B4C]">Ummat</span> <br className="block md:hidden"/> Menebar{" "}
              <span className="text-[#009B4C]">Manfaat</span>
            </h2>
            <span className="hidden md:block w-14 h-[3px] bg-black rounded-full flex-shrink-0" />
          </div>

          <a
            href={`https://wa.me/${cleanPhone(contact.wa_reg)}`}
            target="_blank"
            rel="noreferrer"
            className="w-full md:w-auto bg-[#009B4C] hover:bg-[#0b7c3c] text-white px-6 py-3 rounded-full font-bold text-lg md:text-xl transition shadow-md capitalize whitespace-nowrap flex justify-center"
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* ================= MAIN FOOTER ================= */}
      <footer className="relative pt-36 md:pt-28 pb-8 text-white overflow-hidden">

        {/* Background Layers */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/tampakdepan.webp')" }}
        />
        <div className="absolute inset-0 bg-[#009B4C]/90 z-0" />

        <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-[80rem]">

          {/* === BAGIAN ATAS: LOGO & LAYANAN === */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] gap-8 md:gap-10 mb-8 items-start">
            
            {/* Kiri: Brand & Deskripsi */}
            <div className="space-y-4 md:space-y-5 text-center md:text-left">
              <div className="flex justify-center md:justify-start">
                  <LogoUnimus />
              </div>
              <p className="text-sm md:text-[0.93rem] font-medium leading-relaxed opacity-95 max-w-lg mx-auto md:mx-0 shadow-black/10 drop-shadow-md">
                Menyediakan layanan kesehatan terpercaya dengan tim medis
                profesional dan fasilitas modern untuk Anda dan keluarga.
              </p>
            </div>

            {/* Kanan: Layanan Unggulan */}
            {/* UPDATE: 'hidden md:block' ditambahkan di bawah ini agar hilang di mobile */}
            <div className="hidden md:block pt-0 lg:pt-2">
              <h3 className="text-lg font-bold mb-4 drop-shadow-md text-center md:text-left">
                  Layanan Unggulan
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-2 text-sm md:text-[0.9rem] font-bold">
                 <div className="text-center md:text-left">BPJS</div>
                 <div className="text-center md:text-left">MCU</div>
                 <div className="text-center md:text-left">Khitan</div>
                 <div className="text-center md:text-left">Prolanis</div>
                 <div className="text-center md:text-left">Persalinan</div>
                 <div className="text-center md:text-left">Rawat Inap</div>
                 <div className="col-span-2 md:col-span-3 text-center md:text-left">Pemeriksaan Kandungan ANC dan USG</div>
              </div>
              <div className="text-center md:text-left">
                <Link href="/layanan" className="inline-flex items-center justify-center md:justify-start gap-2 mt-5 text-[0.9rem] font-bold hover:underline">
                  Lihat Semua Layanan <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* KONTAK: MODE DESKTOP (GRID + TEKS) */}
          {/* ============================================================ */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-white/20">
             
             {/* Kolom 1: Alamat */}
             <div className="space-y-4">
               <a href={contact.gmaps} target="_blank" rel="noreferrer" className="group flex items-start gap-3 hover:opacity-100 opacity-90 transition">
                  <IconWrapper shape="rounded-xl"><MapPinIcon /></IconWrapper>
                  <span className="text-[0.8rem] font-bold leading-snug pt-2">
                    {contact.address}
                  </span>
               </a>
               <a href={`mailto:${contact.email}`} className="group flex items-center gap-3 hover:opacity-100 opacity-90 transition">
                  <IconWrapper><EnvelopeIcon /></IconWrapper>
                  <span className="text-[0.8rem] font-bold leading-tight break-all">
                    {contact.email}
                  </span>
               </a>
            </div>

            {/* Kolom 2: Youtube & FB */}
            <div className="space-y-4">
                <a href={social?.youtube || "#"} target="_blank" rel="noreferrer" className="group flex items-center gap-3">
                   <IconWrapper><YoutubeIcon /></IconWrapper>
                   <span className="font-bold text-[0.8rem] leading-tight">
                     klinikpratama<br/>unimus_official
                   </span>
                </a>
                <a href={social?.facebook || "#"} target="_blank" rel="noreferrer" className="group flex items-center gap-3">
                   <IconWrapper><FacebookIcon /></IconWrapper>
                   <span className="font-bold text-[0.8rem] leading-tight">
                     Klinik Pratama<br/>Unimus
                   </span>
                </a>
            </div>

            {/* Kolom 3: WhatsApp */}
            <div className="space-y-4">
                <a href={`https://wa.me/${cleanPhone(contact.wa_reg)}`} target="_blank" rel="noreferrer" className="group flex items-center gap-3" title="Pendaftaran">
                   <IconWrapper><WhatsAppIcon /></IconWrapper>
                   <div className="leading-none">
                     <p className="font-bold text-[0.85rem] mb-1">+{contact.wa_reg}</p>
                     <p className="text-[0.7rem] font-medium opacity-90">(Pendaftaran)</p>
                   </div>
                </a>
                <a href={`https://wa.me/${cleanPhone(contact.wa_info)}`} target="_blank" rel="noreferrer" className="group flex items-center gap-3" title="Informasi">
                   <IconWrapper><WhatsAppIcon /></IconWrapper>
                   <div className="leading-none">
                     <p className="font-bold text-[0.85rem] mb-1">+{contact.wa_info}</p>
                     <p className="text-[0.7rem] font-medium opacity-90">(Informasi)</p>
                   </div>
                </a>
            </div>

            {/* Kolom 4: IG & Tiktok */}
            <div className="space-y-4">
                <a href={social?.instagram || "#"} target="_blank" rel="noreferrer" className="group flex items-center gap-3">
                   <IconWrapper><InstagramIcon /></IconWrapper>
                   <span className="font-bold text-[0.8rem] leading-tight">
                     klinikpratama<br/>unimus_official
                   </span>
                </a>
                <a href={social?.tiktok || "#"} target="_blank" rel="noreferrer" className="group flex items-center gap-3">
                   <IconWrapper><TiktokIcon /></IconWrapper>
                   <span className="font-bold text-[0.8rem]">
                     Klinik Unimus
                   </span>
                </a>
            </div>
          </div>


          {/* ============================================================ */}
          {/* KONTAK: MODE MOBILE YANG DIPERBAIKI */}
          {/* ============================================================ */}
          <div className="md:hidden mt-6 pt-6 border-t border-white/20">
            
            {/* Kontak Utama */}
            <div className="mb-6 space-y-4">
              {/* Alamat */}
              <a href={contact.gmaps} target="_blank" rel="noreferrer" className="flex items-start gap-3 group">
                <IconWrapper shape="rounded-xl"><MapPinIcon /></IconWrapper>
                <div className="flex-1">
                  <p className="text-xs font-bold mb-1">Alamat</p>
                  <p className="text-xs font-medium opacity-90 leading-tight">{contact.address}</p>
                </div>
              </a>
              
              {/* Email */}
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 group">
                <IconWrapper><EnvelopeIcon /></IconWrapper>
                <div className="flex-1">
                  <p className="text-xs font-bold mb-1">Email</p>
                  <p className="text-xs font-medium opacity-90 break-all">{contact.email}</p>
                </div>
              </a>
            </div>

            {/* WhatsApp Section */}
            <div className="mb-6">
              <h4 className="text-sm font-bold mb-3 text-center">Hubungi Kami</h4>
              <div className="flex flex-col gap-3">
                <a href={`https://wa.me/${cleanPhone(contact.wa_reg)}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 group bg-white/10 p-3 rounded-xl">
                  <IconWrapper><WhatsAppIcon /></IconWrapper>
                  <div className="flex-1">
                    <p className="text-sm font-bold">+{contact.wa_reg}</p>
                    <p className="text-xs font-medium opacity-90">Pendaftaran</p>
                  </div>
                </a>
                
                <a href={`https://wa.me/${cleanPhone(contact.wa_info)}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 group bg-white/10 p-3 rounded-xl">
                  <IconWrapper><WhatsAppIcon /></IconWrapper>
                  <div className="flex-1">
                    <p className="text-sm font-bold">+{contact.wa_info}</p>
                    <p className="text-xs font-medium opacity-90">Informasi</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="mb-4">
              <h4 className="text-sm font-bold mb-3 text-center">Ikuti Kami</h4>
              <div className="grid grid-cols-4 gap-3">
                <a href={social?.instagram || "#"} target="_blank" rel="noreferrer" className="flex flex-col items-center group">
                  <IconWrapper><InstagramIcon /></IconWrapper>
                  <span className="text-xs font-medium mt-2 text-center">Instagram</span>
                </a>
                
                <a href={social?.tiktok || "#"} target="_blank" rel="noreferrer" className="flex flex-col items-center group">
                  <IconWrapper><TiktokIcon /></IconWrapper>
                  <span className="text-xs font-medium mt-2 text-center">TikTok</span>
                </a>
                
                <a href={social?.youtube || "#"} target="_blank" rel="noreferrer" className="flex flex-col items-center group">
                  <IconWrapper><YoutubeIcon /></IconWrapper>
                  <span className="text-xs font-medium mt-2 text-center">YouTube</span>
                </a>
                
                <a href={social?.facebook || "#"} target="_blank" rel="noreferrer" className="flex flex-col items-center group">
                  <IconWrapper><FacebookIcon /></IconWrapper>
                  <span className="text-xs font-medium mt-2 text-center">Facebook</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* === COPYRIGHT === */}
        <div className="relative z-10 border-t border-white/30 mt-8 pt-4 text-center text-xs font-medium opacity-90 px-4">
          © {new Date().getFullYear()} Klinik Pratama Unimus. All rights reserved.
        </div>
      </footer>
    </div>
  );
}