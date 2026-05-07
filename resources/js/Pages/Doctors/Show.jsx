import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from "motion/react";
import AppLayout from '@/Layouts/AppLayout';

const DoctorShow = ({ doctor }) => {
    const softDummyUserIcon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239CA3AF'><path fill-rule='evenodd' d='M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z' clip-rule='evenodd' /></svg>";

    return (
        <>
            <Head title={`${doctor.name} - Profil Dokter`} />
            
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    {/* Tombol Kembali */}
                    <div className="mb-6">
                        <Link href={route('doctors.index')} className="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                            Kembali ke Daftar Tim
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        {/* Header Profil */}
                        <div className="md:flex">
                            {/* Kolom Foto */}
                            <div className="md:w-1/3 bg-green-50 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-100">
                                <motion.img 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    src={doctor.image_path || softDummyUserIcon} 
                                    alt={doctor.name}
                                    className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg mb-4"
                                    onError={(e) => { e.target.onerror = null; e.target.src = softDummyUserIcon; }}
                                />
                                <h1 className="text-2xl font-bold text-gray-800">{doctor.name}</h1>
                                <p className="text-green-600 font-medium text-lg mt-1">{doctor.specialization}</p>
                                
                                {doctor.formatted_schedule && (
                                    <div className="mt-4 bg-white px-4 py-2 rounded-lg shadow-sm border border-green-100">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Jadwal Praktik</p>
                                        <p className="text-sm font-medium text-gray-700">{doctor.formatted_schedule}</p>
                                    </div>
                                )}
                            </div>

                            {/* Kolom Info Detail */}
                            <div className="md:w-2/3 p-8">
                                {/* Deskripsi / Biografi */}
                                {doctor.description && (
                                    <div className="mb-8">
                                        <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-green-500 pl-3">Tentang Dokter</h2>
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                            {doctor.description}
                                        </p>
                                    </div>
                                )}

                                {/* Sub Spesialisasi */}
                                {doctor.sub_specializations && doctor.sub_specializations.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="text-lg font-bold text-gray-800 mb-3">Keahlian & Minat Klinis</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {doctor.sub_specializations.map((sub, idx) => (
                                                <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                                    {sub.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Riwayat Pendidikan */}
                                {doctor.educations && doctor.educations.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="text-lg font-bold text-gray-800 mb-3">Riwayat Pendidikan</h2>
                                        <ul className="space-y-3">
                                            {doctor.educations.map((edu, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <span className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full mr-3"></span>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{edu.institution}</p>
                                                        <p className="text-sm text-gray-600">{edu.degree} {edu.year ? `- Lulus ${edu.year}` : ''}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Pengalaman Kerja */}
                                {doctor.work_experiences && doctor.work_experiences.length > 0 && (
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800 mb-3">Pengalaman</h2>
                                        <div className="space-y-4">
                                            {doctor.work_experiences.map((exp, idx) => (
                                                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                    <p className="font-semibold text-gray-800">{exp.position}</p>
                                                    <p className="text-sm text-gray-600">{exp.place}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{exp.period}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

DoctorShow.layout = page => <AppLayout children={page} />;
export default DoctorShow;