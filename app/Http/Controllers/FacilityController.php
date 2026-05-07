<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacilityController extends Controller
{
    /**
     * Halaman Khusus Fasilitas Perawatan
     */
    public function perawatan()
    {
        $facilities = Facility::visible()
            ->where('category', Facility::CATEGORY_PERAWATAN)
            ->latest('published_at')
            ->get(['id', 'title', 'slug', 'category', 'content', 'excerpt', 'image_path', 'published_at']);

        return Inertia::render('Facility/CategoryIndex', [
            'facilities' => $facilities,
            'pageTitle' => 'Fasilitas Perawatan',
            'pageDescription' => 'Layanan medis unggulan untuk kesembuhan pasien.'
        ]);
    }

    /**
     * Halaman Khusus Fasilitas Penunjang
     */
    public function penunjang()
    {
        $facilities = Facility::visible()
            ->where('category', Facility::CATEGORY_PENUNJANG)
            ->latest('published_at')
            ->get(['id', 'title', 'slug', 'category','content', 'excerpt', 'image_path', 'published_at']);

        return Inertia::render('Facility/CategoryIndex', [
            'facilities' => $facilities,
            'pageTitle' => 'Fasilitas Penunjang',
            'pageDescription' => 'Sarana pendukung untuk kenyamanan dan kebutuhan non-medis.'
        ]);
    }

    /**
     * Menampilkan detail satu fasilitas (Tetap sama)
     */
    public function show($slug)
    {
        $facility = Facility::visible()
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('Facility/Show', [
            'facility' => $facility,
        ]);
    }

    public function apiIndexByCategory($category)
    {
        // --- PERBAIKAN KONSISTENSI: Gunakan konstanta dari model ---
        $validCategories = [Facility::CATEGORY_PERAWATAN, Facility::CATEGORY_PENUNJANG];
        if (!in_array($category, $validCategories)) {
            return response()->json(['message' => 'Invalid category'], 400);
        }

        $facilities = Facility::visible()
            ->where('category', $category) // Ini sekarang akan cocok dengan data DB
            ->latest('published_at')
            ->get(['id', 'title', 'slug', 'category', 'excerpt', 'content', 'image_path', 'published_at'])
            ->map(function ($facility) {
                return [
                    'id' => $facility->id,
                    'title' => $facility->title,
                    'slug' => $facility->slug,
                    'category' => $facility->category,
                    'excerpt' => $facility->excerpt,
                    'content' => $facility->content,
                    'image_url' => $facility->image_path,
                    'published_at' => $facility->published_at ? $facility->published_at->format('d M Y') : null,
                ];
            });

        return response()->json($facilities);
    }

    public function apiShow(Facility $facility)
    {
        return response()->json([
            'id' => $facility->id,
            'title' => $facility->title,
            'slug' => $facility->slug,
            'category' => $facility->category,
            'excerpt' => $facility->excerpt,
            'content' => $facility->content,
            'image_url' => $facility->image_path,
            'published_at' => $facility->published_at ? $facility->published_at->format('d M Y') : null,
        ]);
    }
}