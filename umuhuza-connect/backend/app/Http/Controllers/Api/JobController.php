<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
            'location' => ['nullable', 'string', 'max:120'],
            'type' => ['nullable', 'in:full_time,part_time,contract,internship,freelance'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $jobs = Job::query()
            ->with('company:id,name,slug,location,logo_path,verification_status')
            ->where('status', 'published')
            ->when($validated['q'] ?? null, fn ($q, $term) => $q->where(function ($inner) use ($term) {
                $inner->where('title', 'like', "%{$term}%")
                    ->orWhere('description', 'like', "%{$term}%")
                    ->orWhere('category', 'like', "%{$term}%");
            }))
            ->when($validated['location'] ?? null, fn ($q, $location) => $q->where('location', 'like', "%{$location}%"))
            ->when($validated['type'] ?? null, fn ($q, $type) => $q->where('employment_type', $type))
            ->latest('published_at')
            ->paginate(12);

        return response()->json($jobs);
    }

    public function show(Job $job)
    {
        abort_unless($job->status === 'published', 404);
        return response()->json($job->load('company:id,name,slug,location,logo_path,verification_status'));
    }
}
