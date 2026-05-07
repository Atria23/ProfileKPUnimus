<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;

// Definisikan Enum untuk type-safety (fitur PHP 8.1+)
// Jika menggunakan versi PHP lebih rendah, Anda bisa skip ini dan gunakan string biasa.
enum JobStatus: string
{
    case OPEN = 'open';
    case CLOSED = 'closed';
}

enum OpenUntilType: string
{
    case DATE = 'date';
    case UNDETERMINED = 'undetermined';
}

class JobVacancy extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'profession',
        'requirements',
        'required_documents',
        'status',
        'poster_image',
        'open_until_type',
        'open_until_date',
        'submission_channels',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'requirements' => 'array', // Otomatis cast JSON ke array PHP
        'required_documents' => 'array',
        'submission_channels' => AsArrayObject::class, // Cast ke ArrayObject untuk fleksibilitas
        'status' => JobStatus::class, // Menggunakan Enum (best practice)
        'open_until_type' => OpenUntilType::class, // Menggunakan Enum
        'open_until_date' => 'date',
    ];

    /**
     * Scope a query to only include open job vacancies.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }
}