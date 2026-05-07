<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('article_reviews', function (Blueprint $table) {
            $table->id();
            // Menghubungkan ke artikel. Jika artikel dihapus, ulasannya juga ikut terhapus.
            $table->foreignId('article_id')->constrained()->cascadeOnDelete();
            
            $table->string('name')->nullable(); // Nama pengunjung (opsional)
            $table->text('comment')->nullable(); // Teks ulasan (opsional)
            $table->string('reaction')->nullable(); // Emoji reaksi: 😊, 😐, 😞 (opsional)
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('article_reviews');
    }
};