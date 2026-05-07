<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->text('vision')->nullable();
            $table->json('mission')->nullable(); 
            $table->string('whatsapp_registration')->nullable();
            $table->string('whatsapp_information')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->text('google_maps_link')->nullable(); // Untuk link embed iframe
            $table->json('social_media')->nullable(); // Untuk menyimpan platform, link, dan ikon
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};