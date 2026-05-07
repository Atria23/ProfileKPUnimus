<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Menampilkan daftar layanan.
     */
    public function index()
    {
        // Mengambil layanan visible, urutkan: Unggulan dulu, baru tanggal terbaru
        $services = Service::visible()
            ->orderBy('is_featured', 'desc') // Unggulan (1) di atas, Biasa (0) di bawah
            ->latest('published_at')
            // Tambahkan 'is_featured' ke dalam select
            ->get(['id', 'title', 'slug', 'excerpt','content', 'image_path', 'published_at', 'is_featured']);

        return Inertia::render('Service/Index', [
            'services' => $services,
        ]);
    }

    public function apiIndex()
    {
        $services = Service::visible()
            ->orderBy('is_featured', 'desc')
            ->latest('published_at')
            ->get(['id', 'title', 'slug', 'excerpt', 'content', 'image_path', 'published_at', 'is_featured'])
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'title' => $service->title,
                    'status' => $service->status,
                    'slug' => $service->slug,
                    'excerpt' => $service->excerpt,
                    'content' => $service->content,
                    'image_url' => $service->image_path, // Asumsi image_path sudah URL lengkap dari Supabase
                    'published_at' => $service->published_at ? $service->published_at->format('d M Y') : null,
                    'is_featured' => (bool) $service->is_featured, // Pastikan boolean
                ];
            });

        return response()->json($services);
    }
    
    // Jika Anda ingin detail layanan, Anda bisa tambahkan ini:
    public function apiShow(Service $service) // Model binding
    {
        return response()->json([
            'id' => $service->id,
            'title' => $service->title,
            'slug' => $service->slug,
            'status' => $service->status,
            'excerpt' => $service->excerpt,
            'content' => $service->content,
            'image_url' => $service->image_path,
            'published_at' => $service->published_at ? $service->published_at->format('d M Y') : null,
            'is_featured' => (bool) $service->is_featured,
        ]);
    }
    
}