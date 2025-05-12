<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    /**
     * UserRepository constructor.
     */
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * {@inheritDoc}
     */
    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    /**
     * {@inheritDoc}
     */
    public function getUsersWithRole(string $roleName): Collection
    {
        return $this->model->whereHas('roles', function ($query) use ($roleName) {
            $query->where('name', $roleName);
        })->get();
    }

    /**
     * {@inheritDoc}
     */
    public function getUsersInTeam(int $teamId): Collection
    {
        return $this->model->whereHas('teams', function ($query) use ($teamId) {
            $query->where('team_id', $teamId);
        })->get();
    }

    /**
     * {@inheritDoc}
     */
    public function assignRole(int $userId, int $roleId): bool
    {
        $user = $this->find($userId);

        if (! $user) {
            return false;
        }

        // Check if the role is already assigned
        if ($user->roles()->where('role_id', $roleId)->exists()) {
            return true; // Role already assigned
        }

        $user->roles()->attach($roleId);

        return true;
    }

    /**
     * {@inheritDoc}
     */
    public function removeRole(int $userId, int $roleId): bool
    {
        $user = $this->find($userId);

        if (! $user) {
            return false;
        }

        $user->roles()->detach($roleId);

        return true;
    }

    /**
     * {@inheritDoc}
     */
    public function hasRole(int $userId, string $roleName): bool
    {
        $user = $this->find($userId);

        if (! $user) {
            return false;
        }

        return $user->roles()->where('name', $roleName)->exists();
    }
}
