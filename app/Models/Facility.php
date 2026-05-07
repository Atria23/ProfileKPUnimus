<?php
// app/Models/Facility.php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'excerpt',
        'content',
        'image_path',
        'status', // Ganti is_visible dengan status
        'published_at',
    ];

    protected $casts = [
        'status' => 'integer', // Cast sebagai integer agar konsisten
        'published_at' => 'datetime',
        'content' => 'array', // Ini memaksa output database menjadi Array, bukan String

    ];

    const CATEGORY_PERAWATAN = 'Fasilitas Perawatan';
    const CATEGORY_PENUNJANG = 'Fasilitas Penunjang';

    /**
     * Scope untuk hanya mengambil data yang statusnya 1 & sudah published.
     */
    public function scopeVisible(Builder $query)
    {
        // PERUBAHAN DI SINI: Menggunakan kolom status = 1
        return $query->where('status', 1)
                     ->where('published_at', '<=', now());
    }
}