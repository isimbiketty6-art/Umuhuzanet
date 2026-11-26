<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 32)->nullable()->unique();
            $table->string('location')->nullable();
            $table->string('headline')->nullable();
            $table->text('bio')->nullable();
            $table->json('skills')->nullable();
            $table->enum('account_status', ['active', 'suspended', 'pending_verification'])->default('active');
        });
    }
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['phone']);
            $table->dropColumn(['phone', 'location', 'headline', 'bio', 'skills', 'account_status']);
        });
    }
};
