<?php

namespace App\Interfaces\Repositories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

interface TaskRepositoryInterface
{
    /**
     * Get all tasks.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all(): Collection;

    /**
     * Find a task by its ID.
     *
     * @param int $id
     * @return \App\Models\Task|null
     */
    public function findById(int $id): ?Task;

    /**
     * Find tasks by project ID.
     *
     * @param int $projectId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findByProject(int $projectId): Collection;

    /**
     * Find tasks by assignee ID.
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findByAssignee(int $userId): Collection;

    /**
     * Create a new task.
     *
     * @param array $data
     * @return \App\Models\Task
     */
    public function create(array $data): Task;

    /**
     * Update a task.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\Task|null
     */
    public function update(int $id, array $data): ?Task;

    /**
     * Delete a task.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Add a dependency to a task.
     *
     * @param int $taskId
     * @param int $dependencyId
     * @return bool
     */
    public function addDependency(int $taskId, int $dependencyId): bool;

    /**
     * Remove a dependency from a task.
     *
     * @param int $taskId
     * @param int $dependencyId
     * @return bool
     */
    public function removeDependency(int $taskId, int $dependencyId): bool;

    /**
     * Move a task to a column.
     *
     * @param int $taskId
     * @param int $columnId
     * @param int $position
     * @return bool
     */
    public function moveToColumn(int $taskId, int $columnId, int $position): bool;
}
