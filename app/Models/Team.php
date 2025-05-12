<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Team extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'owner_id',
    ];

    /**
     * Get the owner of the team.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * The members that belong to the team.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_members')
            ->withPivot('role_in_team') // As per ERD: TEAMS_MEMBERS has role_in_team
            ->withTimestamps(); // As per ERD: TEAMS_MEMBERS has joined_at (covered by timestamps)
    }

    // Relationship for projects owned by the team can be added later
    // public function projects(): HasMany
    // {
    //     return $this->hasMany(Project::class);
    // }
}
