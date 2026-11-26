<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('description');
            $table->string('location')->default('Kigali, Rwanda');
            $table->enum('employment_type', ['full_time', 'part_time', 'contract', 'internship', 'freelance'])->default('full_time');
            $table->string('category')->default('Other');
            $table->unsignedBigInteger('salary_min')->nullable();
            $table->unsignedBigInteger('salary_max')->nullable();
            $table->char('currency', 3)->default('RWF');
            $table->enum('status', ['draft', 'pending_review', 'published', 'closed', 'rejected'])->default('pending_review');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'published_at']);
            $table->index(['location', 'category']);
        });
    }
    public function down(): void { Schema::dropIfExists('jobs'); }
};
