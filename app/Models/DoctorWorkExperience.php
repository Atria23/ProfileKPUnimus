<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorWorkExperience extends Model
{
    use HasFactory;
    protected $table = 'doctor_work_experiences';
    protected $fillable = ['doctor_id', 'position', 'place', 'period'];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'place' => 'array', // <-- TAMBAHKAN INI
    ];
}