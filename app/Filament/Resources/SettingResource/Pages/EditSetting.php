<?php

namespace App\Filament\Resources\SettingResource\Pages;

use App\Filament\Resources\SettingResource;
use App\Models\Setting;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;
use Filament\Resources\Pages\Concerns\Has; // Perbaikan typo, seharusnya HasHeader
use Filament\Pages\Actions\Action;
use Filament\Forms\Contracts\HasForms;
use Filament\Resources\Pages\Concerns\InteractsWithRecord;

class EditSetting extends EditRecord
{
    use InteractsWithRecord; // Menggunakan trait yang benar

    protected static string $resource = SettingResource::class;

    // --- Override metode ini untuk selalu mengambil record pertama ---
    protected function resolveRecord(int | string $record): Model
    {
        // Ambil record pertama, atau buat baru jika tidak ada sama sekali.
        return Setting::firstOrCreate([]);
    }

    // --- Hapus semua tombol action di header ---
    protected function getHeaderActions(): array
    {
        return [];
    }

    // --- Hapus breadcrumbs untuk mencegah error RouteNotFound ---
    public function getBreadcrumbs(): array
    {
        return [];
    }

    // --- Mencegah tombol delete tampil ---
    protected function getDeleteFormAction(): ?Action
    {
        return null;
    }

    // --- Mengatur judul halaman ---
    public function getTitle(): string
    {
        return 'Pengaturan Website';
    }
}