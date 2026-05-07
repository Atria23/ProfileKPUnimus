<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorSubSpecialization extends Model
{
    use HasFactory;
    protected $table = 'doctor_sub_specializations';
    protected $fillable = ['doctor_id', 'name'];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'name' => 'array', // <-- TAMBAHKAN INI
    ];
}