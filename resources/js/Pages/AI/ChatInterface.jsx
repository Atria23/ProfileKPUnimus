import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- KONSTANTA URL LOGO ---
const KLINIK_LOGO = "https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/inventaris-fotos/aset/logo_klinik.png";

// --- DAFTAR SARAN UMUM ---
const GENERAL_TOPICS = [
    { category: "Dokter & Jadwal", items: ["Jadwal dokter hari ini", "Siapa saja dokter yang praktik?", "Jam operasional klinik"] },
    { category: "Layanan", items: ["Layanan Poli Umum", "Apakah menerima BPJS?", "Layanan KIA & KB", "Cek Laboratorium"] },
    { category: "Fasilitas & Kontak", items: ["Lokasi klinik dimana?", "Nomor WhatsApp Pendaftaran", "Ada fasilitas rawat inap?"] }
];

// --- ICONS ---
const ArrowLeftIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
);
const UserIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>
);
const SendIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
);
const BulbIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"></path><path d="M9 21h6"></path></svg>
);
const MenuIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);
const CloseIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default function ChatInterface() {
    // State Utama
    const [messages, setMessages] = useState([
        { 
            from: 'ai', 
            text: 'Assalamu\'alaikum! 👋\nSaya asisten virtual Klinik Pratama UNIMUS.\n\nSaya siap membantu memberikan informasi terkait **Jadwal Dokter**, **Layanan Medis**, dan **Fasilitas**.\n\nAda yang bisa saya bantu hari ini?',
            suggestions: ['Jadwal dokter hari ini', 'Layanan yang tersedia', 'Lokasi klinik']
        }
    ]);
    
    // State UI
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false); // Untuk menu saran di mobile
    
    // Suggestion Logic
    const [activeSuggestions, setActiveSuggestions] = useState(['Jadwal dokter hari ini', 'Layanan yang tersedia', 'Lokasi klinik']);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const submitQuery = async (queryText) => {
        if (!queryText.trim() || isLoading) return;
        
        setShowMobileMenu(false); // Tutup menu mobile jika terbuka
        const userMessage = { from: 'user', text: queryText };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await axios.post(route('ai.ask'), { query: queryText });
            const replyText = response.data.reply.text;
            const newSuggestions = response.data.reply.suggestions || [];

            const aiMessage = { 
                from: 'ai', 
                text: replyText,
                suggestions: newSuggestions
            };
            setMessages(prev => [...prev, aiMessage]);

            if (newSuggestions.length > 0) {
                setActiveSuggestions(newSuggestions);
            }

        } catch (error) {
            console.error("AI request failed:", error); 
            const errorMessage = { from: 'ai', text: 'Mohon maaf, sistem sedang sibuk. Silakan coba lagi nanti.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        submitQuery(input);
        setInput('');
    };

    const handleSuggestionClick = (suggestion) => {
        if (isLoading) return;
        submitQuery(suggestion);
    };

    // --- Components ---

    const Disclaimer = () => (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-[#00b050] p-4 text-center">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wider">Disclaimer</h2>
                </div>
                <div className="p-6 space-y-4 text-sm text-gray-600 leading-relaxed max-h-[60vh] overflow-y-auto">
                   <p className="font-medium text-gray-800">Harap perhatikan hal berikut:</p>
                   <ul className="list-disc pl-5 space-y-2">
                       <li>AI ini <strong>HANYA</strong> untuk informasi administratif.</li>
                       <li>AI <strong>TIDAK DAPAT</strong> memberikan diagnosis atau resep obat.</li>
                       <li>Untuk keadaan darurat, hubungi IGD terdekat.</li>
                   </ul>
                </div>
                <div className="p-4 bg-gray-50 flex justify-center border-t border-gray-100">
                    <button 
                        onClick={() => setDisclaimerAccepted(true)}
                        className="w-full sm:w-auto px-8 py-3 bg-[#00b050] hover:bg-[#00994d] text-white font-bold rounded-full shadow-lg transition-all active:scale-95"
                    >
                        Saya Setuju
                    </button>
                </div>
            </div>
        </div>
    );

    // Komponen untuk render Markdown yang rapi
    const FormattedMessage = ({ text, isUser }) => (
        <div className={`markdown-body text-sm md:text-[15px] leading-relaxed ${isUser ? 'text-white' : 'text-gray-800'}`}>
            <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                    // Style khusus untuk elemen markdown agar sesuai dengan bubble chat
                    strong: ({node, ...props}) => <span className="font-bold" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-2 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    a: ({node, ...props}) => <a className="underline hover:text-blue-500" target="_blank" {...props} />
                }}
            >
                {text}
            </ReactMarkdown>
        </div>
    );

    return (
        <>
            <Head title="AI Assistant - Klinik Pratama UNIMUS" />

            <div className="flex flex-col h-screen w-full bg-[#f3f4f6] overflow-hidden relative font-sans">
                
                {!disclaimerAccepted && <Disclaimer />}

                {/* === HEADER === */}
                <div className="flex-shrink-0 relative bg-gray-900 py-3 px-4 shadow-md z-30">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#064e3b] to-[#00b050] opacity-95"></div>
                    
                    <div className="relative z-10 w-full mx-auto flex items-center gap-3">
                        <button onClick={() => window.history.back()} className="p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors">
                            <ArrowLeftIcon className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center border-2 border-green-200 p-1">
                            <img src={KLINIK_LOGO} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        
                        <div className="flex-1">
                            <h1 className="text-base md:text-lg font-bold text-white tracking-wide">AI Assistant</h1>
                            <p className="text-green-100 text-[10px] md:text-[11px] font-medium flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                                Klinik Pratama Unimus
                            </p>
                        </div>

                        {/* Tombol Menu Mobile (Hamburger) */}
                        <button 
                            onClick={() => setShowMobileMenu(true)}
                            className="md:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <MenuIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* === MAIN CONTENT === */}
                <div className="flex-1 flex overflow-hidden relative">
                    
                    {/* --- AREA CHAT --- */}
                    <div className="flex-1 flex flex-col w-full md:w-3/4 bg-[#f3f4f6] relative">
                        
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth custom-scrollbar">
                            <div className="max-w-3xl mx-auto space-y-6 pb-4">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex w-full ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex max-w-[90%] md:max-w-[80%] gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            
                                            {/* Avatar */}
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mt-1 border ${
                                                msg.from === 'user' ? 'bg-gray-200 border-gray-300' : 'bg-white border-green-100'
                                            }`}>
                                                {msg.from === 'user' ? <UserIcon className="w-5 h-5 text-gray-500" /> : <img src={KLINIK_LOGO} alt="AI" className="w-full h-full object-contain p-1" />}
                                            </div>

                                            {/* Bubble Chat */}
                                            <div className="flex flex-col">
                                                <div className={`py-3 px-4 rounded-2xl shadow-sm border ${
                                                    msg.from === 'user' 
                                                        ? 'bg-[#00b050] border-[#00994d] rounded-tr-none text-white' 
                                                        : 'bg-white border-gray-200 rounded-tl-none text-gray-800'
                                                }`}>
                                                    {/* RENDER DENGAN MARKDOWN AGAR RAPI */}
                                                    <FormattedMessage text={msg.text} isUser={msg.from === 'user'} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Loading Indicator */}
                                {isLoading && (
                                    <div className="flex justify-start w-full animate-fadeIn">
                                        <div className="flex gap-2 max-w-[85%]">
                                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-green-100 mt-1">
                                                <img src={KLINIK_LOGO} alt="Loading" className="w-full h-full object-contain p-1 animate-pulse" />
                                            </div>
                                            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-200 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* --- INPUT AREA & QUICK SUGGESTIONS (MOBILE) --- */}
                        <div className="flex-shrink-0 bg-white border-t border-gray-200 z-20 pb-safe">
                            
                            {/* Horizontal Scrollable Suggestions (Chips) - Visible on Mobile & Desktop */}
                            {!isLoading && (
                                <div className="px-4 pt-3 pb-2 overflow-x-auto whitespace-nowrap scrollbar-hide flex items-center gap-2 border-b border-gray-100 bg-gray-50/50">
                                    <BulbIcon className="w-4 h-4 text-yellow-500 flex-shrink-0 mr-1" />
                                    {/* Gabungkan active suggestions dengan beberapa general topics agar list panjang */}
                                    {[...activeSuggestions, ...GENERAL_TOPICS[0].items].slice(0, 6).map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="inline-block px-3 py-1.5 bg-white border border-green-200 text-green-700 rounded-full text-xs font-medium hover:bg-green-50 shadow-sm transition-all active:scale-95"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                    <button 
                                        onClick={() => setShowMobileMenu(true)} 
                                        className="md:hidden inline-block px-3 py-1.5 bg-gray-100 border border-gray-200 text-gray-600 rounded-full text-xs font-medium"
                                    >
                                        Lainnya...
                                    </button>
                                </div>
                            )}

                            <div className="p-3 md:p-4 max-w-3xl mx-auto">
                                <form onSubmit={handleSend} className="relative flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="w-full pl-5 pr-12 py-3 bg-gray-100 border-0 text-gray-800 rounded-full focus:ring-2 focus:ring-[#00b050] focus:bg-white transition-all placeholder-gray-400 text-sm md:text-base shadow-inner"
                                        placeholder="Ketik pertanyaan Anda..."
                                        disabled={isLoading}
                                        autoFocus
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={isLoading || !input.trim()}
                                        className="absolute right-2 p-2 bg-[#00b050] hover:bg-[#00994d] text-white rounded-full shadow-md disabled:bg-gray-300 disabled:shadow-none transition-all active:scale-90"
                                    >
                                        <SendIcon className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* --- SIDEBAR DESKTOP --- */}
                    <div className="hidden md:flex md:w-1/4 xl:w-1/5 bg-white border-l border-gray-200 flex-col shadow-lg z-10">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wide">
                                <BulbIcon className="w-4 h-4 text-yellow-500" />
                                Topik Bantuan
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {GENERAL_TOPICS.map((topic, index) => (
                                <div key={index}>
                                    <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
                                        {topic.category}
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {topic.items.map((item, idx) => (
                                            <button
                                                key={`gen-${index}-${idx}`}
                                                onClick={() => handleSuggestionClick(item)}
                                                disabled={isLoading}
                                                className="group p-2.5 text-left text-xs text-gray-600 bg-white rounded-lg hover:bg-green-50 border border-transparent hover:border-green-100 transition-all flex items-center justify-between"
                                            >
                                                <span>{item}</span>
                                                <span className="opacity-0 group-hover:opacity-100 text-green-500 text-[10px]">→</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-gray-50 text-[10px] text-gray-400 text-center border-t border-gray-100">
                            © {new Date().getFullYear()} Klinik Pratama UNIMUS
                        </div>
                    </div>

                    {/* --- MOBILE MODAL/DRAWER (MENU SARAN LENGKAP) --- */}
                    {showMobileMenu && (
                        <div className="absolute inset-0 z-50 md:hidden flex flex-col animate-fadeIn">
                            {/* Backdrop */}
                            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)}></div>
                            
                            {/* Content Drawer */}
                            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl h-[85vh] flex flex-col animate-slideUp">
                                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                        <BulbIcon className="w-5 h-5 text-yellow-500" />
                                        Pilih Topik Pertanyaan
                                    </h3>
                                    <button onClick={() => setShowMobileMenu(false)} className="p-2 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300">
                                        <CloseIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white">
                                    {GENERAL_TOPICS.map((topic, index) => (
                                        <div key={index}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="w-1 h-4 bg-[#00b050] rounded-full"></span>
                                                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{topic.category}</h4>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2">
                                                {topic.items.map((item, idx) => (
                                                    <button
                                                        key={`mob-${index}-${idx}`}
                                                        onClick={() => handleSuggestionClick(item)}
                                                        className="p-3 text-left text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-xl hover:bg-green-50 hover:border-green-200 active:bg-green-100 transition-all shadow-sm"
                                                    >
                                                        {item}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            
            {/* Custom CSS untuk hide scrollbar tapi tetap bisa scroll */}
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
            `}</style>
        </>
    );
}