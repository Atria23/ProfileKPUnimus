<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();

            // --- PERUBAHAN DI SINI ---
            // Menggunakan tinyInteger untuk status. Konvensi: 1 = Tampil, 0 = Sembunyi/Draft
            $table->tinyInteger('status')->default(1)->comment('1 = Tampil, 0 = Sembunyi');

            $table->text('excerpt'); // Ringkasan singkat untuk preview
            $table->longText('content'); // Konten utama pengumuman
            $table->string('image_path')->nullable(); // Path ke gambar banner pengumuman
            $table->timestamp('published_at')->nullable(); // Tanggal publikasi
            $table->timestamps(); // Kolom created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};