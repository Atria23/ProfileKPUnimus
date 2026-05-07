import React, { useState, useEffect, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, AnimatePresence } from 'framer-motion';

// --- IKON-IKON SVG ---
const HeadsetSupportIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    </svg>
);
const PhoneSolidIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
    </svg>
);
const ChevronDownIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

// Ikon Menu
const MenuIcons = {
    Home: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>,
    Service: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>,
    Doctor: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>,
    Article: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>,
    Contact: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>,
    Facility: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
    Announcement: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>,
    Information: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>,
    Career: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.964 2.505-2.312 2.733-1.35.228-2.694.028-3.623-.65-1.025-.755-1.218-2.016-.544-2.966.303-.544.75-1.025 1.288-1.442a4.5 4.5 0 0 0-2.432-2.432c-.418.538-.9 1.002-1.442 1.288-.95.674-2.21.51-2.966-.544-.678-.929-.878-2.273-.65-3.623.228-1.348 1.42-2.312 2.733-2.312h4.075m3.25 0V6.15m0 8.075a3.375 3.375 0 0 1-3.375 3.375H9.375a3.375 3.375 0 0 1-3.375-3.375V6.15a3.375 3.375 0 0 1 3.375-3.375h5.25a3.375 3.375 0 0 1 3.375 3.375Z" /></svg>,
    Bpjs: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-1.029.651c-1.457.789-2.995 1.258-4.575 1.341a.237.237 0 0 1-.24-.236V16.5a2.25 2.25 0 0 1 2.25-2.25h.48a4.5 4.5 0 0 0 2.114-1.789Z" /></svg>,
};

// Helper: Parse Href
function parseHrefToParts(href) {
    if (!href) return { pathname: '/', hash: '' };
    try {
        const base = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'http://localhost';
        const u = new URL(href, base);
        let pathname = u.pathname.replace(/\/+$/, '') || '/';
        const hash = u.hash || '';
        return { pathname, hash };
    } catch (e) {
        const [pathPart, hashPart] = String(href).split('#');
        const pathname = (pathPart || '/').replace(/\/+$/, '') || '/';
        const hash = hashPart ? `#${hashPart}` : '';
        return { pathname, hash };
    }
}

// Komponen NavLink
const NavLink = ({ href, children, isMobile = false, isActive = false, onClick, icon: IconComponent, hasDropdown = false }) => {
    const desktopBase = "relative font-semibold text-sm tracking-wide uppercase transition-all duration-300 py-4 px-1 group cursor-pointer flex items-center gap-1";
    const desktopActive = "text-[#00994d]";
    const desktopInactive = "text-gray-800 hover:text-[#00994d]";

    const mobileBase = "text-lg font-medium flex items-center gap-4 w-full px-6 py-2";
    const mobileActive = "text-[#00994d] bg-gray-50 border-r-4 border-[#00994d]";
    const mobileInactive = "text-gray-700 hover:text-[#00994d] hover:bg-gray-50";

    if (isMobile) {
        // --- PERBAIKAN ---
        // Jika ini adalah tombol dropdown di mobile, gunakan <div>.
        if (hasDropdown) {
            return (
                <div onClick={onClick} className={`${mobileBase} ${isActive ? mobileActive : mobileInactive} cursor-pointer`}>
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                    <span className="flex-1 text-left">{children}</span>
                    <ChevronDownIcon className="w-4 h-4" />
                </div>
            );
        }
        // Jika ini adalah link biasa di mobile, gunakan <Link> dari Inertia.
        return (
            <Link href={href} onClick={onClick} className={`${mobileBase} ${isActive ? mobileActive : mobileInactive}`}>
                {IconComponent && <IconComponent className="w-5 h-5" />}
                <span className="flex-1 text-left">{children}</span>
            </Link>
        );
    }
    
    if (hasDropdown) {
        return (
            <div className={`${desktopBase} ${isActive ? desktopActive : desktopInactive}`}>
                {children}
                <ChevronDownIcon className="w-4 h-4 mb-0.5" />
                {isActive && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#00994d] rounded-t-full"></span>}
                <span className="absolute bottom-0 left-1/2 w-0 h-1 bg-[#00994d] rounded-t-full transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </div>
        );
    }
    
    return (
        <Link href={href} className={`${desktopBase} ${isActive ? desktopActive : desktopInactive}`} onClick={onClick}>
            {children}
            {isActive && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#00994d] rounded-t-full"></span>}
            <span className="absolute bottom-0 left-1/2 w-0 h-1 bg-[#00994d] rounded-t-full transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
        </Link>
    );
};

export default function Navbar() {
    const { url } = usePage();
    const { settings } = usePage().props;
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);

    const formatPhoneNumber = (number) => {
        if (!number) return '6289675873994';
        let cleanNumber = String(number).replace(/\D/g, '');
        if (cleanNumber.startsWith('0')) {
            cleanNumber = '62' + cleanNumber.slice(1);
        }
        return cleanNumber;
    };

    const contactData = {
        email: settings.email || 'klinikpratamarawatinap@unimus.ac.id',
        whatsappInfo: formatPhoneNumber(settings.whatsapp_information),
        whatsappReg: formatPhoneNumber(settings.whatsapp_registration)
    };

    const navItems = useMemo(() => [
        { href: route('home') + '#tentang', label: 'TENTANG KAMI', icon: MenuIcons.Home },
        { href: route('services.index'), label: 'LAYANAN', icon: MenuIcons.Service },
        { href: route('doctors.index'), label: 'JADWAL DOKTER', icon: MenuIcons.Doctor },
        { 
            label: 'FASILITAS', 
            icon: MenuIcons.Facility,
            href: '#',
            children: [
                { href: route('facilities.care'), label: 'Fasilitas Perawatan', icon: null },
                { href: route('facilities.support'), label: 'Fasilitas Penunjang', icon: null }
            ]
        },
        {
            label: 'INFORMASI',
            icon: MenuIcons.Information,
            href: '#',
            children: [
                { href: route('articles.index'), label: 'Artikel', icon: MenuIcons.Article },
                { href: route('announcements.index'), label: 'Pengumuman', icon: MenuIcons.Announcement },
                { href: route('jobs.index'), label: 'Karir', icon: MenuIcons.Career },
                { href: route('bpjs'), label: 'BPJS', icon: MenuIcons.Bpjs } 
            ]
        },
        { href: route('contact'), label: 'KONTAK', icon: MenuIcons.Contact },
    ], []);

    const isItemActive = (item, currentUrl) => {
        const currentParts = parseHrefToParts(currentUrl);

        if (item.children) {
            return item.children.some(child => {
                const childParts = parseHrefToParts(child.href);
                return childParts.pathname === currentParts.pathname;
            });
        }

        const itemParts = parseHrefToParts(item.href);

        if (itemParts.pathname === '/' && currentParts.pathname === '/' && itemParts.hash && currentParts.hash && itemParts.hash === currentParts.hash) {
            return true;
        }
        
        if (itemParts.pathname !== '/' && currentParts.pathname.startsWith(itemParts.pathname)) {
            return true;
        }

        return false;
    };

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    // --- PERBAIKAN ---
    // Fungsi ini sekarang hanya untuk menutup menu.
    const handleLinkClick = () => {
        setMobileMenuOpen(false);
        setExpandedMobileMenu(null);
    };

    const toggleMobileSubmenu = (label) => {
        setExpandedMobileMenu(prev => (prev === label ? null : label));
    };

    return (
        <>
            {/* === TOP BAR === */}
            <div className="bg-white border-b md:border-none shadow-sm md:shadow-none relative z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 md:pb-4 flex justify-between items-center relative">
                    <div className="flex items-center gap-3">
                        <Link href={route('home')} onClick={handleLinkClick}>
                            <img 
                                src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/inventaris-fotos/aset/logo_klinik.png" 
                                alt="Logo Klinik" 
                                className="h-12 w-auto md:h-16"
                            />
                        </Link>
                        <div className="flex flex-col">
                            <span className="text-[#00994d] font-extrabold text-lg md:text-2xl leading-tight">KLINIK PRATAMA</span>
                            <span className="text-[#00994d] font-extrabold text-lg md:text-2xl leading-tight">UNIMUS</span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-8 h-full">
                        <div className="flex items-center gap-3">
                            <HeadsetSupportIcon className="w-8 h-8 text-black mt-1" />
                            <div className="flex flex-col">
                                <span className="text-black font-semibold text-sm">ONLINE SUPPORT</span>
                                <a href={`mailto:${contactData.email}`} className="text-blue-500 text-sm hover:underline">{contactData.email}</a>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <PhoneSolidIcon className="w-6 h-6 text-black mt-1" />
                            <div className="flex flex-col">
                                <span className="text-black font-semibold text-sm">CONTACT US</span>
                                <a href={`https://wa.me/${contactData.whatsappInfo}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline">
                                    {settings.whatsapp_information || contactData.whatsappInfo}
                                </a>
                            </div>
                        </div>
                        <Link href={route('registration.index')} className="bg-[#00b050] hover:bg-[#00994d] text-white font-bold py-5 px-8 rounded-b-2xl rounded-t-none shadow-md transition-colors uppercase tracking-wide self-start -mt-8">
                            DAFTAR ONLINE
                        </Link>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-800 text-3xl focus:outline-none">
                            {isMobileMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>
            </div>

            {/* === NAVIGATION BAR (DESKTOP) === */}
            <nav className="hidden md:block border-t border-gray-200 bg-white sticky top-0 z-40 shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <ul className="flex justify-center items-center space-x-8">
                        {navItems.map((item) => {
                            const active = isItemActive(item, url);
                            if (item.children) {
                                return (
                                    <li key={item.label} className="relative group">
                                        <NavLink href="#" isActive={active} hasDropdown={true}>
                                            {item.label}
                                        </NavLink>
                                        <div className="absolute left-0 mt-0 w-56 bg-white border border-gray-100 shadow-lg rounded-b-lg overflow-hidden hidden group-hover:block pt-2">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.label}
                                                    href={child.href}
                                                    className="block px-4 py-3 text-gray-700 hover:bg-[#00994d] hover:text-white transition-colors text-sm font-medium"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </li>
                                );
                            }
                            return (
                                <li key={item.label}>
                                    <NavLink href={item.href} isActive={active}>
                                        {item.label}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            {/* === MOBILE SIDEBAR MENU === */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/50 z-50"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white shadow-lg z-50 flex flex-col overflow-y-auto"
                        >
                            <div className="p-6 border-b flex justify-between items-center">
                                <h2 className="text-xl font-bold text-[#00994d]">MENU</h2>
                                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 text-2xl">✕</button>
                            </div>
                            <ul className="flex flex-col space-y-2 pt-4">
                                {navItems.map((item) => {
                                    const active = isItemActive(item, url);
                                    if (item.children) {
                                        const isOpen = expandedMobileMenu === item.label;
                                        return (
                                            <li key={item.label}>
                                                <NavLink
                                                    isMobile={true}
                                                    isActive={active}
                                                    hasDropdown={true}
                                                    onClick={() => toggleMobileSubmenu(item.label)}
                                                    icon={item.icon}
                                                >
                                                    {item.label}
                                                </NavLink>
                                                <AnimatePresence>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden bg-gray-50"
                                                        >
                                                            {item.children.map(child => (
                                                                <Link
                                                                    key={child.label}
                                                                    href={child.href}
                                                                    onClick={handleLinkClick}
                                                                    className="flex items-center gap-4 pl-14 pr-6 py-3 text-gray-600 hover:text-[#00994d] text-base font-medium border-l-4 border-transparent hover:border-[#00994d]"
                                                                >
                                                                    {child.icon && <child.icon className="w-5 h-5" />}
                                                                    <span>{child.label}</span>
                                                                </Link>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </li>
                                        );
                                    }
                                    return (
                                        <li key={item.label}>
                                            <NavLink
                                                href={item.href}
                                                isMobile={true}
                                                isActive={active}
                                                onClick={handleLinkClick}
                                                icon={item.icon}
                                            >
                                                {item.label}
                                            </NavLink>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="p-6 mt-auto bg-gray-50 border-t space-y-4">
                                <Link href={route('registration.index')} onClick={handleLinkClick} className="block w-full text-center bg-[#00b050] text-white font-bold py-3 rounded">
                                    DAFTAR ONLINE
                                </Link>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <HeadsetSupportIcon className="w-5 h-5"/> 
                                        <a href={`mailto:${contactData.email}`}>{contactData.email}</a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <PhoneSolidIcon className="w-5 h-5"/> 
                                        <a href={`https://wa.me/${contactData.whatsappInfo}`} target="_blank" rel="noreferrer">
                                            {settings.whatsapp_information || contactData.whatsappInfo}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}