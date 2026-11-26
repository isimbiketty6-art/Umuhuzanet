<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id', 'title', 'slug', 'description', 'location',
        'employment_type', 'category', 'salary_min', 'salary_max',
        'currency', 'status', 'published_at',
    ];

    protected function casts(): array
    {
        return ['published_at' => 'datetime', 'salary_min' => 'integer', 'salary_max' => 'integer'];
    }

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function applications(): HasMany { return $this->hasMany(Application::class); }
}
