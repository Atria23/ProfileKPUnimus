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
        Schema::table('article_reviews', function (Blueprint $table) {
            // DIUBAH: Menggunakan tinyInteger untuk menghindari masalah kompatibilitas PostgreSQL.
            // Konvensi: 1 = Terlihat, 0 = Tersembunyi
            $table->tinyInteger('is_visible')->default(1)->after('reaction');

            // Kolom untuk menyimpan balasan dari admin.
            $table->text('admin_reply')->nullable()->after('is_visible');

            // Kolom untuk menandai kapan balasan diberikan.
            $table->timestamp('replied_at')->nullable()->after('admin_reply');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('article_reviews', function (Blueprint $table) {
            $table->dropColumn(['is_visible', 'admin_reply', 'replied_at']);
        });
    }
};