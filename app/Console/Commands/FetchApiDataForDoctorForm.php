<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class FetchApiDataForDoctorForm extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fetch-doctor-form-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetches and caches data for the doctor form from various external APIs.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to fetch external data for doctor form...');

        try {
            $this->fetchAndCacheUniversities();
            $this->fetchAndCacheWorkplaces();
        } catch (\Exception $e) {
            $this->error('An error occurred: ' . $e->getMessage());
            Log::error('Failed to fetch doctor form data: ' . $e->getMessage());
            return 1; // Return error code
        }
        
        $this->info('Successfully fetched and cached all data.');
        return 0; // Return success code
    }

    private function fetchAndCacheUniversities()
    {
        $this->line('Fetching university data...');
        $response = Http::get('https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json');

        if ($response->successful()) {
            $data = $response->json();
            $universityNames = collect($data)->pluck('name')->unique()->sort()->values()->all();
            
            // Simpan di cache selamanya (atau tentukan durasi, misal 24 jam)
            Cache::forever('form_data_universities', $universityNames);
            
            $this->info('Successfully cached ' . count($universityNames) . ' universities.');
        } else {
            $this->error('Failed to fetch university data.');
        }
    }

    private function fetchAndCacheWorkplaces()
    {
        $this->line('Fetching workplace data (Faskes)...');
        $dataSources = [
            ['url' => 'https://raw.githubusercontent.com/ekaputra07/List-Rumah-Sakit-Indonesia/master/listrs.json', 'type' => 'json', 'key' => 'nama'],
            ['url' => 'https://raw.githubusercontent.com/devsiko/data-faskes-indonesia/master/data/klinik.json', 'type' => 'json', 'key' => 'nama'],
            ['url' => 'https://raw.githubusercontent.com/ubanteroz/satu-data/main/data/kesehatan/dinas_kesehatan.csv', 'type' => 'csv', 'key' => 'dinas_kesehatan'],
            ['url' => 'https://raw.githubusercontent.com/ubanteroz/satu-data/main/data/kesehatan/puskesmas.csv', 'type' => 'csv', 'key' => 'nama_puskesmas'],
            ['url' => 'https://raw.githubusercontent.com/ubanteroz/satu-data/main/data/kesehatan/rumah_sakit.csv', 'type' => 'csv', 'key' => 'nama_rs'],
        ];

        $combinedPlaces = [];
        foreach ($dataSources as $source) {
            $response = Http::get($source['url']);
            if ($response->successful()) {
                $this->comment('Processing: ' . $source['url']);
                $names = [];
                if ($source['type'] === 'json') {
                    $names = collect($response->json())->pluck($source['key'])->filter()->all();
                } elseif ($source['type'] === 'csv') {
                    $names = $this->parseCsvFromText($response->body(), $source['key']);
                }
                $combinedPlaces = array_merge($combinedPlaces, $names);
            } else {
                $this->warn('Could not fetch from: ' . $source['url']);
            }
        }

        $uniquePlaces = collect($combinedPlaces)->filter()->unique()->sort()->values()->all();
        
        Cache::forever('form_data_workplaces', $uniquePlaces);

        $this->info('Successfully cached ' . count($uniquePlaces) . ' unique workplaces.');
    }

    private function parseCsvFromText(string $csvText, string $columnName): array
    {
        $lines = str_getcsv($csvText, "\n"); // Split ke baris-baris
        if (count($lines) < 2) return [];

        $headerLine = array_shift($lines);
        $header = str_getcsv($headerLine, ',');
        
        $columnIndex = array_search($columnName, $header);
        if ($columnIndex === false) return [];

        $values = [];
        foreach ($lines as $line) {
            $row = str_getcsv($line, ',');
            if (isset($row[$columnIndex]) && !empty(trim($row[$columnIndex]))) {
                $values[] = trim($row[$columnIndex]);
            }
        }
        return $values;
    }
}