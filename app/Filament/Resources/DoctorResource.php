<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DoctorResource\Pages;
use App\Models\Doctor;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\TimePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Tables;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\HtmlString;
use Filament\Forms\Components\Group;
use App\Traits\RestrictedResource; // <--- 1. Import Trait
use App\Models\User; // <--- 1. Import User

class DoctorResource extends Resource
{
    use RestrictedResource; // <--- 2. Pakai Trait

    // <--- 3. Daftar Role (Mirip Middleware)
    protected static ?array $allowedRoles = [
        User::ROLE_HUMAS, 
        // Super Admin sudah otomatis boleh di Trait
    ];

    protected static ?string $model = Doctor::class;
    protected static ?string $navigationIcon = 'heroicon-o-user-group';
    protected static ?string $navigationLabel = 'Profil Dokter';
    protected static ?string $modelLabel = 'Dokter';

    public static function form(Form $form): Form
    {
        // Variabel-variabel ini tidak diubah
        $universities = Cache::get('form_data_universities', []);
        $workplaces = Cache::get('form_data_workplaces', []);
        $degrees = ['S.Ked (Sarjana Kedokteran)', 'dr. (Dokter)', /* ... etc */ ];
        $medicalSubspecialties = ['Alergi-Imunologi Klinis', 'Andrologi', /* ... etc */ ];
        $days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
        
        // Gabungkan saran untuk spesialisasi dan layanan umum
        $specializationAndServicesSuggestions = [
            // Spesialisasi
            'Dokter Umum', 'Dokter Anak', 'Dokter Gigi', 'Dokter Kandungan & Ginekologi', 'Dokter Penyakit Dalam',
            // Layanan Umum
            'Konsultasi Umum', 'Pemeriksaan Kesehatan', 'Scalling Gigi', 'Tambal Gigi', 'Cabut Gigi', 'USG Kehamilan', 'Imunisasi Anak', 'Khitan', 'Perawatan Luka'
        ];
        

        return $form
            ->schema([
                Section::make('Informasi Utama Dokter')->schema([
                    Grid::make(2)->schema([
                        TextInput::make('name')->required()->label('Nama Lengkap Dokter')->placeholder('Contoh: Dr. Budi Santoso, Sp.A')->maxLength(255),
                        
                        TagsInput::make('specialization')
                            ->required()
                            ->label('Spesialisasi & Layanan')
                            ->placeholder('Tambah spesialisasi/layanan')
                            ->helperText('Item pertama akan jadi spesialisasi utama. Tekan Enter untuk menambah item baru.')
                            ->suggestions($specializationAndServicesSuggestions)
                    ]),
                    
                    Textarea::make('description')->label('Deskripsi / Biografi Singkat')->placeholder('Jelaskan tentang dokter, keahlian, dan pendekatan terhadap pasien.')->rows(4)->columnSpan('full'),
                    
                    Section::make('Foto Saat Ini')
                        ->schema([
                            Placeholder::make('image_preview')
                                ->label('')
                                ->content(function (?Model $record): HtmlString {
                                    if ($record && $record->image_path) {
                                        $html = '<img src="' . e($record->image_path) . '" alt="Foto Dokter" style="max-width: 200px; height: auto; border-radius: 8px;">';
                                        return new HtmlString($html);
                                    }
                                    return new HtmlString('<span>Tidak ada foto.</span>');
                                })
                        ])
                        ->visible(fn (?Model $record) => $record && $record->exists && $record->image_path),

                    FileUpload::make('image_path')
                        ->label('Foto Dokter')
                        ->image()
                        ->nullable()
                        ->columnSpan('full')
                        // === PERBAIKAN DI SINI: Mencegah path gambar terhapus saat edit ===
                        ->dehydrated(fn ($state) => filled($state))
                        // ================================================================
                        ->saveUploadedFileUsing(function (UploadedFile $file): ?string {
                            $fileName = time() . '_' . $file->getClientOriginalName();
                            $bucketFolder = 'inventaris-fotos';
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
                            if (blank($state)) { return; }
                            $filePath = str_replace(env('SUPABASE_URL') . '/storage/v1/object/public/', '', $state);
                            Http::withHeaders([
                                'apikey' => env('SUPABASE_KEY'),
                                'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
                            ])->delete(env('SUPABASE_URL') . '/storage/v1/object/' . $filePath);
                        }),
                ]),
                
                // --- SISA FORM TIDAK ADA PERUBAHAN ---
                Section::make('Jadwal Praktik (WIB)')
    ->schema([
        // --- SENIN ---
        Section::make('Senin')
            ->compact() // Membuat padding lebih kecil agar rapi
            ->schema([
                Grid::make(2)->schema([
                    TimePicker::make('schedule.senin.start')
                        ->label('Jam Mulai')
                        ->seconds(false)
                        ->displayFormat('H:i'),
                    TimePicker::make('schedule.senin.end')
                        ->label('Jam Selesai')
                        ->seconds(false)
                        ->displayFormat('H:i'),
                ]),
            ]),

        // --- SELASA ---
        Section::make('Selasa')
            ->compact()
            ->schema([
                Grid::make(2)->schema([
                    TimePicker::make('schedule.selasa.start')
                        ->label('Jam Mulai')
                        ->seconds(false)
                        ->displayFormat('H:i'),
                    TimePicker::make('schedule.selasa.end')
                        ->label('Jam Selesai')
                        ->seconds(false)
                        ->displayFormat('H:i'),
                ]),
            ]),

        // --- RABU ---
        Section::make('Rabu')
            ->compact()
            ->schema([
                Grid::make(2)->schema([
                    TimePicker::make('schedule.rabu.start')
                        ->label('Jam Mulai')
                        ->seconds(false)
                        ->displayFormat('H:i'),
                    TimePicker::make('schedule.rabu.end')
                        ->label('Jam Selesai')
                        ->seconds(false)
                        ->displayFormat('H:i'),
                ]),
            ]),

        // --- KAMIS ---
        Section::make('Kamis')
            ->compact()
            ->schema([
                Grid::make(2)->schema([
                    TimePicker::make('schedule.kamis.start')
                        ->label('Jam Mulai')
                        ->seconds(false)
                        ->displayFormat('H:i'),
                    TimePicker::make('schedule.kamis.end')
                        ->label('Jam Selesai')
                        ->seconds(false)
                        ->displayFormat('H:i'),
                ]),
            ]),

        // --- JUMAT ---
        Section::make('Jumat')
            ->compact()
            ->schema([
                Grid::make(2)->schema([
                    TimePicker::make('schedule.jumat.start')
                        ->label('Jam Mulai')
                        ->seconds(false)
                        ->displayFormat('H:i'),
                    TimePicker::make('schedule.jumat.end')
                        ->label('Jam Selesai')
                        ->seconds(false)
                        ->displayFormat('H:i'),
                ]),
            ]),

        // --- SABTU ---
        Section::make('Sabtu')
            ->compact()
            ->schema([
                Grid::make(2)->schema([
                    TimePicker::make('schedule.sabtu.start')
                        ->label('Jam Mulai')
                        ->seconds(false)
                        ->displayFormat('H:i'),
                    TimePicker::make('schedule.sabtu.end')
                        ->label('Jam Selesai')
                        ->seconds(false)
                        ->displayFormat('H:i'),
                ]),
            ]),

        // --- MINGGU ---
        Section::make('Minggu')
            ->compact()
            ->schema([
                Grid::make(2)->schema([
                    TimePicker::make('schedule.minggu.start')
                        ->label('Jam Mulai')
                        ->seconds(false)
                        ->displayFormat('H:i'),
                    TimePicker::make('schedule.minggu.end')
                        ->label('Jam Selesai')
                        ->seconds(false)
                        ->displayFormat('H:i'),
                ]),
            ]),
    ]),
                
                Section::make('Riwayat Pendidikan')->schema([
                    Repeater::make('educations')->relationship()->label('')->schema([
                        Grid::make(4)->schema([
                            TagsInput::make('degree')->required()->label('Gelar')->suggestions($degrees)->dehydrateStateUsing(fn ($state) => $state[0] ?? null)->formatStateUsing(fn ($state) => $state ? [$state] : []),
                            TagsInput::make('institution')->required()->label('Institusi')->suggestions($universities)->columnSpan(2)->dehydrateStateUsing(fn ($state) => $state[0] ?? null)->formatStateUsing(fn ($state) => $state ? [$state] : []),
                            TextInput::make('year')->required()->numeric()->label('Tahun Lulus')->minValue(1950)->maxValue(date('Y')),
                        ])
                    ])->addActionLabel('Tambah Riwayat Pendidikan')->columns(1),
                ]),
                Section::make('Sub-Spesialisasi / Bidang Minat')->schema([
                    Repeater::make('subSpecializations')->relationship()->label('')->schema([
                        TagsInput::make('name')->required()->label('Nama Sub-spesialisasi')->suggestions($medicalSubspecialties)->dehydrateStateUsing(fn ($state) => $state[0] ?? null)->formatStateUsing(fn ($state) => $state ? [$state] : []),
                    ])->addActionLabel('Tambah Sub-Spesialisasi'),
                ]),
                Section::make('Pengalaman Kerja')->schema([
                    Repeater::make('workExperiences')->relationship()->label('')->schema([
                        Grid::make(4)->schema([
                            TextInput::make('position')->required()->label('Posisi'),
                            TagsInput::make('place')->required()->label('Tempat Bekerja')->suggestions($workplaces)->columnSpan(2)->dehydrateStateUsing(fn ($state) => $state[0] ?? null)->formatStateUsing(fn ($state) => $state ? [$state] : []),
                            TextInput::make('period')->required()->label('Periode')->placeholder('Contoh: 2018-2022'),
                        ])
                    ])->addActionLabel('Tambah Pengalaman Kerja')->columns(1),
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image_path')
                ->label('Thumb')
                ->square()
                ->size(48)
                ->getStateUsing(function ($record) {
            
                    $value = $record->image_path;
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

    
                TextColumn::make('name')
                    ->label('Nama Dokter')
                    ->searchable()
                    ->sortable(),
    
                TextColumn::make('specialization')
                    ->label('Spesialisasi / Layanan')
                    ->searchable()
                    ->badge(),
    
                TextColumn::make('created_at')
                    ->label('Dibuat Pada')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
    
                TextColumn::make('updated_at')
                    ->label('Diperbarui Pada')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }
    

    public static function getRelations(): array { return []; }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDoctors::route('/'),
            'create' => Pages\CreateDoctor::route('/create'),
            'view' => Pages\ViewDoctor::route('/{record}'),
            'edit' => Pages\EditDoctor::route('/{record}/edit'),
        ];
    }
}