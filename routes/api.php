<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// PASTIKAN INI ADALAH PublicDoctorController
use App\Http\Controllers\PublicDoctorController; 
use App\Http\Controllers\ServiceController; // <-- TAMBAHKAN INI
use App\Http\Controllers\FacilityController; // <-- TAMBAHKAN INI
use App\Http\Controllers\ArticleController; // <-- TAMBAHKAN INI
use App\Http\Controllers\AnnouncementController; // <-- TAMBAHKAN INI
use App\Http\Controllers\Public\JobVacancyController; // <-- TAMBAHKAN INI (perhatikan namespace)
use App\Http\Controllers\ContactController; // <-- TAMBAHKAN INI
use App\Http\Controllers\ClinicAIController; // <-- TAMBAHKAN INI
use App\Models\PushToken;

Route::post('/save-push-token', function (Request $request) {
    $request->validate(['token' => 'required|string']);
    
    // Simpan token jika belum ada, atau update jika sudah ada
    PushToken::updateOrCreate(['token' => $request->token]);
    
    return response()->json(['success' => true]);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// === RUTE BARU UNTUK APLIKASI MOBILE, MENGGUNAKAN PublicDoctorController ===
Route::get('/doctors', [PublicDoctorController::class, 'apiIndex']);
Route::get('/doctors/{doctor}', [PublicDoctorController::class, 'apiShow']); // Menggunakan {doctor} untuk model binding

// === RUTE BARU UNTUK LAYANAN ===
Route::get('/services', [ServiceController::class, 'apiIndex']);
Route::get('/services/{service:slug}',[ServiceController::class, 'apiShow']);

Route::get('/facilities/perawatan', [FacilityController::class, 'apiIndexByCategory'])->name('api.facilities.perawatan')->defaults('category', 'Fasilitas Perawatan');
Route::get('/facilities/penunjang', [FacilityController::class, 'apiIndexByCategory'])->name('api.facilities.penunjang')->defaults('category', 'Fasilitas Penunjang');
// Untuk detail satu fasilitas (Model Binding akan bekerja dengan {facility})
Route::get('/facilities/{facility:slug}', [FacilityController::class, 'apiShow']);

// === RUTE BARU UNTUK ARTIKEL ===
Route::get('/articles', [ArticleController::class, 'apiIndex']);
Route::get('/articles/{article:slug}', [ArticleController::class, 'apiShow']); // Menggunakan {article:slug}
Route::post('/articles/{article:slug}/reviews', [ArticleController::class, 'apiStoreReview']);

Route::get('/announcements', [AnnouncementController::class, 'apiIndex']);
Route::get('/announcements/{announcement:slug}', [AnnouncementController::class, 'apiShow']);

// === RUTE BARU UNTUK LOWONGAN KERJA ===
Route::get('/job-vacancies', [JobVacancyController::class, 'apiIndex']);
Route::get('/job-vacancies/{jobVacancy}', [JobVacancyController::class, 'apiShow']); // Menggunakan {jobVacancy} (model binding)

Route::get('/contact-info', [ContactController::class, 'apiIndex']);

Route::post('/clinic-ai/query', [ClinicAIController::class, 'processQuery']);