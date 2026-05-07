<?php

namespace App\Filament\Resources;

use App\Filament\Resources\JobVacancyResource\Pages;
use App\Models\JobVacancy;
use App\Models\JobStatus;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Get;
use Filament\Forms\Components\ToggleButtons; 
use Illuminate\Support\Facades\Http; // Penting untuk Supabase
use Illuminate\Http\UploadedFile;      // Penting untuk Supabase
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\HtmlString;
use Filament\Forms\Components\Placeholder;
use App\Models\Setting;
use Filament\Forms\Set;
use Filament\Tables\Columns\ImageColumn;
use App\Traits\RestrictedResource; // <--- 1. Import Trait
use App\Models\User; // <--- 1. Import User

class JobVacancyResource extends Resource
{
    use RestrictedResource; // <--- 2. Pakai Trait

    // <--- 3. Daftar Role (Mirip Middleware)
    protected static ?array $allowedRoles = [
        User::ROLE_HUMAS, 
        // Super Admin sudah otomatis boleh di Trait
    ];

    protected static ?string $model = JobVacancy::class;
    protected static ?string $navigationLabel = 'Lowongan Pekerjaan';
    protected static ?string $navigationIcon = 'heroicon-o-briefcase';

public static function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\Group::make()
                ->schema([
                    Forms\Components\Section::make('Detail Pekerjaan')
                        ->schema([
                            // WAJIB
                            Forms\Components\TextInput::make('profession')
                                ->label('Profesi / Posisi')
                                ->required() 
                                ->maxLength(255),
                            Forms\Components\RichEditor::make('description')
                                ->label('Deskripsi Lowongan')
                                ->required()
                                ->columnSpanFull(),

                            Forms\Components\Section::make('Poster Lowongan')
                                ->schema([
                                    Placeholder::make('image_preview')
                                        ->label('Poster Saat Ini')
                                        ->content(function (?Model $record): ?HtmlString {
                                            if ($record && $record->poster_image) {
                                                $html = '<img src="' . e($record->poster_image) . '" alt="Poster Saat Ini" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #ddd;">';
                                                return new HtmlString($html);
                                            }
                                            return null;
                                        })
                                        ->visible(fn (?Model $record) => $record && $record->poster_image),

                                    // WAJIB (Hapus required context create, jadi required selalu)
                                    Forms\Components\FileUpload::make('poster_image')
                                        ->label('Poster Lowongan (Wajib)') // Ubah label
                                        ->image()
                                        ->maxSize(5120)
                                        // WAJIB: Required jika di database kosong
                                        ->required(fn (?Model $record) => blank($record?->poster_image))
                                        
                                        // Dehydrated logic agar gambar tidak hilang saat edit
                                        ->dehydrated(fn ($state) => filled($state))

                                        ->saveUploadedFileUsing(function (UploadedFile $file): ?string {
                                            $fileName = time() . '_' . $file->getClientOriginalName();
                                            $bucketFolder = 'web-profile';

                                            $response = Http::withHeaders([
                                                'apikey' => env('SUPABASE_KEY'),
                                                'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
                                                'Content-Type' => $file->getMimeType(),
                                            ])->withBody(
                                                file_get_contents($file->getRealPath()),
                                                $file->getMimeType()
                                            )->post(env('SUPABASE_URL') . '/storage/v1/object/' . $bucketFolder . '/' . $fileName);

                                            if ($response->failed()) {
                                                throw new \Exception('Unggah foto ke Supabase gagal: ' . $response->body());
                                            }
                                            
                                            return env('SUPABASE_URL') . '/storage/v1/object/public/' . $bucketFolder . '/' . $fileName; 
                                        })
                                        ->deleteUploadedFileUsing(function (?string $state): void {
                                            if (blank($state)) return;
                                            $baseUrl = env('SUPABASE_URL') . '/storage/v1/object/public/';
                                            $filePath = str_replace($baseUrl, '', $state);
                                            
                                            Http::withHeaders([
                                                'apikey' => env('SUPABASE_KEY'),
                                                'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
                                            ])->delete(env('SUPABASE_URL') . '/storage/v1/object/' . $filePath);
                                        }),
                                ]),

                            // TIDAK WAJIB (Hapus ->required())
                            Forms\Components\Repeater::make('requirements')
                                ->label('Persyaratan Kualifikasi')
                                ->schema([
                                    Forms\Components\TextInput::make('requirement_text')
                                        ->label('Poin Persyaratan'), 
                                ])
                                ->addActionLabel('Tambah Poin')
                                ->columns(1),

                            // TIDAK WAJIB
                            Forms\Components\Repeater::make('required_documents')
                                ->label('Berkas Lamaran yang Dibutuhkan')
                                ->schema([
                                    Forms\Components\TextInput::make('document_name')
                                        ->label('Nama Berkas')
                                        ->placeholder('Contoh: CV, KTP, Portofolio'),
                                ])
                                ->addActionLabel('Tambah Berkas')
                                ->columns(1),

                        ]),
                ])
                ->columnSpan(['lg' => 2]),
                
            Forms\Components\Group::make()
    ->schema([
        Forms\Components\Section::make('Status & Kanal')
            ->schema([
                Forms\Components\Select::make('status')
                    ->options([
                        'open' => 'Dibuka',
                        'closed' => 'Ditutup',
                    ])
                    ->default('open')
                    ->helperText('Atur status lowongan. Pilih "Ditutup" jika sudah tidak menerima lamaran.'),

                Forms\Components\Radio::make('open_until_type')
                    ->label('Jenis Batas Waktu')
                    ->options([
                        'undetermined' => 'Tidak Ditentukan',
                        'date' => 'Sampai Tanggal Tertentu',
                    ])
                    ->live()
                    ->reactive()
                    ->helperText('Tentukan apakah lowongan dibuka tanpa batas waktu atau sampai tanggal tertentu.'),

                Forms\Components\DatePicker::make('open_until_date')
                    ->label('Batas Waktu Hingga')
                    ->visible(fn (Get $get) => $get('open_until_type') === 'date')
                    ->helperText('Isi hanya jika memilih batas waktu berdasarkan tanggal.'),
                    
    Forms\Components\Repeater::make('submission_channels')
    ->label('Kanal Pengiriman')
    ->helperText('Tambahkan kanal tempat pelamar mengirim lamaran.')
    

    ->schema([
        ToggleButtons::make('type')
            ->label('Tipe Kanal')
            ->options([
                'email' => 'Email',
                'whatsapp' => 'WhatsApp',
            ])
            ->icons([
                'email' => 'heroicon-o-envelope',
                'whatsapp' => 'heroicon-o-chat-bubble-left-right',
            ])
            ->colors([
                'email' => 'info',
                'whatsapp' => 'success',
            ])
            ->inline()
            ->live() // Wajib live
            ->distinct()
            ->disableOptionsWhenSelectedInSiblingRepeaterItems()
            // Logic ini tetap ada agar jika Anda ganti ke WA lalu balik ke Email, datanya terisi lagi
            ->afterStateUpdated(function ($state, Set $set) {
                $setting = Setting::first();

                if ($state === 'email') {
                    $set('value', $setting?->email);
                } elseif ($state === 'whatsapp') {
                    $set('value', $setting?->whatsapp_information);
                }
            }),

            Forms\Components\TextInput::make('value')
            ->label(fn (Get $get) => match ($get('type')) {
                'email' => 'Alamat Email Tujuan',
                'whatsapp' => 'Nomor WhatsApp Tujuan',
                default => 'Tujuan',
            })
            // Validasi & Tipe Input
            ->email(fn (Get $get) => $get('type') === 'email')
            ->tel(fn (Get $get) => $get('type') === 'whatsapp')
            ->regex(fn (Get $get) => $get('type') === 'whatsapp' ? '/^[0-9]+$/' : null)
            
            ->required()
            ->live()
            
            // === TAMBAHAN PENTING: AUTO-FILL SAAT HALAMAN DIBUKA ===
            ->afterStateHydrated(function ($component, $state, Get $get) {
                // Jika kolom value sudah ada isinya, jangan diapa-apakan
                if (filled($state)) return;

                // Jika kosong, cek tipe-nya dan ambil dari Setting
                $type = $get('type');
                $setting = Setting::first();

                if ($type === 'email' && $setting?->email) {
                    $component->state($setting->email);
                } elseif ($type === 'whatsapp' && $setting?->whatsapp_information) {
                    $component->state($setting->whatsapp_information);
                }
            })
            // ========================================================

            ->helperText(fn (Get $get) => match ($get('type')) {
                'email' => 'Pastikan alamat email valid (Default dari Pengaturan).',
                'whatsapp' => 'Format angka saja tanpa simbol dengan awalan 62, contohnya 62812345678.',
                default => 'Masukkan tujuan pengiriman.',
            }),
    ])
    ->minItems(1)
    ->maxItems(2)
    ->columns(1),

            ]),
    ])
    ->columnSpan(['lg' => 1]),

        ])
        ->columns(3);
}

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                // --- TAMBAHAN BARU: PREVIEW GAMBAR DI TABEL ---
                ImageColumn::make('poster_image')
                ->label('Thumb')
                ->square()
                ->size(48)
                ->getStateUsing(function ($record) {
            
                    $value = $record->poster_image;
                    // Normalisasi kalau ternyata array
                    if (is_array($value)) {
                        $value = $value[0] ?? null;
                    }
            
                    // Pastikan string URL
                    if (is_string($value) && str_starts_with($value, 'http')) {
                        // 🔑 INI KUNCI UTAMA: encode spasi
                        return str_replace(' ', '%20', $value);
                    }
            
                    return null;
                })
                ->extraImgAttributes([
                    'class' => 'object-cover',
                ]),
                // ----------------------------------------------

                Tables\Columns\TextColumn::make('profession')
                    ->label('Profesi')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (JobStatus $state): string => match ($state) {
                        JobStatus::OPEN => 'success',
                        JobStatus::CLOSED => 'danger',
                    })
                    ->formatStateUsing(fn (JobStatus $state): string => ucfirst($state->value)),

                Tables\Columns\TextColumn::make('open_until_date')
                    ->label('Batas Waktu')
                    ->date('d F Y')
                    ->placeholder('Tidak ditentukan')
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'open' => 'Dibuka',
                        'closed' => 'Ditutup',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
    
    public static function getPages(): array
    {
        return [
            'index' => Pages\ListJobVacancies::route('/'),
            'create' => Pages\CreateJobVacancy::route('/create'),
            'edit' => Pages\EditJobVacancy::route('/{record}/edit'),
        ];
    }    
}