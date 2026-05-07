<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FacilityResource\Pages;
use App\Models\Facility;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Filament\Forms\Components\Placeholder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\HtmlString;
use Filament\Forms\Set;
use Filament\Forms\Get;
use App\Traits\RestrictedResource; // <--- 1. Import Trait
use App\Models\User; // <--- 1. Import User

class FacilityResource extends Resource
{
    use RestrictedResource; // <--- 2. Pakai Trait

    // <--- 3. Daftar Role (Mirip Middleware)
    protected static ?array $allowedRoles = [
        User::ROLE_HUMAS, 
        // Super Admin sudah otomatis boleh di Trait
    ];

    protected static ?string $model = Facility::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-office-2';
    protected static ?string $navigationLabel = 'Fasilitas';
    protected static ?string $navigationGroup = 'Konten Website';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                // --- KOLOM KIRI (KONTEN UTAMA + GAMBAR) ---
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make()
                            ->schema([
                                // 1. Title (Nama Fasilitas)
                                Forms\Components\TextInput::make('title')
                                    ->label('Nama Fasilitas')
                                    ->required()
                                    ->maxLength(255)
                                    // PENTING: live(onBlur: true) agar tidak request terus menerus saat mengetik
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (Set $set, ?string $state) => 
                                        $set('slug', Str::slug($state ?? ''))),

                                // 2. Slug (Otomatis & Terkunci)
                                Forms\Components\TextInput::make('slug')
                                    ->disabled() // Tidak bisa diketik manual
                                    ->dehydrated() // Tetap dikirim ke database saat save
                                    ->required()
                                    ->unique(Facility::class, 'slug', ignoreRecord: true),

                                // 3. Kategori
                                Forms\Components\Select::make('category')
                                    ->label('Kategori Fasilitas')
                                    ->options([
                                        Facility::CATEGORY_PERAWATAN => 'Fasilitas Perawatan',
                                        Facility::CATEGORY_PENUNJANG => 'Fasilitas Penunjang',
                                    ])
                                    ->required()
                                    ->native(false),

                                // 4. Ringkasan
                                Forms\Components\Textarea::make('excerpt')
                                    ->label('Ringkasan')
                                    ->rows(3)
                                    ->maxLength(300)
                                    ->columnSpanFull(),
                                
                                // 5. Daftar Fasilitas (Menggunakan TagsInput agar User Friendly)
                                Forms\Components\TagsInput::make('content')
                                    ->label('Daftar Fasilitas (Tersedia)')
                                    ->placeholder('Ketik nama item (misal: AC) lalu tekan Enter')
                                    ->helperText('Tekan Enter untuk menambahkan item.')
                                    ->columnSpanFull()
                                    // PENTING: Konversi data lama (Repeater) ke TagsInput agar tidak error
                                    ->formatStateUsing(function ($state) {
                                        if (empty($state)) return [];
                                        
                                        // Jika data lama berupa array of object [{'item': 'AC'}, {'item': 'TV'}]
                                        if (is_array($state) && isset($state[0]) && is_array($state[0])) {
                                            return collect($state)->pluck('item')->filter()->toArray();
                                        }

                                        return $state;
                                    }),
                            ]),

                        // --- PINDAH GAMBAR KE SINI (BAWAH KONTEN UTAMA) ---
                        Forms\Components\Section::make('Gambar Fasilitas')
                            ->schema([
                                // Preview Gambar (Aman dari error)
                                Placeholder::make('thumb_preview')
                                    ->label('Pratinjau Gambar')
                                    ->content(function (?Facility $record, Get $get) {
                                        $url = $get('image_path');
                                        if (!$url && $record) {
                                            $url = $record->image_path;
                                        }
                                        if ($url && is_string($url)) {
                                            return new HtmlString('<img src="' . e($url) . '" style="max-width: 100%; border-radius: 6px; object-fit: cover;">');
                                        }
                                        return new HtmlString('<div class="text-xs text-gray-500 italic">Belum ada thumbnail.</div>');
                                    })
                                    ->live(),

                                Forms\Components\FileUpload::make('image_path')
                                    ->label('Upload Gambar')
                                    ->helperText('Upload baru akan menggantikan gambar yang ada.')
                                    ->image()
                                    ->imageEditor()
                                    ->live() // Memicu update pada Placeholder di atas
                                    ->dehydrated(fn ($state) => filled($state))
                                    ->saveUploadedFileUsing(fn (UploadedFile $file) => self::uploadToSupabase($file))
                                    ->deleteUploadedFileUsing(fn (?string $state) => self::deleteFromSupabase($state)),
                            ]),

                    ])->columnSpan(['lg' => 2]),

                // --- KOLOM KANAN (HANYA PENGATURAN STATUS) ---
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Pengaturan')
                            ->schema([
                                Forms\Components\Toggle::make('status')
                                    ->label('Tampilkan di Web')
                                    ->default(1)
                                    ->onColor('success')
                                    ->offColor('danger'),

                                Forms\Components\DateTimePicker::make('published_at')
                                    ->label('Tanggal Publish')
                                    ->default(now()),
                            ])
                    ])->columnSpan(['lg' => 1]),
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_path')
                    ->label('Gambar')
                    ->square()
                    ->getStateUsing(fn ($record) =>
                        $record->image_path
                            ? str_replace(' ', '%20', $record->image_path)
                            : null
                    ),
                
                Tables\Columns\TextColumn::make('title')
                    ->label('Nama Fasilitas')
                    ->searchable()
                    ->sortable()
                    ->limit(30),

                Tables\Columns\TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        Facility::CATEGORY_PERAWATAN => 'success', // Hijau
                        Facility::CATEGORY_PENUNJANG => 'info',    // Biru
                        default => 'gray',
                    })
                    ->sortable(),

                Tables\Columns\ToggleColumn::make('status')
                    ->label('Status'),

                Tables\Columns\TextColumn::make('published_at')
                    ->label('Rilis')
                    ->dateTime('d M Y')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->options([
                        Facility::CATEGORY_PERAWATAN => 'Fasilitas Perawatan',
                        Facility::CATEGORY_PENUNJANG => 'Fasilitas Penunjang',
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
            'index' => Pages\ListFacilities::route('/'),
            'create' => Pages\CreateFacility::route('/create'),
            'edit' => Pages\EditFacility::route('/{record}/edit'),
        ];
    }

    protected static function uploadToSupabase(UploadedFile $file): string
    {
        $fileName = 'announcements/' . time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
        $bucket = env('SUPABASE_BUCKET', 'web-profile');
        $uploadResponse = Http::withHeaders([
            'apikey' => env('SUPABASE_KEY'), 'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
        ])->withBody(
            file_get_contents($file->getRealPath()),
            $file->getMimeType()
        )->post(env('SUPABASE_URL') . '/storage/v1/object/' . $bucket . '/' . $fileName);

        if ($uploadResponse->failed()) {
            throw new \Exception('Gagal Upload ke Supabase: ' . $uploadResponse->body());
        }
        
        $publicUrl = env('SUPABASE_URL') . '/storage/v1/object/public/' . $bucket . '/' . $fileName;
        return $publicUrl;
    }

    protected static function deleteFromSupabase(?string $url): void
    {
        if (!$url || !is_string($url) || !Str::contains($url, 'storage/v1/object/public')) {
            return;
        }

        $bucket = env('SUPABASE_BUCKET', 'web-profile');
        $filePath = $bucket . '/' . Str::after($url, '/storage/v1/object/public/' . $bucket . '/');

        Http::withHeaders([
            'apikey' => env('SUPABASE_KEY'), 'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
        ])->delete(env('SUPABASE_URL') . '/storage/v1/object/' . $filePath);
    }
}