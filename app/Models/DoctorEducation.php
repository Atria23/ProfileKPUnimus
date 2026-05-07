<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorEducation extends Model
{
    use HasFactory;
    protected $table = 'doctor_educations';
    protected $fillable = ['doctor_id', 'degree', 'institution', 'year'];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'degree' => 'array',      // <-- TAMBAHKAN INI
        'institution' => 'array', // <-- TAMBAHKAN INI
    ];
}