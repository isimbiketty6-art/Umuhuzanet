<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['seller_id', 'name', 'slug', 'description', 'category', 'price_amount', 'currency', 'image_path', 'status'];

    protected function casts(): array
    {
        return ['price_amount' => 'integer'];
    }

    public function seller(): BelongsTo { return $this->belongsTo(User::class, 'seller_id'); }
}
