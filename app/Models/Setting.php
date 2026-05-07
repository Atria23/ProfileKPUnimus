<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'vision',
        'mission',
        'whatsapp_registration',
        'whatsapp_information',
        'address',
        'google_maps_link',
        'social_media',
        'email',
    ];

    protected $casts = [
        // Ini akan secara otomatis mengubah array PHP ke JSON saat menyimpan,
        // dan sebaliknya saat mengambil data.
        'social_media' => 'array',
        'mission' => 'array',
    ];
}