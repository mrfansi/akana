<?php

namespace App\Interfaces\Repositories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

interface ProjectRepositoryInterface
{
    /**
     * Get all projects.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all(): Collection;

    /**
     * Find a project by its ID.
     *
     * @param int $id
     * @return \App\Models\Project|null
     */
    public function findById(int $id): ?Project;

    /**
     * Find projects by team ID.
     *
     * @param int $teamId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findByTeam(int $teamId): Collection;

    /**
     * Create a new project.
     *
     * @param array $data
     * @return \App\Models\Project
     */
    public function create(array $data): Project;

    /**
     * Update a project.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\Project|null
     */
    public function update(int $id, array $data): ?Project;

    /**
     * Delete a project.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool;
}
