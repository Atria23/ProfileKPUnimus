<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Inertia\Inertia;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request; // 1. Jangan lupa import Request

class AnnouncementController extends Controller
{
    /**
     * Menampilkan halaman daftar pengumuman dengan fitur pencarian.
     */
    public function index(Request $request) // 2. Tambahkan parameter Request
    {
        // 3. Mulai Query
        $query = Announcement::visible()->latest('published_at');

        // 4. Cek apakah ada pencarian
        if ($request->has('search') && $request->get('search') != '') {
    $keyword = $request->get('search');
    
    $query->where(function($q) use ($keyword) {
        // Ganti 'like' menjadi 'ilike' (khusus PostgreSQL/Supabase)
        $q->where('title', 'ilike', "%{$keyword}%")
          ->orWhere('excerpt', 'ilike', "%{$keyword}%");
    });
}

        // 5. Eksekusi Query
        $announcements = $query->get()
            ->map(fn ($announcement) => [
                'id' => $announcement->id,
                'slug' => $announcement->slug,
                'title' => $announcement->title,
                'excerpt' => $announcement->excerpt,
                'image_url' => $announcement->image_url, 
                'date' => Carbon::parse($announcement->published_at)->isoFormat('D MMMM YYYY'),
            ]);
            
        // 6. Return ke Inertia (sertakan 'filters' agar input search di frontend tetap terisi jika perlu)
        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements,
            'filters' => $request->only(['search']),
        ]);
    }
    
    public function show($slug)
    {
        // (Kode show Anda yang sudah ada tidak perlu diubah)
        $currentAnnouncement = Announcement::visible()
            ->where('slug', $slug)
            ->firstOrFail();

        $otherAnnouncements = Announcement::visible()
            ->where('slug', '!=', $slug)
            ->latest('published_at')->take(4)->get()
            ->map(fn ($announcement) => [
                'id' => $announcement->id,
                'slug' => $announcement->slug,
                'title' => $announcement->title,
                'image_url' => $announcement->image_url,
                'date' => Carbon::parse($announcement->published_at)->isoFormat('D MMMM YYYY'),
            ]);
        
        return Inertia::render('Announcements/Show', [
            'announcement' => [
                'id' => $currentAnnouncement->id,
                'slug' => $currentAnnouncement->slug,
                'title' => $currentAnnouncement->title,
                'content' => $currentAnnouncement->content,
                'image_url' => $currentAnnouncement->image_url,
                'date' => Carbon::parse($currentAnnouncement->published_at)->isoFormat('D MMMM YYYY'),
            ],
            'otherAnnouncements' => $otherAnnouncements,
        ]);
    }

    public function apiIndex(Request $request)
    {
        $query = Announcement::visible()->latest('published_at');

        if ($request->has('search') && $request->get('search') != '') {
            $keyword = $request->get('search');
            $query->where(function($q) use ($keyword) {
                // Ganti 'like' menjadi 'ilike' (khusus PostgreSQL/Supabase)
                $q->where('title', 'ilike', "%{$keyword}%")
                  ->orWhere('excerpt', 'ilike', "%{$keyword}%");
            });
        }

        $announcements = $query->get()
            ->map(fn ($announcement) => [
                'id' => $announcement->id,
                'slug' => $announcement->slug,
                'title' => $announcement->title,
                'status' => $announcement->status,
                'content' => $announcement->content,
                'excerpt' => $announcement->excerpt,
                'image_url' => $announcement->image_url,
                'published_at' => $announcement->published_at,
                'date' => Carbon::parse($announcement->published_at)->isoFormat('D MMMM YYYY'),
            ]);

        return response()->json($announcements);
    }

    /**
     * Mengembalikan detail satu pengumuman berdasarkan slug dalam format JSON untuk aplikasi mobile.
     */
    public function apiShow(Announcement $announcement) // INI JUGA SUDAH BENAR UNTUK DETAIL API
    {
        // Model Binding otomatis akan mencari berdasarkan slug dan menerapkan `firstOrFail()`

        // Query pengumuman lain
        $otherAnnouncements = Announcement::visible()
            ->where('slug', '!=', $announcement->slug)
            ->latest('published_at')
            ->take(4)
            ->get()
            ->map(fn ($oa) => [ // Menggunakan alias 'oa' agar tidak bentrok dengan $announcement
                'id' => $oa->id,
                'slug' => $oa->slug,
                'title' => $oa->title,
                'image_url' => $oa->image_url,
                'date' => Carbon::parse($oa->published_at)->isoFormat('D MMMM YYYY'),
            ]);

        return response()->json([
            'announcement' => [
                'id' => $announcement->id,
                'slug' => $announcement->slug,
                'title' => $announcement->title,
                'status' => $announcement->status,
                'content' => $announcement->content,
                'excerpt' => $announcement->excerpt,
                'image_url' => $announcement->image_url,
                'published_at' => $announcement->published_at,
                'date' => Carbon::parse($announcement->published_at)->isoFormat('D MMMM YYYY'),
            ],
            'otherAnnouncements' => $otherAnnouncements,
            
        ]);
    }
}