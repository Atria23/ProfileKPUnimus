<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Announcement extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'title',
        'slug',
        'status',
        'excerpt',
        'content',      // Akan berisi Builder JSON
        'image_path',   // Akan menjadi thumbnail tunggal
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'status' => 'integer',
        'content' => 'array', // <-- PERUBAHAN UTAMA: content sekarang adalah array/JSON
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    /**
     * Accessor untuk thumbnail utama, mengambil dari kolom image_path.
     */
    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->image_path,
        );
    }

    public function scopeVisible($query)
    {
        return $query->where('status', 1)
                     ->where('published_at', '<=', now());
    }
}