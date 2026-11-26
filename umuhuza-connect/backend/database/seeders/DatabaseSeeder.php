<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Job;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Clearly illustrative demo data. Replace with real, permission-checked verified listings.
        $company = Company::firstOrCreate(
            ['slug' => 'demo-kigali-digital-labs'],
            ['name' => 'Demo Kigali Digital Labs', 'location' => 'Kigali, Rwanda', 'verification_status' => 'unverified']
        );

        Job::firstOrCreate(
            ['slug' => 'demo-frontend-developer'],
            [
                'company_id' => $company->id,
                'title' => 'Demo Frontend Developer',
                'description' => 'Illustrative listing for local development only. Do not treat this as a real vacancy.',
                'location' => 'Kigali, Rwanda',
                'employment_type' => 'full_time',
                'category' => 'Technology',
                'salary_min' => 500000,
                'salary_max' => 900000,
                'currency' => 'RWF',
                'status' => 'published',
                'published_at' => now(),
            ]
        );
    }
}
