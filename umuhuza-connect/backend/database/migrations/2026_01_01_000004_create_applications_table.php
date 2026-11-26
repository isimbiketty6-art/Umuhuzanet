<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('job_id')->constrained()->cascadeOnDelete();
            $table->text('cover_letter')->nullable();
            $table->string('cv_path')->nullable();
            $table->enum('status', ['submitted', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'])->default('submitted');
            $table->timestamp('applied_at')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'job_id']);
            $table->index(['job_id', 'status']);
        });
    }
    public function down(): void { Schema::dropIfExists('applications'); }
};
