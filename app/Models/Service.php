<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Service extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'title',
        'slug',
        'status',
        'is_featured', // Tambahkan ini
        'excerpt',
        'content',
        'image_path',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'status' => 'integer',
        'is_featured' => 'integer', // Tambahkan casting ini
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->image_path,
        );
    }

    /**
     * Scope untuk mengambil Layanan yang Statusnya Tampil & Tanggalnya sudah lewat.
     */
    public function scopeVisible($query)
    {
        return $query->where('status', 1)
                     ->where('published_at', '<=', now());
    }

    /**
     * Scope khusus untuk mengambil layanan unggulan.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', 1);
    }
}