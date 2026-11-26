<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('category', 80);
            $table->unsignedBigInteger('price_amount');
            $table->char('currency', 3)->default('RWF');
            $table->string('image_path')->nullable();
            $table->enum('status', ['draft', 'pending_review', 'published', 'rejected', 'archived'])->default('pending_review');
            $table->timestamps();
            $table->index(['status', 'category']);
        });
    }
    public function down(): void { Schema::dropIfExists('products'); }
};
