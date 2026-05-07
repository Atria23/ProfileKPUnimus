<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

// Import Controllers
use App\Http\Controllers\PublicDoctorController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ClinicAIController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ContactController;

// use App\Http\Controllers\DoctorController
// Bisa dihapus jika tidak dipakai di web.php lagi
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\Public\JobVacancyController;
use App\Http\Controllers\Public\JobApplicationController;
use App\Http\Controllers\FacilityController;
use App\Models\User;


Route::get('/test-session', function () {
    session(['test' => 'ok']);
    return session('test');
});

Route::middleware(['role:super_admin,kepala_rt,staff_rt,direktur,keuangan'])->group(function () {
});

Route::get('/bpjs', function () {
    return Inertia::render('Bpjs/Index');
})->name('bpjs');

// Rute Fasilitas Perawatan
Route::get('/fasilitas/perawatan', [FacilityController::class, 'perawatan'])
    ->name('facilities.care');

// Rute Fasilitas Penunjang
Route::get('/fasilitas/penunjang', [FacilityController::class, 'penunjang'])
    ->name('facilities.support');

// Rute Detail (Pastikan ditaruh di paling bawah agar tidak bentrok dengan slug)
Route::get('/fasilitas/{slug}', [FacilityController::class, 'show'])
    ->name('facilities.show');
    
Route::get('/careers', [JobVacancyController::class, 'index'])->name('jobs.index');
Route::get('/careers/{jobVacancy:id}', [JobVacancyController::class, 'show'])->name('jobs.show');

// Route untuk submit lamaran
Route::post('/careers/{jobVacancy:id}/apply', [JobApplicationController::class, 'store'])->name('jobs.apply');

// --- Halaman Pengumuman ---
Route::get('/pengumuman', [AnnouncementController::class, 'index'])->name('announcements.index');
Route::get('/pengumuman/{slug}', [AnnouncementController::class, 'show'])->name('announcements.show');

// Route untuk halaman pendaftaran
Route::get('/pendaftaran', [RegistrationController::class, 'index'])->name('registration.index');

// --- Halaman Utama ---
Route::get('/', [LandingPageController::class, 'index'])->name('home');

// --- Halaman Dokter (Public) ---
// Menggunakan PublicDoctorController
// Halaman List Dokter
Route::get('/doctors', [PublicDoctorController::class, 'index'])->name('doctors.index');

// Halaman Detail Dokter
Route::get('/doctors/{doctor}', [PublicDoctorController::class, 'show'])->name('doctors.show');

// --- Halaman Artikel ---
Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
Route::get('/articles/{slug}', [ArticleController::class, 'show'])->name('articles.show');
// --- RUTE BARU UNTUK MENYIMPAN ULASAN ---
Route::post('/articles/{article:slug}/reviews', [ArticleController::class, 'storeReview'])->name('articles.reviews.store');

// --- Halaman Layanan ---
Route::get('/layanan', [ServiceController::class, 'index'])->name('services.index');

// --- Halaman Kontak ---
Route::get('/contact', [ContactController::class, 'index'])->name('contact');

// --- Fitur AI / Chatbot ---
Route::get('/ai-chat', function () {
    return Inertia::render('AI/ChatInterface');
})->name('ai.chat');

Route::post('/clinic-ai/ask', [ClinicAIController::class, 'processQuery'])->name('ai.ask');

// --- Update Profil Dokter (Backend/Post Update) ---
Route::post('/doctor-profiles/{doctorProfile}', [DoctorController::class, 'update'])->name('doctor-profiles.post-update');