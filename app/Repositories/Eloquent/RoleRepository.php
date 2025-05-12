<?php

namespace App\Repositories\Eloquent;

use App\Models\Role;
use App\Repositories\Contracts\RoleRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class RoleRepository extends BaseRepository implements RoleRepositoryInterface
{
    /**
     * RoleRepository constructor.
     */
    public function __construct(Role $model)
    {
        parent::__construct($model);
    }

    /**
     * {@inheritDoc}
     */
    public function findByName(string $name): ?Role
    {
        return $this->model->where('name', $name)->first();
    }

    /**
     * {@inheritDoc}
     */
    public function getRolesForUser(int $userId): Collection
    {
        return $this->model->whereHas('users', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->get();
    }

    /**
     * {@inheritDoc}
     */
    public function exists(string $name): bool
    {
        return $this->model->where('name', $name)->exists();
    }

    /**
     * {@inheritDoc}
     */
    public function getUsersWithRole(int $roleId): Collection
    {
        $role = $this->find($roleId);

        if (! $role) {
            return new Collection;
        }

        return $role->users;
    }
}
