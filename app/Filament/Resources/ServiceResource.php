<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceResource\Pages;
use App\Models\Service;
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
use App\Traits\RestrictedResource; // <--- 1. Import Trait
use App\Models\User; // <--- 1. Import User

class ServiceResource extends Resource
{
    use RestrictedResource; // <--- 2. Pakai Trait

    // <--- 3. Daftar Role (Mirip Middleware)
    protected static ?array $allowedRoles = [
        User::ROLE_HUMAS, 
        // Super Admin sudah otomatis boleh di Trait
    ];

    protected static ?string $model = Service::class;

    protected static ?string $navigationIcon = 'heroicon-o-briefcase'; 
    protected static ?string $navigationLabel = 'Layanan';
    protected static ?string $navigationGroup = 'Konten Website';


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Detail Layanan')
                            ->schema([
                                Forms\Components\TextInput::make('title')
                                    ->label('Judul Layanan')
                                    ->required()
                                    ->maxLength(255)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),
                                
                                Forms\Components\TextInput::make('slug')
                                    ->disabled()
                                    ->dehydrated()
                                    ->required()
                                    ->maxLength(255)
                                    ->unique(Service::class, 'slug', ignoreRecord: true),
                                
                                // --- LOGIKA GAMBAR SUPABASE ---
                                Forms\Components\Section::make('Gambar Layanan')
                                    ->schema([
                                        Placeholder::make('image_preview')
                                            ->label('Preview Gambar Saat Ini')
                                            ->content(function (?Model $record): ?HtmlString {
                                                if ($record && $record->image_path) {
                                                    $html = '<img src="' . e($record->image_path) . '" alt="Gambar" style="max-width: 100%; height: auto; border-radius: 8px;">';
                                                    return new HtmlString($html);
                                                }
                                                return null;
                                            })
                                            ->visible(fn (?Model $record) => $record && $record->exists && $record->image_path),

                                        Forms\Components\FileUpload::make('image_path')
                                            ->label('Unggah Gambar (Thumbnail)')
                                            ->image()
                                            ->imageEditor()
                                            ->required(fn (string $context): bool => $context === 'create')
                                            // LOGIKA AGAR GAMBAR TIDAK HILANG SAAT EDIT
                                            ->dehydrated(fn ($state) => filled($state))
                                            ->saveUploadedFileUsing(function (UploadedFile $file): ?string {
                                                $fileName = time() . '_' . Str::slug($file->getClientOriginalName());
                                                $bucketFolder = 'web-profile'; 

                                                $response = Http::withHeaders([
                                                    'apikey' => env('SUPABASE_KEY'),
                                                    'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
                                                ])->withBody(
                                                    file_get_contents($file->getRealPath()),
                                                    $file->getMimeType()
                                                )->post(env('SUPABASE_URL') . '/storage/v1/object/' . $bucketFolder . '/' . $fileName);

                                                if ($response->failed()) {
                                                    throw new \Exception('Unggah gambar gagal: ' . $response->body());
                                                }
                                                
                                                return env('SUPABASE_URL') . '/storage/v1/object/public/' . $bucketFolder . '/' . $fileName;
                                            })
                                            ->deleteUploadedFileUsing(function (?string $state): void {
                                                if (blank($state)) return;
                                                $filePath = str_replace(env('SUPABASE_URL') . '/storage/v1/object/public/', '', $state);
                                                
                                                Http::withHeaders([
                                                    'apikey' => env('SUPABASE_KEY'),
                                                    'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
                                                ])->delete(env('SUPABASE_URL') . '/storage/v1/object/' . $filePath);
                                            }),
                                    ]),
                                // --- AKHIR LOGIKA GAMBAR ---

                                Forms\Components\Textarea::make('excerpt')
                                    ->label('Ringkasan')
                                    ->rows(3)
                                    ->maxLength(300),
                                
                                Forms\Components\RichEditor::make('content')
                                    ->label('Deskripsi Lengkap')
                                    ->required()
                                    ->columnSpanFull(),
                            ])->columns(1),
                    ])->columnSpan(['lg' => 2]),

                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Pengaturan')
                            ->schema([
                                // === PERUBAHAN: KEMBALI KE SELECT/DROPDOWN ===
                                Forms\Components\Select::make('status')
                                    ->label('Status Publikasi')
                                    ->options([
                                        1 => 'Tampilkan',
                                        0 => 'Draft',
                                    ])
                                    ->default(1)
                                    ->native(false)
                                    ->required(),

                                Forms\Components\Select::make('is_featured')
                                    ->label('Jenis Layanan')
                                    ->options([
                                        1 => 'Layanan Unggulan',
                                        0 => 'Layanan Biasa',
                                    ])
                                    ->default(0) // Default Biasa
                                    ->native(false)
                                    ->required(),
                                // ==========================================

                                Forms\Components\DateTimePicker::make('published_at')
                                    ->label('Tanggal Tayang')
                                    ->default(now())
                                    ->required(),
                            ]),
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
                    ->label('Judul')
                    ->searchable()
                    ->sortable()
                    ->limit(30),

                // === PERUBAHAN: KEMBALI KE TEXT & BADGE ===
                Tables\Columns\TextColumn::make('is_featured')
                    ->label('Kategori')
                    ->formatStateUsing(fn (int $state): string => $state === 1 ? 'Unggulan' : 'Biasa')
                    ->badge()
                    ->color(fn (int $state): string => match ($state) {
                        1 => 'warning', // Warna kuning/oranye untuk Unggulan
                        0 => 'gray',    // Warna abu untuk Biasa
                    })
                    ->sortable(),
                // ===========================================

                // TETAP MENGGUNAKAN SWITCH SESUAI PERMINTAAN SEBELUMNYA
                Tables\Columns\ToggleColumn::make('status')
                    ->label('Status'),

                Tables\Columns\TextColumn::make('published_at')
                    ->label('Rilis')
                    ->date()
                    ->sortable(),
            ])
            ->defaultSort('published_at', 'desc')
            ->actions([
                Tables\Actions\EditAction::make(),
                
                Tables\Actions\DeleteAction::make()
                    ->before(function (Service $record) {
                        if ($record->image_path) {
                            $filePath = str_replace(env('SUPABASE_URL') . '/storage/v1/object/public/', '', $record->image_path);
                            
                            Http::withHeaders([
                                'apikey' => env('SUPABASE_KEY'),
                                'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
                            ])->delete(env('SUPABASE_URL') . '/storage/v1/object/' . $filePath);
                        }
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->before(function (\Illuminate\Database\Eloquent\Collection $records) {
                            foreach ($records as $record) {
                                if ($record->image_path) {
                                    $filePath = str_replace(env('SUPABASE_URL') . '/storage/v1/object/public/', '', $record->image_path);
                                    
                                    Http::withHeaders([
                                        'apikey' => env('SUPABASE_KEY'),
                                        'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
                                    ])->delete(env('SUPABASE_URL') . '/storage/v1/object/' . $filePath);
                                }
                            }
                        }),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListServices::route('/'),
            'create' => Pages\CreateService::route('/create'),
            'edit' => Pages\EditService::route('/{record}/edit'),
        ];
    }
}