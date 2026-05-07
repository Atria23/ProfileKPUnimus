<?php

// database/migrations/xxxx_xx_xx_create_services_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->text('content'); // Rich text
            $table->string('image_path')->nullable();
            
            // Kolom Status (Publikasi)
            $table->tinyInteger('status')->default(1)->comment('1 = Tampil, 0 = Sembunyi');

            // Kolom Layanan Unggulan (Baru ditambahkan)
            // Default 0 artinya secara default layanan tersebut adalah layanan biasa (bukan unggulan)
            $table->tinyInteger('is_featured')->default(0)->comment('1 = Unggulan, 0 = Biasa');

            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};