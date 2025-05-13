<?php

namespace App\Interfaces\Services;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

interface ProjectServiceInterface
{
    /**
     * Get all projects.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllProjects(): Collection;

    /**
     * Get a project by its ID.
     *
     * @param int $id
     * @return \App\Models\Project|null
     */
    public function getProjectById(int $id): ?Project;

    /**
     * Get projects by team ID.
     *
     * @param int $teamId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getProjectsByTeam(int $teamId): Collection;

    /**
     * Create a new project.
     *
     * @param array $data
     * @return \App\Models\Project
     */
    public function createProject(array $data): Project;

    /**
     * Update a project.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\Project|null
     */
    public function updateProject(int $id, array $data): ?Project;

    /**
     * Delete a project.
     *
     * @param int $id
     * @return bool
     */
    public function deleteProject(int $id): bool;
}
