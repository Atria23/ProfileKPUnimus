<?php

namespace App\Filament\Resources\AnnouncementResource\Pages;

use App\Filament\Resources\AnnouncementResource;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Log;

class CreateAnnouncement extends CreateRecord
{
    protected static string $resource = AnnouncementResource::class;

    /**
     * Hook yang dijalankan SETELAH data berhasil dibuat
     */
    protected function afterCreate(): void
    {
        $record = $this->record;

        // Log awal: memastikan hook benar-benar terpanggil
        Log::info('afterCreate triggered', [
            'announcement_id' => $record->id,
            'status' => $record->status,
            'title' => $record->title ?? null,
        ]);

        // Hanya kirim notifikasi jika statusnya 'Tampilkan' (1)
        if ($record->status == 1) {

            Log::info('Status valid, mencoba kirim notifikasi', [
                'announcement_id' => $record->id,
            ]);

            try {
                $result = AnnouncementResource::sendExpoNotification($record);

                // Log hasil response dari function
                Log::info('Hasil sendExpoNotification', [
                    'announcement_id' => $record->id,
                    'result' => $result,
                ]);

            } catch (\Throwable $e) {

                // Log jika terjadi error
                Log::error('Gagal kirim notifikasi', [
                    'announcement_id' => $record->id,
                    'error' => $e->getMessage(),
                ]);
            }

        } else {
            Log::info('Notifikasi tidak dikirim (status != 1)', [
                'announcement_id' => $record->id,
                'status' => $record->status,
            ]);
        }
    }
    
    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}