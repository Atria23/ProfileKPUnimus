<?php
// database/migrations/xxxx_xx_xx_create_facilities_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category'); 
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable(); 
            $table->string('image_path')->nullable();
            
            // PERUBAHAN DI SINI: Menggunakan tinyInteger untuk status
            $table->tinyInteger('status')->default(1)->comment('1 = Tampil, 0 = Sembunyi');
            
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facilities');
    }
};