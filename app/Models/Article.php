<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany; // <-- Tambahkan import ini

class Article extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'title',
        'slug',
        'status',
        'author',
        'image_path',
        'excerpt',
        'content',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'content' => 'array', // Wajib agar Builder berfungsi
        'images' => 'array', // Jika ada kolom lain berbentuk array

        'status' => 'boolean', // <-- TAMBAHKAN INI

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
     * Relasi ke ulasan artikel.
     * PERUBAHAN: Secara default, relasi ini hanya akan mengambil ulasan yang 'is_visible'.
     */
    public function reviews(): HasMany
{
    // PERUBAHAN: Gunakan angka 1 untuk memfilter ulasan yang terlihat
    return $this->hasMany(ArticleReview::class);
}

// Relasi allReviews tidak perlu diubah
public function allReviews(): HasMany
{
    return $this->hasMany(ArticleReview::class);
}

protected static function booted()
{
    static::saving(function ($article) {
        logger()->info('MODEL: SAVING ARTICLE', [
            'content_count' => is_array($article->content)
                ? count($article->content)
                : null,
            'content' => $article->content,
        ]);
    });
}

}