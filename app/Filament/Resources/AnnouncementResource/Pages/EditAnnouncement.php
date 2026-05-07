<?php

namespace App\Filament\Resources\AnnouncementResource\Pages;

use App\Filament\Resources\AnnouncementResource;
use Filament\Resources\Pages\EditRecord;

class EditAnnouncement extends EditRecord
{
    protected static string $resource = AnnouncementResource::class;

    protected function afterSave(): void
    {
        $record = $this->record;

        // Kirim notifikasi jika status diubah jadi tampilkan
        // Anda bisa menambahkan logika pengecekan jika hanya ingin kirim sekali saja
        if ($record->status == 1) {
            AnnouncementResource::sendExpoNotification($record);
        }
    }
}