<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Board extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'project_id',
    ];

    /**
     * Get the project that owns the board.
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the columns for the board.
     */
    public function columns()
    {
        return $this->hasMany(Column::class)->orderBy('position');
    }
}
