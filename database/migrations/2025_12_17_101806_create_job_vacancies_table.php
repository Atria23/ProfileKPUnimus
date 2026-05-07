<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_vacancies', function (Blueprint $table) {
            $table->id();
            
            // 1. Profession (Wajib)
            $table->string('profession');

            // 2. Poster Image (Wajib - Hapus nullable)
            $table->string('poster_image'); 
            $table->longText('description');

            // 3. Sisanya Nullable (Opsional)
            $table->json('requirements')->nullable(); 
            $table->json('required_documents')->nullable(); 
            
            // Status default open, tapi kolomnya nullable secara teknis biar tidak error jika kosong
            $table->enum('status', ['open', 'closed'])->default('open')->nullable();
            
            $table->enum('open_until_type', ['date', 'undetermined'])->nullable();
            $table->date('open_until_date')->nullable();
            
            $table->json('submission_channels')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_vacancies');
    }
};