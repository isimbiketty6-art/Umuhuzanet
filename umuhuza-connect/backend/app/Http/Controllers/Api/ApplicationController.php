<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ApplicationController extends Controller
{
    public function store(Request $request, Job $job)
    {
        abort_unless($job->status === 'published', 404);

        $data = $request->validate([
            'cover_letter' => ['nullable', 'string', 'max:5000'],
            // CV upload should be added using a private disk and strict MIME/size validation.
        ]);

        $existing = Application::where('user_id', $request->user()->id)
            ->where('job_id', $job->id)->exists();

        if ($existing) {
            throw ValidationException::withMessages(['job' => 'You have already applied to this job.']);
        }

        $application = Application::create([
            'user_id' => $request->user()->id,
            'job_id' => $job->id,
            'cover_letter' => $data['cover_letter'] ?? null,
            'status' => 'submitted',
            'applied_at' => now(),
        ]);

        return response()->json(['data' => $application], 201);
    }

    public function mine(Request $request)
    {
        return response()->json(
            Application::where('user_id', $request->user()->id)
                ->with('job.company:id,name,slug')
                ->latest('applied_at')->paginate(12)
        );
    }
}
