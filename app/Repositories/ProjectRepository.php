<?php

namespace App\Repositories;

use App\Interfaces\Repositories\ProjectRepositoryInterface;
use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class ProjectRepository implements ProjectRepositoryInterface
{
    /**
     * Get all projects.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all(): Collection
    {
        return Project::all();
    }

    /**
     * Find a project by its ID.
     *
     * @param int $id
     * @return \App\Models\Project|null
     */
    public function findById(int $id): ?Project
    {
        $result = Project::find($id);
        return $result instanceof Project ? $result : null;
    }

    /**
     * Find projects by team ID.
     *
     * @param int $teamId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findByTeam(int $teamId): Collection
    {
        return Project::where('team_id', $teamId)->get();
    }

    /**
     * Create a new project.
     *
     * @param array $data
     * @return \App\Models\Project
     */
    public function create(array $data): Project
    {
        return Project::create($data);
    }

    /**
     * Update a project.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\Project|null
     */
    public function update(int $id, array $data): ?Project
    {
        $project = $this->findById($id);
        if (!$project) {
            return null;
        }
        $project->update($data);
        return $project;
    }

    /**
     * Delete a project.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $project = $this->findById($id);
        if (!$project) {
            return false;
        }
        return $project->delete();
    }
}
