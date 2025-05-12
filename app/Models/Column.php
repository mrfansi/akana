<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Column extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'board_id',
        'position',
        'wip_limit',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'position' => 'integer',
        'wip_limit' => 'integer',
    ];

    /**
     * Get the board that owns the column.
     */
    public function board()
    {
        return $this->belongsTo(Board::class);
    }

    /**
     * Get the tasks for the column.
     */
    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'column_tasks')
            ->withPivot('position')
            ->orderBy('column_tasks.position');
    }
}
