<?php

namespace App\Filament\Resources\AnnouncementResource\Traits;

use App\Filament\Resources\AnnouncementResource;

trait HandlesGalleryForm
{
    /**
     * Aksi Livewire untuk menghapus gambar dari state galeri.
     *
     * @param string $blockUuid UUID dari blok builder 'gallery'.
     * @param int $imageKey Index dari gambar yang akan dihapus.
     * @return void
     */
    public function removeGalleryImage(string $blockUuid, int $imageKey): void
    {
        // 1. Ambil state 'content' dari properti data Livewire.
        $content = $this->data['content'];

        // 2. Cari blok yang sesuai berdasarkan UUID-nya.
        if (isset($content[$blockUuid]) && $content[$blockUuid]['type'] === 'gallery') {
            $images = $content[$blockUuid]['data']['images'] ?? [];

            // 3. Jika gambar ada di index tersebut, hapus.
            if (isset($images[$imageKey])) {
                // Hapus file dari Supabase.
                AnnouncementResource::deleteFromSupabase($images[$imageKey]);

                // Hapus dari array state.
                unset($images[$imageKey]);
            }

            // 4. Perbarui state 'images' di dalam blok tersebut.
            // array_values() penting untuk mengurutkan ulang index array (0, 1, 2, ...).
            $this->data['content'][$blockUuid]['data']['images'] = array_values($images);
        }
    }
}