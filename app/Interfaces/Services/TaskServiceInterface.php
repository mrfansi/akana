<?php

namespace App\Interfaces\Services;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

interface TaskServiceInterface
{
    /**
     * Get all tasks.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllTasks(): Collection;

    /**
     * Get a task by its ID.
     *
     * @param int $id
     * @return \App\Models\Task|null
     */
    public function getTaskById(int $id): ?Task;

    /**
     * Get tasks by project ID.
     *
     * @param int $projectId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getTasksByProject(int $projectId): Collection;

    /**
     * Get tasks by assignee ID.
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getTasksByAssignee(int $userId): Collection;

    /**
     * Create a new task.
     *
     * @param array $data
     * @return \App\Models\Task
     */
    public function createTask(array $data): Task;

    /**
     * Update a task.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\Task|null
     */
    public function updateTask(int $id, array $data): ?Task;

    /**
     * Delete a task.
     *
     * @param int $id
     * @return bool
     */
    public function deleteTask(int $id): bool;

    /**
     * Add a dependency to a task.
     *
     * @param int $taskId
     * @param int $dependencyId
     * @return bool
     */
    public function addTaskDependency(int $taskId, int $dependencyId): bool;

    /**
     * Remove a dependency from a task.
     *
     * @param int $taskId
     * @param int $dependencyId
     * @return bool
     */
    public function removeTaskDependency(int $taskId, int $dependencyId): bool;

    /**
     * Move a task to a column.
     *
     * @param int $taskId
     * @param int $columnId
     * @param int $position
     * @return bool
     */
    public function moveTaskToColumn(int $taskId, int $columnId, int $position): bool;
}
