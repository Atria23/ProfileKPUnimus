<?php

// namespace App\Filament\Resources;

// use App\Filament\Resources\AnnouncementResource\Pages;
// use App\Models\Announcement;
// use Filament\Forms;
// use Filament\Forms\Form;
// use Filament\Forms\Get;
// use Filament\Forms\Set;
// use Filament\Resources\Resource;
// use Filament\Tables;
// use Filament\Tables\Table;
// use Filament\Tables\Columns\ToggleColumn;
// use Illuminate\Http\UploadedFile;
// use Illuminate\Support\Facades\Http;
// use Illuminate\Support\Str;
// use Filament\Forms\Components\Builder;
// use Filament\Forms\Components\Hidden;
// use Filament\Forms\Components\Placeholder;
// use Illuminate\Support\Arr;
// use Illuminate\Support\HtmlString;
// use Illuminate\Support\Facades\Log;
// use App\Traits\RestrictedResource; // <--- 1. Import Trait
// use App\Models\User;

// class AnnouncementResource extends Resource
// {
//     use RestrictedResource; // <--- 2. Pakai Trait

//     // <--- 3. Daftar Role (Mirip Middleware)
//     protected static ?array $allowedRoles = [
//         User::ROLE_HUMAS, 
//         // Super Admin sudah otomatis boleh di Trait
//     ];

//     protected static ?string $model = Announcement::class;

//     protected static ?string $navigationIcon = 'heroicon-o-megaphone';
//     protected static ?string $navigationLabel = 'Pengumuman';

//     public static function form(Form $form): Form
//     {
//         return $form
//             ->schema([
//                 Forms\Components\Group::make()
//                     ->schema([
//                         Forms\Components\Section::make('Konten Utama')
//                             ->schema([
//                                 // --- PERUBAHAN 1: Slug dioptimalkan ---
//                                 // Slug akan terisi setelah selesai mengetik judul (onBlur), bukan per karakter.
//                                 Forms\Components\TextInput::make('title')
//                                     ->required()
//                                     ->maxLength(255)
//                                     ->live(onBlur: true)
//                                     ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug(is_string($state) ? $state : ''))),

//                                 // Slug dibuat read-only agar tidak bisa diubah manual.
//                                 Forms\Components\TextInput::make('slug')
//                                     ->required()
//                                     ->unique(ignoreRecord: true)
//                                     ->readOnly(),
                                
//                                 // --- PERUBAHAN 2: Thumbnail dipindahkan ke sini untuk UX yang lebih baik ---
//                                 Placeholder::make('thumb_preview')
//                                     ->label('Pratinjau Thumbnail')
//                                     ->content(function (?Announcement $record, Get $get) {
//                                         $url = $get('image_path');
//                                         if (!$url && $record) {
//                                             $url = $record->image_path;
//                                         }
//                                         if ($url && is_string($url)) {
//                                             return new HtmlString('<img src="' . e($url) . '" style="max-width: 100%; border-radius: 6px; object-fit: cover;">');
//                                         }
//                                         return new HtmlString('<div class="text-xs text-gray-500 italic">Belum ada thumbnail.</div>');
//                                     })
//                                     ->live(),

//                                 Forms\Components\FileUpload::make('image_path')
//                                     ->label('Upload Thumbnail')
//                                     ->helperText('Upload baru akan menggantikan thumbnail yang ada.')
//                                     ->image()
//                                     ->imageEditor()
//                                     ->live() // Memicu update pada Placeholder di atas
//                                     ->dehydrated(fn ($state) => filled($state))
//                                     ->saveUploadedFileUsing(fn (UploadedFile $file) => self::uploadToSupabase($file))
//                                     ->deleteUploadedFileUsing(fn (?string $state) => self::deleteFromSupabase($state)),

//                                 Forms\Components\Textarea::make('excerpt')
//                                     ->rows(3)
//                                     ->maxLength(300)
//                                     ->helperText('Ringkasan singkat dari pengumuman ini.'),

//                                 Builder::make('content')
//                                     ->label('Isi Pengumuman')
//                                     ->collapsible()
//                                     ->blocks([
//                                         Builder\Block::make('paragraph')
//                                             ->label('Paragraf Teks')
//                                             ->icon('heroicon-o-bars-3-bottom-left')
//                                             ->schema([
//                                                 Forms\Components\RichEditor::make('content')->label(false)->required(),
//                                             ]),

//                                         Builder\Block::make('image_banner')
//                                             ->label('Gambar Banner')
//                                             ->icon('heroicon-o-photo')
//                                             ->schema([
//                                                 // 1. CUSTOM PREVIEW (Untuk menampilkan gambar besar)
//                                                 Placeholder::make('banner_preview')
//     ->label('Pratinjau Banner')
//     ->content(function (Get $get) {

//         $urlToDisplay = null;

//         /*
//         |--------------------------------------------------------------------------
//         | DEBUG 1: RAW CONTENT
//         |--------------------------------------------------------------------------
//         */
//         $content = $get('content');

//         Log::info('[BANNER PREVIEW] RAW CONTENT', [
//             'is_null' => is_null($content),
//             'type'    => gettype($content),
//             'count'   => is_array($content) ? count($content) : null,
//             'value'   => $content,
//         ]);

//         /*
//         |--------------------------------------------------------------------------
//         | PRIORITAS 1: DARI FIELD `url`
//         |--------------------------------------------------------------------------
//         */
//         $state = $get('url');

//         Log::info('[BANNER PREVIEW] RAW URL STATE', [
//             'type'  => gettype($state),
//             'value' => $state,
//         ]);

//         if (is_array($state)) {
//             $firstItem = array_values($state)[0] ?? null;

//             if (is_string($firstItem)) {
//                 $urlToDisplay = $firstItem;

//                 Log::info('[BANNER PREVIEW] URL FROM ARRAY STRING', [
//                     'url' => $urlToDisplay,
//                 ]);
//             } elseif (is_object($firstItem) && method_exists($firstItem, 'temporaryUrl')) {
//                 $urlToDisplay = $firstItem->temporaryUrl();

//                 Log::info('[BANNER PREVIEW] URL FROM ARRAY TEMP FILE', [
//                     'url' => $urlToDisplay,
//                 ]);
//             }
//         } elseif (is_object($state) && method_exists($state, 'temporaryUrl')) {
//             $urlToDisplay = $state->temporaryUrl();

//             Log::info('[BANNER PREVIEW] URL FROM TEMP FILE', [
//                 'url' => $urlToDisplay,
//             ]);
//         } elseif (is_string($state) && !empty($state)) {
//             $urlToDisplay = $state;

//             Log::info('[BANNER PREVIEW] URL FROM STRING', [
//                 'url' => $urlToDisplay,
//             ]);
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | PRIORITAS 2: FALLBACK DARI CONTENT
//         |--------------------------------------------------------------------------
//         */
//         if (!$urlToDisplay && is_array($content)) {
//             foreach ($content as $index => $block) {

//                 Log::info('[BANNER PREVIEW] INSPECT BLOCK', [
//                     'index' => $index,
//                     'type'  => $block['type'] ?? null,
//                     'keys'  => isset($block['data']) && is_array($block['data'])
//                         ? array_keys($block['data'])
//                         : null,
//                 ]);

//                 // CASE A: image_banner block
//                 if (
//                     ($block['type'] ?? null) === 'image_banner'
//                     && !empty($block['data']['url'])
//                 ) {
//                     $urlToDisplay = $block['data']['url'];

//                     Log::info('[BANNER PREVIEW] URL FROM image_banner BLOCK', [
//                         'url' => $urlToDisplay,
//                     ]);

//                     break;
//                 }

//                 // CASE B: <img src=""> di paragraph
//                 if (
//                     ($block['type'] ?? null) === 'paragraph'
//                     && !empty($block['data']['content'])
//                     && preg_match('/<img[^>]+src="([^">]+)"/i', $block['data']['content'], $matches)
//                 ) {
//                     $urlToDisplay = $matches[1];

//                     Log::info('[BANNER PREVIEW] URL FROM PARAGRAPH IMG', [
//                         'url' => $urlToDisplay,
//                     ]);

//                     break;
//                 }
//             }
//         }

//         /*
//         |--------------------------------------------------------------------------
//         | RENDER
//         |--------------------------------------------------------------------------
//         */
//         if ($urlToDisplay) {
//             return new HtmlString('
//                 <div style="margin-top:5px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;background:#f9fafb;">
//                     <img src="' . e($urlToDisplay) . '" style="width:100%;max-height:400px;object-fit:contain;display:block;">
//                     <div class="px-2 py-1 text-xs text-green-700 bg-green-50 border-t border-green-100">
//                         ✓ Gambar aktif (auto-detect)
//                     </div>
//                 </div>
//             ');
//         }

//         return new HtmlString('
//             <div class="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded bg-gray-50 text-gray-400 text-sm">
//                 <span>Belum ada gambar banner.</span>
//             </div>
//         ');
//     })
//     ->live(),

                                
//                                                 // 2. INPUT FILE UPLOAD
//                                                 Forms\Components\FileUpload::make('url')
//                                                     ->label('Upload Gambar')
//                                                     ->multiple()
//                                                     ->maxFiles(1)
//                                                     ->image()
//                                                     ->imageEditor()
//                                                     ->live()
//                                                     ->multiple(false)
                                                
//                                                     ->afterStateUpdated(function ($state, Set $set) {

//                                                         Log::info('[FILEUPLOAD UPDATED - RAW]', [
//                                                             'type'  => gettype($state),
//                                                             'value' => $state,
//                                                         ]);
                                                
//                                                         /**
//                                                          * $state bisa berupa:
//                                                          * - array UUID => url lama
//                                                          * - array UUID => TemporaryUploadedFile
//                                                          * - array campuran
//                                                          *
//                                                          * Kita PAKSA:
//                                                          * - buang semua state lama
//                                                          * - simpan HANYA item TERAKHIR
//                                                          */
//                                                         if (is_array($state)) {
//                                                             $values = array_values($state);
//                                                             $latest = end($values);
                                                
//                                                             Log::info('[FILEUPLOAD UPDATED - REPLACED]', [
//                                                                 'kept' => $latest,
//                                                             ]);
                                                
//                                                             // 🔥 INI KUNCI UTAMA
//                                                             $set('url', [$latest]);
//                                                         }
//                                                     })

//                                                     ->saveUploadedFileUsing(function ($file) {

//                                                         Log::info('[UPLOAD SUPABASE]', [
//                                                             'name' => $file->getClientOriginalName(),
//                                                         ]);
                                                
//                                                         return self::uploadToSupabase($file);
//                                                     })
                                                
//                                                     ->deleteUploadedFileUsing(function ($state) {
                                                
//                                                         Log::warning('[DELETE OLD FILE]', [
//                                                             'state' => $state,
//                                                         ]);
                                                
//                                                         if (is_array($state)) {
//                                                             foreach ($state as $file) {
//                                                                 self::deleteFromSupabase($file);
//                                                             }
//                                                         } elseif (is_string($state)) {
//                                                             self::deleteFromSupabase($state);
//                                                         }
//                                                     })
                                                
//                                                     ->dehydrateStateUsing(function ($state) {
                                                
//                                                         if (is_array($state)) {
//                                                             return array_values($state)[0] ?? null;
//                                                         }
                                                
//                                                         return $state;
//                                                     }),

                                
//                                                 Forms\Components\TextInput::make('caption')
//                                                     ->label('Keterangan Gambar (Caption)'),
//                                             ]),
//                                     ])
//                                     ->required(),
//                             ]),
//                     ])->columnSpan(['lg' => 2]),

//                 Forms\Components\Group::make()
//                     ->schema([
//                         Forms\Components\Section::make('Pengaturan')
//                             ->schema([
//                                 Forms\Components\Select::make('status')
//                                     ->options([1 => 'Tampilkan', 0 => 'Sembunyikan (Draft)'])
//                                     ->default(1)->required(),
                                
//                                 Forms\Components\DateTimePicker::make('published_at')->default(now())->required(),
//                             ]),
//                     ])->columnSpan(['lg' => 1]),
//             ])->columns(3);
//     }

//     public static function table(Table $table): Table
//     {
//         return $table
//             ->columns([
//                 Tables\Columns\ImageColumn::make('image_path')->label('Thumbnail'),
//                 Tables\Columns\TextColumn::make('title')->searchable()->sortable()->limit(50),
//                 ToggleColumn::make('status')
//                     ->label('Tampilkan')
//                     ->onColor('warning')
//                     ->offColor('gray'),
//                 Tables\Columns\TextColumn::make('published_at')->dateTime()->sortable()->label('Dipublikasikan'),
//             ])
//             ->defaultSort('published_at', 'desc')
//             ->actions([
//                 Tables\Actions\EditAction::make(),
//                 Tables\Actions\DeleteAction::make()
//                     ->before(function (Announcement $record) {
//                         if ($record->image_path) {
//                             self::deleteFromSupabase($record->image_path);
//                         }
//                         if (is_array($record->content)) {
//                             foreach ($record->content as $block) {
//                                 if ($block['type'] === 'image_banner' && !empty($block['data']['url'])) {
//                                     self::deleteFromSupabase($block['data']['url']);
//                                 }
//                             }
//                         }
//                     }),
//             ]);
//     }

//     public static function getPages(): array
//     {
//         return [
//             'index' => Pages\ListAnnouncements::route('/'),
//             'create' => Pages\CreateAnnouncement::route('/create'),
//             'edit' => Pages\EditAnnouncement::route('/{record}/edit'),
//         ];
//     }

//     protected static function uploadToSupabase(UploadedFile $file): string
//     {
//         $fileName = 'announcements/' . time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
//         $bucket = env('SUPABASE_BUCKET', 'web-profile');
//         $uploadResponse = Http::withHeaders([
//             'apikey' => env('SUPABASE_KEY'), 'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
//         ])->withBody(
//             file_get_contents($file->getRealPath()),
//             $file->getMimeType()
//         )->post(env('SUPABASE_URL') . '/storage/v1/object/' . $bucket . '/' . $fileName);

//         if ($uploadResponse->failed()) {
//             throw new \Exception('Gagal Upload ke Supabase: ' . $uploadResponse->body());
//         }
        
//         $publicUrl = env('SUPABASE_URL') . '/storage/v1/object/public/' . $bucket . '/' . $fileName;
//         return $publicUrl;
//     }

//     protected static function deleteFromSupabase(?string $url): void
//     {
//         if (!$url || !is_string($url) || !Str::contains($url, 'storage/v1/object/public')) {
//             return;
//         }

//         $bucket = env('SUPABASE_BUCKET', 'web-profile');
//         $filePath = $bucket . '/' . Str::after($url, '/storage/v1/object/public/' . $bucket . '/');

//         Http::withHeaders([
//             'apikey' => env('SUPABASE_KEY'), 'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
//         ])->delete(env('SUPABASE_URL') . '/storage/v1/object/' . $filePath);
//     }
// }


















namespace App\Filament\Resources;

use App\Filament\Resources\AnnouncementResource\Pages;
use App\Models\Announcement;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\ToggleColumn;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Placeholder;
use Illuminate\Support\Arr;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Facades\Log;
use App\Traits\RestrictedResource; // <--- 1. Import Trait
use App\Models\User;
use App\Models\PushToken; // Pastikan Model ini sudah dibuat

class AnnouncementResource extends Resource
{
    use RestrictedResource; // <--- 2. Pakai Trait

    // <--- 3. Daftar Role (Mirip Middleware)
    protected static ?array $allowedRoles = [
        User::ROLE_HUMAS, 
        // Super Admin sudah otomatis boleh di Trait
    ];

    protected static ?string $model = Announcement::class;

    protected static ?string $navigationIcon = 'heroicon-o-megaphone';
    protected static ?string $navigationLabel = 'Pengumuman';

    public static function sendExpoNotification(Announcement $record): void
    {
        // Ambil semua token dari database
        $tokens = PushToken::pluck('token')->toArray();

        if (empty($tokens)) {
            return;
        }

        // Kelompokkan token per 100 (Limit API Expo)
        $chunks = array_chunk($tokens, 100);

        foreach ($chunks as $chunk) {
            Http::withHeaders([
                'Accept' => 'application/json',
                'Accept-encoding' => 'gzip, deflate',
                'Content-Type' => 'application/json',
            ])->post('https://exp.host/--/api/v2/push/send', [
                'to' => $chunk,
                'title' => '📢 Pengumuman Baru!',
                'body' => $record->title,
                'sound' => 'default',
                'data' => [
                    'slug' => $record->slug,
                    'type' => 'announcement'
                ],
            ]);
        }
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Konten Utama')
                            ->schema([
                                // --- PERUBAHAN 1: Slug dioptimalkan ---
                                // Slug akan terisi setelah selesai mengetik judul (onBlur), bukan per karakter.
                                Forms\Components\TextInput::make('title')
                                    ->required()
                                    ->maxLength(255)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug(is_string($state) ? $state : ''))),

                                // Slug dibuat read-only agar tidak bisa diubah manual.
                                Forms\Components\TextInput::make('slug')
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->readOnly(),
                                
                                // --- PERUBAHAN 2: Thumbnail dipindahkan ke sini untuk UX yang lebih baik ---
                                Placeholder::make('thumb_preview')
                                    ->label('Pratinjau Thumbnail')
                                    ->content(function (?Announcement $record, Get $get) {
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
                                    ->label('Upload Thumbnail')
                                    ->helperText('Upload baru akan menggantikan thumbnail yang ada.')
                                    ->image()
                                    ->imageEditor()
                                    ->live() // Memicu update pada Placeholder di atas
                                    ->dehydrated(fn ($state) => filled($state))
                                    ->saveUploadedFileUsing(fn (UploadedFile $file) => self::uploadToSupabase($file))
                                    ->deleteUploadedFileUsing(fn (?string $state) => self::deleteFromSupabase($state)),

                                Forms\Components\Textarea::make('excerpt')
                                    ->rows(3)
                                    ->maxLength(300)
                                    ->helperText('Ringkasan singkat dari pengumuman ini.'),

                                Builder::make('content')
                                    ->label('Isi Pengumuman')
                                    ->collapsible()
                                    ->blocks([
                                        Builder\Block::make('paragraph')
                                            ->label('Paragraf Teks')
                                            ->icon('heroicon-o-bars-3-bottom-left')
                                            ->schema([
                                                Forms\Components\RichEditor::make('content')->label(false)->required(),
                                            ]),

                                        Builder\Block::make('image_banner')
                                            ->label('Gambar Banner')
                                            ->icon('heroicon-o-photo')
                                            ->schema([
                                                // 1. CUSTOM PREVIEW (Untuk menampilkan gambar besar)
                                                Placeholder::make('banner_preview')
    ->label('Pratinjau Banner')
    ->content(function (Get $get) {

        $urlToDisplay = null;

        /*
        |--------------------------------------------------------------------------
        | DEBUG 1: RAW CONTENT
        |--------------------------------------------------------------------------
        */
        $content = $get('content');

        Log::info('[BANNER PREVIEW] RAW CONTENT', [
            'is_null' => is_null($content),
            'type'    => gettype($content),
            'count'   => is_array($content) ? count($content) : null,
            'value'   => $content,
        ]);

        /*
        |--------------------------------------------------------------------------
        | PRIORITAS 1: DARI FIELD `url`
        |--------------------------------------------------------------------------
        */
        $state = $get('url');

        Log::info('[BANNER PREVIEW] RAW URL STATE', [
            'type'  => gettype($state),
            'value' => $state,
        ]);

        if (is_array($state)) {
            $firstItem = array_values($state)[0] ?? null;

            if (is_string($firstItem)) {
                $urlToDisplay = $firstItem;

                Log::info('[BANNER PREVIEW] URL FROM ARRAY STRING', [
                    'url' => $urlToDisplay,
                ]);
            } elseif (is_object($firstItem) && method_exists($firstItem, 'temporaryUrl')) {
                $urlToDisplay = $firstItem->temporaryUrl();

                Log::info('[BANNER PREVIEW] URL FROM ARRAY TEMP FILE', [
                    'url' => $urlToDisplay,
                ]);
            }
        } elseif (is_object($state) && method_exists($state, 'temporaryUrl')) {
            $urlToDisplay = $state->temporaryUrl();

            Log::info('[BANNER PREVIEW] URL FROM TEMP FILE', [
                'url' => $urlToDisplay,
            ]);
        } elseif (is_string($state) && !empty($state)) {
            $urlToDisplay = $state;

            Log::info('[BANNER PREVIEW] URL FROM STRING', [
                'url' => $urlToDisplay,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | PRIORITAS 2: FALLBACK DARI CONTENT
        |--------------------------------------------------------------------------
        */
        if (!$urlToDisplay && is_array($content)) {
            foreach ($content as $index => $block) {

                Log::info('[BANNER PREVIEW] INSPECT BLOCK', [
                    'index' => $index,
                    'type'  => $block['type'] ?? null,
                    'keys'  => isset($block['data']) && is_array($block['data'])
                        ? array_keys($block['data'])
                        : null,
                ]);

                // CASE A: image_banner block
                if (
                    ($block['type'] ?? null) === 'image_banner'
                    && !empty($block['data']['url'])
                ) {
                    $urlToDisplay = $block['data']['url'];

                    Log::info('[BANNER PREVIEW] URL FROM image_banner BLOCK', [
                        'url' => $urlToDisplay,
                    ]);

                    break;
                }

                // CASE B: <img src=""> di paragraph
                if (
                    ($block['type'] ?? null) === 'paragraph'
                    && !empty($block['data']['content'])
                    && preg_match('/<img[^>]+src="([^">]+)"/i', $block['data']['content'], $matches)
                ) {
                    $urlToDisplay = $matches[1];

                    Log::info('[BANNER PREVIEW] URL FROM PARAGRAPH IMG', [
                        'url' => $urlToDisplay,
                    ]);

                    break;
                }
            }
        }

        /*
        |--------------------------------------------------------------------------
        | RENDER
        |--------------------------------------------------------------------------
        */
        if ($urlToDisplay) {
            return new HtmlString('
                <div style="margin-top:5px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;background:#f9fafb;">
                    <img src="' . e($urlToDisplay) . '" style="width:100%;max-height:400px;object-fit:contain;display:block;">
                    <div class="px-2 py-1 text-xs text-green-700 bg-green-50 border-t border-green-100">
                        ✓ Gambar aktif (auto-detect)
                    </div>
                </div>
            ');
        }

        return new HtmlString('
            <div class="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded bg-gray-50 text-gray-400 text-sm">
                <span>Belum ada gambar banner.</span>
            </div>
        ');
    })
    ->live(),

                                
                                                // 2. INPUT FILE UPLOAD
                                                Forms\Components\FileUpload::make('url')
                                                    ->label('Upload Gambar')
                                                    ->multiple()
                                                    ->maxFiles(1)
                                                    ->image()
                                                    ->imageEditor()
                                                    ->live()
                                                    ->multiple(false)
                                                
                                                    ->afterStateUpdated(function ($state, Set $set) {

                                                        Log::info('[FILEUPLOAD UPDATED - RAW]', [
                                                            'type'  => gettype($state),
                                                            'value' => $state,
                                                        ]);
                                                
                                                        /**
                                                         * $state bisa berupa:
                                                         * - array UUID => url lama
                                                         * - array UUID => TemporaryUploadedFile
                                                         * - array campuran
                                                         *
                                                         * Kita PAKSA:
                                                         * - buang semua state lama
                                                         * - simpan HANYA item TERAKHIR
                                                         */
                                                        if (is_array($state)) {
                                                            $values = array_values($state);
                                                            $latest = end($values);
                                                
                                                            Log::info('[FILEUPLOAD UPDATED - REPLACED]', [
                                                                'kept' => $latest,
                                                            ]);
                                                
                                                            // 🔥 INI KUNCI UTAMA
                                                            $set('url', [$latest]);
                                                        }
                                                    })

                                                    ->saveUploadedFileUsing(function ($file) {

                                                        Log::info('[UPLOAD SUPABASE]', [
                                                            'name' => $file->getClientOriginalName(),
                                                        ]);
                                                
                                                        return self::uploadToSupabase($file);
                                                    })
                                                
                                                    ->deleteUploadedFileUsing(function ($state) {
                                                
                                                        Log::warning('[DELETE OLD FILE]', [
                                                            'state' => $state,
                                                        ]);
                                                
                                                        if (is_array($state)) {
                                                            foreach ($state as $file) {
                                                                self::deleteFromSupabase($file);
                                                            }
                                                        } elseif (is_string($state)) {
                                                            self::deleteFromSupabase($state);
                                                        }
                                                    })
                                                
                                                    ->dehydrateStateUsing(function ($state) {
                                                
                                                        if (is_array($state)) {
                                                            return array_values($state)[0] ?? null;
                                                        }
                                                
                                                        return $state;
                                                    }),

                                
                                                Forms\Components\TextInput::make('caption')
                                                    ->label('Keterangan Gambar (Caption)'),
                                            ]),
                                    ])
                                    ->required(),
                            ]),
                    ])->columnSpan(['lg' => 2]),

                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Pengaturan')
                            ->schema([
                                Forms\Components\Select::make('status')
                                    ->options([1 => 'Tampilkan', 0 => 'Sembunyikan (Draft)'])
                                    ->default(1)->required(),
                                
                                Forms\Components\DateTimePicker::make('published_at')->default(now())->required(),
                            ]),
                    ])->columnSpan(['lg' => 1]),
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_path')->label('Thumbnail'),
                Tables\Columns\TextColumn::make('title')->searchable()->sortable()->limit(50),
                ToggleColumn::make('status')
                    ->label('Tampilkan')
                    ->onColor('warning')
                    ->offColor('gray'),
                Tables\Columns\TextColumn::make('published_at')->dateTime()->sortable()->label('Dipublikasikan'),
            ])
            ->defaultSort('published_at', 'desc')
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->before(function (Announcement $record) {
                        if ($record->image_path) {
                            self::deleteFromSupabase($record->image_path);
                        }
                        if (is_array($record->content)) {
                            foreach ($record->content as $block) {
                                if ($block['type'] === 'image_banner' && !empty($block['data']['url'])) {
                                    self::deleteFromSupabase($block['data']['url']);
                                }
                            }
                        }
                    }),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAnnouncements::route('/'),
            'create' => Pages\CreateAnnouncement::route('/create'),
            'edit' => Pages\EditAnnouncement::route('/{record}/edit'),
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