import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { route } from 'ziggy-js';

// =========================================================================
// 1. KOMPONEN RENDERER (Penerjemah JSON Builder ke HTML)
//    --- DISESUAIKAN UNTUK STRUKTUR DATA BARU ---
// =========================================================================
const ArticleContentRenderer = ({ content }) => {
    // A. Cek null/undefined
    if (!content) return <p className="text-gray-500 italic">Konten artikel belum tersedia.</p>;

    // B. Support Backward Compatibility
    if (typeof content === 'string') {
        return <div className="prose prose-lg prose-green max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />;
    }

    // C. Render JSON Array
    if (Array.isArray(content)) {
        return (
            <div className="article-body w-full">
                {content.map((block, index) => {
                    const key = `${block.type}-${index}`;
                    
                    // =========================================================
                    // 1. Tipe: Paragraf (PERBAIKAN JARAK ANTAR PARAGRAF DISINI)
                    // =========================================================
                    if (block.type === 'paragraph') {
                        return (
                            <div 
                                key={key} 
                                // Penjelasan Class:
                                // [&>p]:mb-6          -> Memberikan margin bawah 1.5rem (jarak enter) ke setiap tag <p> di dalamnya
                                // [&>p:last-child]:mb-0 -> Menghilangkan margin di paragraf terakhir agar tidak terlalu jauh ke elemen berikutnya
                                // leading-loose       -> Membuat jarak antar baris kalimat lebih renggang (enak dibaca)
                                // text-lg             -> Ukuran font sedikit lebih besar
                                className="text-gray-700 text-lg leading-loose text-justify [&>p]:mb-6 [&>p:last-child]:mb-0 mb-8"
                                dangerouslySetInnerHTML={{ __html: block.data.content }} 
                            />
                        );
                    }

                    // =========================================================
                    // 2. Tipe: Image Banner
                    // =========================================================
                    if (block.type === 'image_banner' || block.type === 'image') {
                        if (!block.data.url) return null;
                        
                        return (
                            <figure key={key} className="my-10 w-full flex flex-col items-center">
                                <div className="w-full rounded-2xl overflow-hidden shadow-md border border-gray-100">
                                    <img 
                                        src={block.data.url} 
                                        alt={block.data.caption || 'Ilustrasi Artikel'} 
                                        className="w-full h-auto object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                {block.data.caption && (
                                    <figcaption className="mt-3 text-center text-sm text-gray-500 italic px-4">
                                        {block.data.caption}
                                    </figcaption>
                                )}
                            </figure>
                        );
                    }

                    // =========================================================
                    // 3. Tipe: Gallery (Opsional)
                    // =========================================================
                    if (block.type === 'gallery' && block.data.images?.length > 0) {
                        return (
                            <div key={key} className="my-10 grid grid-cols-2 md:grid-cols-3 gap-4">
                                {block.data.images.map((imageUrl, imgIndex) => (
                                    <div key={imgIndex} className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                                        <img src={imageUrl} alt="Galeri" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                                    </div>
                                ))}
                            </div>
                        );
                    }

                    return null;
                })}
            </div>
        );
    }
    
    return null;
};



// =========================================================================
// 2. SIDEBAR ARTIKEL LAIN (TIDAK ADA PERUBAHAN)
// =========================================================================
const OtherArticlesSidebar = ({ articles }) => (
    <div className="mb-10">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
            <h3 className="font-bold text-lg text-gray-900 uppercase">ARTIKEL LAIN</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </div>

        {articles.length === 0 ? (
            <p className="text-gray-500 text-sm">Belum ada artikel lain.</p>
        ) : (
            <ul className="space-y-6">
                {articles.map(item => (
                    <li key={item.id}>
                        <Link href={route('articles.show', item.slug)} className="flex gap-4 group">
                            <div className="shrink-0 w-24 h-20 bg-gray-200 overflow-hidden rounded-md">
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/error-svgrepo-com.png'; }}
                                />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-[#00994d] transition-colors line-clamp-3">
                                    {item.title}
                                </h4>
                                <div className="mt-2 flex items-center text-xs text-gray-500 gap-2">
                                    <span>By {item.author || 'Admin'}</span>
                                    <span className="flex items-center text-gray-400">
                                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {item.date}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        )}
    </div>
);

const EMOJIS = ['😄', '🙂', '😐', '🙁', '😠', '😢'];

// =========================================================================
// 3. FORM ULASAN (TIDAK ADA PERUBAHAN)
// =========================================================================
const ReviewForm = ({ articleSlug }) => {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: '',
        comment: '',
        reaction: null,
    });

    const handleReactionClick = (emoji) => {
        setData('reaction', data.reaction === emoji ? null : emoji);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('articles.reviews.store', articleSlug), {
            preserveScroll: true,
            onSuccess: () => {
                setData('comment', '');
                setData('reaction', null);
            },
        });
    };

    if (recentlySuccessful) {
        return (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded text-sm text-center">
                Terima kasih, ulasan Anda berhasil dikirim!
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="mb-8">
            <div className="mb-4">
                <input
                    type="text"
                    value={data.comment}
                    onChange={(e) => setData('comment', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-4 py-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder-gray-400"
                    placeholder="Berikan Ulasan Anda"
                />
            </div>

            {data.comment.length > 0 && (
                <div className="mb-4 animate-fade-in-down">
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full bg-white border border-gray-200 text-gray-700 text-xs rounded-md px-4 py-2 mb-2"
                        placeholder="Nama Anda (Opsional)"
                    />
                </div>
            )}

            <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Pilih reaksi (opsional):</p>
                <div className="flex gap-4 justify-start">
                    {EMOJIS.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => handleReactionClick(emoji)}
                            className={`text-2xl transition-transform hover:scale-125 ${data.reaction === emoji ? 'scale-125 drop-shadow-md' : 'opacity-70 hover:opacity-100'}`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>

            {errors.review && <p className="text-xs text-red-500 mb-2">{errors.review}</p>}

            <div className="text-right">
                <button
                    type="submit"
                    disabled={processing || (!data.comment && !data.reaction)}
                    className="bg-[#00994d] hover:bg-green-700 text-white text-xs font-bold py-2 px-6 rounded shadow-sm disabled:opacity-50 transition-colors"
                >
                    KIRIM
                </button>
            </div>
        </form>
    );
};

// =========================================================================
// 4. SECTION KOMENTAR (TIDAK ADA PERUBAHAN)
// =========================================================================
const CommentsSection = ({ reviews, reactionCounts, articleSlug }) => {
    const reactions = [
        { emoji: '😄', count: reactionCounts.grinning || 0 },
        { emoji: '🙂', count: reactionCounts.smiling || 0 },
        { emoji: '😐', count: reactionCounts.neutral || 0 },
        { emoji: '🙁', count: reactionCounts.frowning || 0 },
        { emoji: '😠', count: reactionCounts.angry || 0 }, 
        { emoji: '😢', count: reactionCounts.crying || 0 }, 
    ];

    const getAvatarColor = (name) => 'bg-[#ff6b6b]';

    return (
        <div>
            <h3 className="font-bold text-lg text-gray-900 uppercase border-b border-gray-200 pb-2 mb-6">ULASAN ARTIKEL</h3>

            <ReviewForm articleSlug={articleSlug} />

            <div className="flex justify-between px-4 py-4 mb-8">
                {reactions.map(({ emoji, count }, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <span className="text-3xl mb-1">{emoji}</span>
                        <span className="text-sm font-medium text-gray-600">{count}</span>
                    </div>
                ))}
            </div>

            <div className="space-y-8">
                {reviews.length > 0 ? reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-full ${getAvatarColor(review.name)} text-white flex items-center justify-center font-bold text-xl shrink-0`}>
                                {review.name ? review.name.charAt(0).toUpperCase() : 'A'}
                            </div>

                            <div className="flex-1">
                                <h5 className="font-bold text-gray-900 text-base">
                                    {review.name || 'Pengunjung'}
                                </h5>
                                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                    {review.comment}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    {review.date}
                                </p>

                                {review.admin_reply && (
                                    <div className="mt-4 bg-gray-50 p-3 rounded-lg border-l-4 border-green-500">
                                        <p className="text-xs font-bold text-green-700 mb-1">Respon Admin Klinik</p>
                                        <p className="text-sm text-gray-600">{review.admin_reply}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-400 text-sm italic py-4">Belum ada ulasan tertulis.</p>
                )}
            </div>
        </div>
    );
};

// =========================================================================
// 5. HALAMAN UTAMA (TIDAK ADA PERUBAHAN)
// =========================================================================
export default function ArticleShow(props) {
    // Handling Props agar aman (defensive coding)
    const article = props.article || {};
    const otherArticles = props.otherArticles || [];
    const reviews = props.reviews || [];
    const reactionCounts = props.reactionCounts || {};

    if (!article.id) {
        return (
             <div className="flex items-center justify-center min-h-screen bg-gray-50">
                 <div className="text-center">
                     <h1 className="text-2xl font-bold text-gray-800">Artikel Tidak Ditemukan</h1>
                     <Link href="/" className="text-blue-600 mt-4 inline-block hover:underline">&larr; Kembali</Link>
                 </div>
             </div>
        );
    }

    return (
        <>
            <Head title={article.title} />

            {/* Banner Header */}
            <div className="relative h-64 bg-gray-900 flex flex-col justify-center items-center text-center overflow-hidden">
                <img 
                    src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/tampakdepan.webp" 
                    alt="Background" 
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-40 blur-[2px]" 
                />
                <div className="relative z-10 max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase mb-2">ARTIKEL</h1>
                    <p className="text-gray-200 text-sm md:text-base font-medium">
                        Halaman ini berfungsi memberikan informasi edukasi kesehatan kepada pengunjung.
                    </p>
                </div>
            </div>

            <div className="bg-white py-16">
                <div className="container mx-auto mb-20 px-4 sm:px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

                        {/* KOLOM KIRI: KONTEN ARTIKEL */}
                        <div className="w-full lg:w-2/3">
                            {/* Header Artikel */}
                            <div className="mb-6">
                                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 uppercase leading-snug mb-3">
                                    {article.title}
                                </h1>
                                <div className="flex items-center text-xs text-gray-500 font-medium space-x-2">
                                    <span>{article.date}</span>
                                    <span>|</span>
                                    <span>Penulis: {article.author || 'Admin'}</span>
                                </div>
                            </div>

                            {/* Gambar Utama (Thumbnail/Cover) */}
                            {article.image_url && (
                                <div className="mb-8 rounded-lg overflow-hidden w-full h-auto max-h-[500px]">
                                    <img
                                        src={article.image_url}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { 
                                            e.target.onerror = null; 
                                            e.target.src = 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/web-profile/aset/error-svgrepo-com.png'; 
                                        }}
                                    />
                                </div>
                            )}

                            {/* --- CONTENT RENDERER (DINAMIS) --- */}
                            <ArticleContentRenderer content={article.content} />

                        </div>

                        {/* KOLOM KANAN: SIDEBAR */}
                        <aside className="w-full lg:w-1/3">
                            <div className="top-10">
                                <OtherArticlesSidebar articles={otherArticles} />
                                <CommentsSection reviews={reviews} reactionCounts={reactionCounts} articleSlug={article.slug} />
                            </div>
                        </aside>

                    </div>
                </div>
            </div>
        </>
    );
}

ArticleShow.layout = page => <AppLayout children={page} />;