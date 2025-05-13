<?php

namespace App\Services;

use App\Interfaces\Repositories\ProjectRepositoryInterface;
use App\Interfaces\Services\ProjectServiceInterface;
use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class ProjectService implements ProjectServiceInterface
{
    /**
     * The project repository instance.
     *
     * @var \App\Interfaces\Repositories\ProjectRepositoryInterface
     */
    protected ProjectRepositoryInterface $projectRepository;

    /**
     * Create a new service instance.
     *
     * @param \App\Interfaces\Repositories\ProjectRepositoryInterface $projectRepository
     * @return void
     */
    public function __construct(ProjectRepositoryInterface $projectRepository)
    {
        $this->projectRepository = $projectRepository;
    }

    /**
     * Get all projects.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllProjects(): Collection
    {
        return $this->projectRepository->all();
    }

    /**
     * Get a project by its ID.
     *
     * @param int $id
     * @return \App\Models\Project|null
     */
    public function getProjectById(int $id): ?Project
    {
        return $this->projectRepository->findById($id);
    }

    /**
     * Get projects by team ID.
     *
     * @param int $teamId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getProjectsByTeam(int $teamId): Collection
    {
        return $this->projectRepository->findByTeam($teamId);
    }

    /**
     * Create a new project.
     *
     * @param array $data
     * @return \App\Models\Project
     */
    public function createProject(array $data): Project
    {
        return $this->projectRepository->create($data);
    }

    /**
     * Update a project.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\Project|null
     */
    public function updateProject(int $id, array $data): ?Project
    {
        return $this->projectRepository->update($id, $data);
    }

    /**
     * Delete a project.
     *
     * @param int $id
     * @return bool
     */
    public function deleteProject(int $id): bool
    {
        return $this->projectRepository->delete($id);
    }
}
