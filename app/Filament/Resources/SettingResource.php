<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SettingResource\Pages;
use App\Models\Setting;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Group;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\HtmlString;
use App\Traits\RestrictedResource; // <--- 1. Import Trait
use App\Models\User; // <--- 1. Import User

class SettingResource extends Resource
{
    use RestrictedResource; // <--- 2. Pakai Trait

    // <--- 3. Daftar Role (Mirip Middleware)
    protected static ?array $allowedRoles = [
        User::ROLE_HUMAS, 
        // Super Admin sudah otomatis boleh di Trait
    ];

    protected static ?string $model = Setting::class;
    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';
    protected static ?string $navigationLabel = 'Pengaturan Website';
    protected static ?string $navigationGroup = 'Konten Website';


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                // ... Section Visi & Misi, Kontak, Lokasi tidak berubah ...
                Section::make('Visi & Misi')->collapsible()->schema([
                    Textarea::make('vision')->label('Visi Perusahaan')->rows(1)->required(),
                    Repeater::make('mission')
    ->label('Misi Perusahaan')
    ->required()
    ->schema([
        Textarea::make('content')
            ->label(false)
            ->rows(2),
    ])
    ->itemLabel(function (array $state, string $uuid, Repeater $component): string {
        $keys = array_keys($component->getState() ?? []);
        $index = array_search($uuid, $keys, true);

        return 'Misi ' . ($index + 1);
    })
    ->addActionLabel('Tambah Poin')
    ->reorderable()          // hanya drag
    ->collapsible()
    ->cloneable()
    ->columnSpanFull(),
                ]),

                Section::make('Informasi Kontak')->collapsible()->schema([
                    TextInput::make('whatsapp_registration')->label('Nomor WA Pendaftaran Online')->prefix('+')->tel()->required(),
                    TextInput::make('whatsapp_information')->label('Nomor WA Pusat Informasi')->prefix('+')->tel()->required(),
                    TextInput::make('email')->label('Alamat Email Kontak')->email()->required()->columnSpan('full'),
                ]),

                Section::make('Lokasi & Peta')->collapsible()->schema([
                    Textarea::make('address')->label('Alamat Lengkap')->rows(3)->required(),
                    TextInput::make('google_maps_link')->label('Link Embed Google Maps')->url()->required(),
                ]),

                Section::make('Media Sosial')
                    ->collapsible()
                    ->schema([
                        Repeater::make('social_media')
                            ->hiddenLabel()
                            ->addActionLabel('Tambah Media Sosial')
                            ->schema([
                                TextInput::make('platform')->label('Platform')->required()->columnSpan(1),
                                TextInput::make('link')->label('Link URL')->url()->required()->columnSpan(1),
                                
                                Group::make()->schema([
                                    // Placeholder ini TETAP membaca dari 'icon', karena itu adalah sumber data yang benar
                                    Placeholder::make('icon_preview')
                                        ->label('Ikon Saat Ini')
                                        ->content(function ($get): ?HtmlString {
                                            $iconUrl = $get('icon'); // Tetap get('icon')
                                            if ($iconUrl && is_string($iconUrl)) {
                                                $html = '<img src="' . e($iconUrl) . '" alt="Ikon preview" style="max-width: 100px; height: auto; border-radius: 4px;"/>';
                                                return new HtmlString($html);
                                            }
                                            return null;
                                        })
                                        ->visible(function ($get): bool {
                                            $iconValue = $get('icon'); // Tetap get('icon')
                                            return is_string($iconValue) && !empty($iconValue);
                                        }),

                                    // [UBAH] FileUpload diberi nama baru agar tidak konflik saat memuat data
                                    FileUpload::make('icon_upload') 
                                        ->label(fn ($get) => (is_string($get('icon')) && !empty($get('icon'))) ? 'Ganti Ikon' : 'Unggah Ikon')
                                        ->helperText('Unggah file baru untuk mengganti ikon yang ada.')
                                        ->image()
                                        // Logika required tetap membaca dari 'icon'
                                        ->required(function ($get): bool {
                                            $iconValue = $get('icon');
                                            if (is_string($iconValue) && str_starts_with($iconValue, 'http')) {
                                                return false;
                                            }
                                            return true;
                                        })
                                        // Logika upload tidak berubah
                                        ->saveUploadedFileUsing(function (UploadedFile $file): ?string {
                                            $fileName = time() . '_' . $file->getClientOriginalName();
                                            $bucketFolder = 'web-profile';
                                            $response = Http::withHeaders(['apikey' => env('SUPABASE_KEY'), 'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),])->withBody(file_get_contents($file->getRealPath()), $file->getMimeType())->post(env('SUPABASE_URL') . '/storage/v1/object/' . $bucketFolder . '/' . $fileName);
                                            if ($response->failed()) { throw new \Exception('Unggah ikon ke Supabase gagal: ' . $response->body()); }
                                            return env('SUPABASE_URL') . '/storage/v1/object/public/' . $bucketFolder . '/' . $fileName;
                                        })
                                        // Delete tetap berjalan pada field 'icon', tapi kita akan atur ini di logic penyimpanan
                                        ->deleteUploadedFileUsing(function (?string $state): void {
                                            // Saat ini, $state akan berasal dari 'icon_upload', yang mana kosong saat load
                                            // Logic hapus yang benar harus menangani state dari 'icon'
                                            // Namun untuk saat ini, fokus pada penyimpanan dulu.
                                        }),
                                ])->columnSpan(2),

                            ])
                            ->columns(2)
                            // [BARU] Logika untuk memproses data SEBELUM disimpan
                            ->mutateDehydratedStateUsing(function (?array $state): ?array {
                                if (empty($state)) {
                                    return $state;
                                }

                                foreach ($state as $key => $item) {
                                    // Jika ada file baru yang diunggah di 'icon_upload'
                                    if (isset($item['icon_upload'])) {
                                        // Pindahkan URL nya ke field 'icon' yang asli
                                        $state[$key]['icon'] = $item['icon_upload'];
                                    }
                                    // Hapus key sementara agar tidak ikut tersimpan ke database
                                    unset($state[$key]['icon_upload']);
                                }

                                Log::info('Data Social Media yang AKAN DISIMPAN (setelah dimutasi):', $state);
                                return $state;
                            }),
                    ]),
            ]);
    }
    
    // ... Metode lainnya tidak berubah ...
    public static function getPages(): array { return [ 'edit' => Pages\EditSetting::route('/{record}/edit'), ]; }
    public static function getNavigationUrl(): string { return static::getUrl('edit', ['record' => Setting::firstOrCreate([])->id ?? 1]); }
    public static function canCreate(): bool { return false; }
}