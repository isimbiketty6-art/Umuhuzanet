<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Job;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JobsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_published_jobs_are_listed(): void
    {
        $company = Company::create([
            'name' => 'Example Company',
            'slug' => 'example-company',
            'location' => 'Kigali, Rwanda',
            'verification_status' => 'verified',
        ]);

        Job::create([
            'company_id' => $company->id,
            'title' => 'QA Engineer',
            'slug' => 'qa-engineer',
            'description' => 'Test listing',
            'location' => 'Kigali, Rwanda',
            'employment_type' => 'full_time',
            'category' => 'Technology',
            'currency' => 'RWF',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->getJson('/api/v1/jobs')
            ->assertOk()
            ->assertJsonPath('data.0.title', 'QA Engineer');
    }
}
