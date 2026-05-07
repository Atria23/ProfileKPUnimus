<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id',
        'name',
        'comment',
        'reaction',
        'is_visible',   // <-- Tambahkan ini
        'admin_reply',  // <-- Tambahkan ini
        'replied_at',   // <-- Tambahkan ini
    ];

    // Casts untuk memastikan tipe data benar
    protected $casts = [
        'is_visible' => 'boolean',
        'replied_at' => 'datetime',
    ];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }
}