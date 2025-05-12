<?php

namespace App\Repositories\Contracts;

use App\Models\Role;
use Illuminate\Database\Eloquent\Collection;

interface RoleRepositoryInterface extends RepositoryInterface
{
    /**
     * Find a role by name.
     */
    public function findByName(string $name): ?Role;

    /**
     * Get roles for a specific user.
     */
    public function getRolesForUser(int $userId): Collection;

    /**
     * Check if a role exists.
     */
    public function exists(string $name): bool;

    /**
     * Get users with a specific role.
     */
    public function getUsersWithRole(int $roleId): Collection;
}
