<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */ 
    public function up(): void
    {
        // 1. Tabel untuk riwayat pendidikan dokter
        Schema::create('doctor_educations', function (Blueprint $table) {
            $table->id();
            
            // Kolom foreign key yang terhubung ke tabel 'doctors'
            // onDelete('cascade') akan menghapus record ini jika dokter terkait dihapus
            $table->foreignId('doctor_id')->constrained()->onDelete('cascade');
            
            $table->string('degree'); // Contoh: "Dokter Umum", "Spesialis Anak"
            $table->string('institution'); // Contoh: "Universitas Indonesia"
            $table->year('year'); // Contoh: 2015
            $table->timestamps(); // Kolom created_at dan updated_at
        });

        // 2. Tabel untuk sub-spesialisasi dokter
        Schema::create('doctor_sub_specializations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Contoh: "Kardiologi Anak", "Nefrologi"
            $table->timestamps();
        });

        // 3. Tabel untuk pengalaman kerja dokter
        Schema::create('doctor_work_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->constrained()->onDelete('cascade');
            $table->string('position'); // Contoh: "Dokter Jaga IGD", "Kepala Departemen Anak"
            $table->string('place'); // Contoh: "RSUP Cipto Mangunkusumo"
            $table->string('period'); // Contoh: "2018 - 2022"
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        // Hapus tabel dalam urutan terbalik untuk menghindari error foreign key constraint
        Schema::dropIfExists('doctor_work_experiences');
        Schema::dropIfExists('doctor_sub_specializations');
        Schema::dropIfExists('doctor_educations');
    }
};