<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface extends RepositoryInterface
{
    /**
     * Find a user by email.
     */
    public function findByEmail(string $email): ?User;

    /**
     * Get users with specific role.
     */
    public function getUsersWithRole(string $roleName): Collection;

    /**
     * Get users in a specific team.
     */
    public function getUsersInTeam(int $teamId): Collection;

    /**
     * Assign role to user.
     */
    public function assignRole(int $userId, int $roleId): bool;

    /**
     * Remove role from user.
     */
    public function removeRole(int $userId, int $roleId): bool;

    /**
     * Check if user has role.
     */
    public function hasRole(int $userId, string $roleName): bool;
}
