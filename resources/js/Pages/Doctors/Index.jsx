import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { motion } from 'framer-motion';

// Helper untuk placeholder jika gambar gagal dimuat
const softDummyUserIcon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E5E7EB'><path fill-rule='evenodd' d='M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z' clip-rule='evenodd' /></svg>";

// Komponen untuk menampilkan jadwal harian
const ScheduleDay = ({ day, time }) => (
    <div className="text-center">
        <div className="bg-[#16a34a] text-white text-xs sm:text-sm font-semibold py-1 sm:py-2 px-1 rounded-t-md">
            {day}
        </div>
        <div className="bg-white border border-t-0 border-gray-200 text-gray-700 font-medium py-1.5 sm:py-3 px-1 rounded-b-md h-10 sm:h-12 flex items-center justify-center text-xs sm:text-base">
            {time || '—'}
        </div>
    </div>
);

// Komponen Kartu Dokter Utama
const DoctorCard = ({ doctor }) => {
    const daysOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    
    // Mengambil data jadwal dari prop `doctor`
    const scheduleData = doctor.schedules && doctor.schedules.length > 0 ? doctor.schedules[0] : {};
    const scheduleItems = daysOrder.map(day => ({
        day,
        time: scheduleData[day.toLowerCase()] || null
    }));

    return (
        <motion.div
            className="bg-[#f0fdf4] rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl p-4 lg:p-6 flex flex-col lg:flex-row items-start gap-4 lg:gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Bagian Kiri - Mobile: stacked, Desktop: row */}
            <div className="w-full lg:flex-1 min-w-0 flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-6 text-center sm:text-left">
                <div className="flex-shrink-0 ring-1 lg:ring-2 ring-[#00A54F] rounded-lg lg:rounded-xl shadow-md">
                    <img
                        src={doctor.photo || softDummyUserIcon}
                        alt={`Foto ${doctor.name}`}
                        className="w-32 h-32 lg:w-48 lg:h-auto object-cover rounded-lg lg:rounded-xl bg-gray-200"
                        onError={(e) => { e.target.onerror = null; e.target.src = softDummyUserIcon; }}
                    />
                </div>
                <div className="w-full">
                    <h3 className="text-lg lg:text-2xl font-bold text-[#14532d] mb-2 lg:mb-4 break-words leading-tight">
                        {doctor.name}
                    </h3>
                    <p className="text-gray-700 font-semibold text-sm lg:text-base mb-2 lg:mb-3">Jenis Layanan</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                         {doctor.specialization && doctor.specialization.length > 0 ? doctor.specialization.map((service, index) => (
                             <span key={index} className="bg-[#16a34a] text-white text-xs lg:text-sm font-semibold px-3 py-1 lg:px-5 lg:py-2 rounded-full">
                                {service}
                            </span>
                        )) : (
                            <span className="bg-gray-500 text-white text-xs font-semibold px-3 py-1 lg:px-4 lg:py-1.5 rounded-full">
                                Informasi tidak tersedia
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Bagian Kanan - Mobile: full width, Desktop: fixed width */}
            <div className="w-full lg:w-[500px] lg:flex-shrink-0 flex flex-col items-center border-t border-gray-200 pt-4 lg:pt-0 lg:border-0">
                <h4 className="text-base lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4">Jadwal Praktik</h4>
                <div className="w-full max-w-xl">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 mb-3 lg:mb-4">
                        {scheduleItems.slice(0, 4).map(item => <ScheduleDay key={item.day} day={item.day} time={item.time} />)}
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
                        {scheduleItems.slice(4).map(item => <ScheduleDay key={item.day} day={item.day} time={item.time} />)}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const DoctorsIndex = ({ doctors = [] }) => {
    const [searchDept, setSearchDept] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');

    const filteredDoctors = useMemo(() => {
        return doctors.filter(doctor => {
            // 1. Logic Filter Departemen / Specialization (Array)
            // Mengecek apakah input searchDept ada di DALAM array specialization dokter
            const matchesDept = searchDept === '' || (
                Array.isArray(doctor.specialization) && 
                doctor.specialization.some(spec => 
                    spec.toLowerCase().includes(searchDept.toLowerCase())
                )
            );

            // 2. Logic Filter Nama Dokter (ID)
            const matchesName = selectedDoctor === '' || doctor.id.toString() === selectedDoctor;
            
            // Menggabungkan kedua filter
            return matchesDept && matchesName;
        });
    }, [doctors, searchDept, selectedDoctor]);

    return (
        <>
            <Head title="Jadwal Dokter - Klinik Pratama UNIMUS" />
            
            {/* --- HERO SECTION --- */}
            <div className="relative h-48 lg:h-64 bg-gray-900 flex flex-col justify-center items-center text-center overflow-hidden">
                <img
                    src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/tampakdepan.webp"
                    alt="Background"
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-40 blur-[2px]"
                />
                <div className="relative z-10 max-w-4xl mx-auto px-4">
                    <h1 className="text-2xl lg:text-5xl font-black text-white tracking-widest uppercase mb-2">
                        JADWAL DOKTER
                    </h1>
                    <p className="text-gray-200 text-sm lg:text-base font-medium leading-relaxed max-w-xs lg:max-w-none mx-auto">
                        Konsultasi dan Pemeriksaan dengan Dokter di Klinik Pratama Unimus.
                    </p>
                </div>
            </div>
            
            <section id="doctor-schedule" className="py-6 lg:py-10">
                <div className="container mx-auto px-3 lg:px-8 max-w-7xl">
                    
                    {/* --- FILTER SECTION --- */}
                    <div className="mb-8 lg:mb-12 p-4 lg:p-6 rounded-xl">
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 text-center mb-4 lg:mb-6">Cari Jadwal Dokter</h2>
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
                            <div className="relative w-full lg:w-1/3">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Cari Layanan / Poliklinik"
                                    value={searchDept}
                                    onChange={(e) => setSearchDept(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 lg:py-3 border lg:border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm lg:text-base"
                                />
                            </div>
                            <span className="text-gray-500 font-medium text-sm lg:text-base hidden lg:inline">Atau</span>
                            <div className="relative w-full lg:w-1/3">
                                 <select
                                    value={selectedDoctor}
                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                    className="w-full appearance-none px-4 py-2 lg:py-3 border lg:border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white text-sm lg:text-base"
                                >
                                    <option value="">Semua Dokter</option>
                                    {doctors.map(doc => (
                                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                                    ))}
                                </select>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* --- LIST DOCTORS --- */}
                    <div className="space-y-6 lg:space-y-8 mb-20 lg:mb-10">
                        {filteredDoctors.length > 0 ? (
                            filteredDoctors.map(doctor => (
                                <DoctorCard key={doctor.id} doctor={doctor} />
                            ))
                        ) : (
                            // Area kosong yang Full Height / Proporsional
                            <div className="w-full flex flex-col items-center justify-center min-h-[50vh] lg:min-h-[60vh] text-center bg-gray-50 rounded-xl lg:rounded-2xl border lg:border-2 border-dashed border-gray-200 p-6 lg:p-8">
                                <div className="bg-white p-3 lg:p-4 rounded-full shadow-sm mb-4">
                                    {/* Icon User Not Found */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 lg:h-12 lg:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg lg:text-xl font-bold text-gray-700 mb-2">Dokter Tidak Ditemukan</h3>
                                <p className="text-gray-500 font-medium text-sm lg:text-base max-w-md">
                                    Maaf, kami tidak menemukan dokter dengan kriteria pencarian tersebut. Silakan coba kata kunci lain atau pilih "Semua Dokter".
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

DoctorsIndex.layout = page => <AppLayout children={page} />;
export default DoctorsIndex;