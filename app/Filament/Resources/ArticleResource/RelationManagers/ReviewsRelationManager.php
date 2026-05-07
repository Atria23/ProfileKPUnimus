<?php

namespace App\Filament\Resources\ArticleResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Filament\Tables\Filters\SelectFilter;

class ReviewsRelationManager extends RelationManager
{
    protected static string $relationship = 'allReviews';
    protected static ?string $recordTitleAttribute = 'name';

    public function form(Form $form): Form
    {
        // Bagian ini tidak perlu diubah
        return $form
            ->schema([
                Forms\Components\Fieldset::make('Detail Ulasan (Read-only)')
                    ->schema([
                        Forms\Components\TextInput::make('name')->disabled(),
                        Forms\Components\TextInput::make('reaction')->disabled(),
                        Forms\Components\Textarea::make('comment')->disabled()->columnSpanFull(),
                    ]),

                Forms\Components\Fieldset::make('Balasan Admin')
                    ->schema([
                        Forms\Components\Textarea::make('admin_reply')
                            ->label('Tulis Balasan Anda')
                            ->rows(5)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ToggleColumn::make('is_visible')
                    ->label('Tampil')
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')->label('Nama Pengunjung')->searchable(),
                Tables\Columns\TextColumn::make('comment')->limit(40)->wrap()->searchable(),
                Tables\Columns\TextColumn::make('reaction')->label('Reaksi'),
                Tables\Columns\IconColumn::make('admin_reply')->label('Dibalas')->boolean()->trueIcon('heroicon-o-check-circle')->falseIcon('heroicon-o-x-circle'),
                Tables\Columns\TextColumn::make('created_at')->label('Tanggal')->dateTime('d M Y')->sortable(),
            ])
            ->filters([
                Filter::make('is_visible')
                    ->label('Hanya tampilkan yang terlihat')
                    ->query(fn (Builder $query): Builder => $query->where('is_visible', 1)),

                Filter::make('is_hidden')
                    ->label('Hanya tampilkan yang tersembunyi')
                    ->query(fn (Builder $query): Builder => $query->where('is_visible', 0)),

                // --- TAMBAHAN BARU: FILTER BERDASARKAN REAKSI ---
                SelectFilter::make('reaction')
                    ->label('Reaksi')
                    ->options([
                        '😄' => '😄',
                        '🙂' => '🙂',
                        '😐' => '😐',
                        '🙁' => '🙁',
                        '😠' => '😠',
                        '😢' => '😢',
                    ])
                    ->placeholder('Semua Reaksi'),

            ])
            ->headerActions([])
            ->actions([
                Tables\Actions\EditAction::make()->label('Lihat & Balas'),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    // Bagian ini tidak perlu diubah
    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (!empty($data['admin_reply'])) {
            $data['replied_at'] = now();
        } else {
            $data['admin_reply'] = null;
            $data['replied_at'] = null;
        }
        return $data;
    }
}