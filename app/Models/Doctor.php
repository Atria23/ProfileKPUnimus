<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'specialization',
        'image_path', // Akan diisi dengan URL lengkap dari Supabase
        'description',
        'schedule',
    ];

    protected $casts = [        
        'schedule' => 'array', // <-- PENTING
        'specialization' => 'array', // <-- PASTIKAN BARIS INI ADA DAN DI-SET SEBAGAI ARRAY
    ];

    /**
     * Get the full URL for the doctor's photo from Supabase.
     */
    public function getImageUrlAttribute()
    {
        // Langsung kembalikan path karena sudah berisi URL lengkap
        return $this->image_path;
    }

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = ['image_url'];

    public function educations()
    {
        return $this->hasMany(DoctorEducation::class);
    }

    public function subSpecializations()
    {
        return $this->hasMany(DoctorSubSpecialization::class);
    }

    public function workExperiences()
    {
        return $this->hasMany(DoctorWorkExperience::class);
    }
}