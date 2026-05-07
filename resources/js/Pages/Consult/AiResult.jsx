import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';

// Ikon
const StethoscopeIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10a5 5 0 015-5h0a5 5 0 015 5v3h-3a2 2 0 00-2 2v2a2 2 0 002 2h3v2a5 5 0 01-5 5h0a5 5 0 01-5-5v-9z"></path><path d="M12 10V2"></path><circle cx="18" cy="4" r="2"></circle></svg>);
const WhatsAppIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.42 1.29 4.89L2 22l5.25-1.38c1.41.78 2.99 1.21 4.67 1.21h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.2 15.2c-.22-.11-.76-.38-1.04-.51s-.39-.11-.56.11-.39.51-.48.62-.18.14-.33.03c-.63-.44-1.38-.86-2.28-1.5-1.03-.73-1.4-1.4-1.56-1.65s-.12-.22 0-.33c.1-.11.22-.28.33-.42s.14-.18.22-.3.04-.15-.02-.28c-.06-.11-.56-1.34-.76-1.84s-.4-.42-.56-.42h-.48c-.18 0-.42.06-.6.3s-.66.65-.66 1.58.68 1.84.78 1.98c.1.14 1.32 2.01 3.2 2.82.44.19.78.3.92.42.28.2.47.17.62.1.18-.08.76-.31.86-.62s.1-.56.08-.62c-.03-.06-.1-.1-.22-.21z"></path></svg>);

export default function AiResult({ result, input, admin_wa }) {

    const message = encodeURIComponent(
        `Halo Admin, saya ingin mendaftar ke *${result.poli}*.\n\n` +
        `Rekomendasi dari Website:\n` +
        `• Gejala: ${input.symptoms.join(", ")}\n` +
        `• Dugaan: ${result.ringkasan}\n` +
        `• Urgensi: ${result.urgensi}`
    );
    
    // Tentukan warna berdasarkan urgensi
    const urgencyColor = result.urgensi?.toLowerCase().includes('tinggi') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';

    return (
        <AppLayout>
            <Head title="Hasil Analisis AI" />

            <div className="py-12 bg-[#f8f9fa] min-h-screen">
                <div className="container mx-auto px-4 max-w-4xl">
                    
                    {/* Header Alert */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg mb-8 border-l-4 border-blue-500 ${urgencyColor} shadow-sm`}
                    >
                        <p className="font-semibold">
                            Berdasarkan keluhan: <span className="font-bold">{input.symptoms.join(", ")}</span>
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* --- CARD REKOMENDASI UTAMA --- */}
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                            className="md:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden border-t-8 border-[#50cd89]"
                        >
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="bg-green-100 p-3 rounded-full text-[#50cd89]">
                                        <StethoscopeIcon className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Rekomendasi Layanan</p>
                                        <h2 className="text-3xl font-bold text-gray-800">{result.poli}</h2>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-bold text-gray-700 mb-1">Analisis Singkat:</h3>
                                        <p className="text-gray-600 leading-relaxed">{result.ringkasan}</p>
                                    </div>
                                    
                                    <div>
                                        <h3 className="font-bold text-gray-700 mb-1">Saran Awal:</h3>
                                        <p className="text-gray-600 leading-relaxed">{result.saran}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="bg-gray-50 px-8 py-6 flex flex-col sm:flex-row gap-4">
                                
                                {/* 2. Update Link WA di sini vvv */}
                                <a 
                                    href={`https://wa.me/${admin_wa}?text=${message}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex-1 inline-flex justify-center items-center px-6 py-3 rounded-lg font-bold text-white bg-[#50cd89] hover:bg-[#38a36a] transition-all shadow-lg hover:shadow-xl"
                                >
                                    <WhatsAppIcon className="w-5 h-5 mr-2" />
                                    Daftar via WhatsApp
                                </a>
                                <Link 
                                    href={route('ai.consultation')} 
                                    className="px-6 py-3 rounded-lg font-bold text-gray-600 border border-gray-300 hover:bg-white hover:text-gray-800 transition-colors text-center"
                                >
                                    Cek Ulang
                                </Link>
                            </div>
                        </motion.div>

                        {/* --- SIDEBAR: JADWAL DOKTER --- */}
                        <motion.div 
                            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl shadow-lg p-6 h-fit"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Jadwal Dokter Tersedia</h3>
                            
                            {result.dokter && result.dokter.length > 0 ? (
                                <ul className="space-y-4">
                                    {result.dokter.map((doc, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="w-2 h-2 mt-2 rounded-full bg-[#50cd89]"></div>
                                            <div>
                                                <p className="font-bold text-gray-800">{doc.nama}</p>
                                                <p className="text-sm text-gray-500">{doc.jam}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">Jadwal tidak tersedia saat ini.</p>
                            )}

                            <div className="mt-8 pt-4 border-t">
                                <a 
                                    href="https://wa.me/6289675873994" 
                                    target="_blank"
                                    className="flex items-center justify-center gap-2 text-[#50cd89] font-bold hover:underline"
                                >
                                    <WhatsAppIcon className="w-5 h-5" /> Konsultasi CS
                                </a>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}