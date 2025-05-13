<?php

namespace App\Repositories;

use App\Interfaces\Repositories\TaskRepositoryInterface;
use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

class TaskRepository implements TaskRepositoryInterface
{
    /**
     * Get all tasks.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all(): Collection
    {
        return Task::all();
    }

    /**
     * Find a task by its ID.
     *
     * @param int $id
     * @return \App\Models\Task|null
     */
    public function findById(int $id): ?Task
    {
        $result = Task::find($id);
        return $result instanceof Task ? $result : null;
    }

    /**
     * Find tasks by project ID.
     *
     * @param int $projectId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findByProject(int $projectId): Collection
    {
        return Task::where('project_id', $projectId)->get();
    }

    /**
     * Find tasks by assignee ID.
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findByAssignee(int $userId): Collection
    {
        return Task::where('assignee_id', $userId)->get();
    }

    /**
     * Create a new task.
     *
     * @param array $data
     * @return \App\Models\Task
     */
    public function create(array $data): Task
    {
        return Task::create($data);
    }

    /**
     * Update a task.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\Task|null
     */
    public function update(int $id, array $data): ?Task
    {
        $task = $this->findById($id);
        if (!$task) {
            return null;
        }
        $task->update($data);
        return $task;
    }

    /**
     * Delete a task.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $task = $this->findById($id);
        if (!$task) {
            return false;
        }
        return $task->delete();
    }

    /**
     * Add a dependency to a task.
     *
     * @param int $taskId
     * @param int $dependencyId
     * @return bool
     */
    public function addDependency(int $taskId, int $dependencyId): bool
    {
        $task = $this->findById($taskId);
        if (!$task) {
            return false;
        }
        $task->dependencies()->attach($dependencyId);
        return true;
    }

    /**
     * Remove a dependency from a task.
     *
     * @param int $taskId
     * @param int $dependencyId
     * @return bool
     */
    public function removeDependency(int $taskId, int $dependencyId): bool
    {
        $task = $this->findById($taskId);
        if (!$task) {
            return false;
        }
        $task->dependencies()->detach($dependencyId);
        return true;
    }

    /**
     * Move a task to a column.
     *
     * @param int $taskId
     * @param int $columnId
     * @param int $position
     * @return bool
     */
    public function moveToColumn(int $taskId, int $columnId, int $position): bool
    {
        $task = $this->findById($taskId);
        if (!$task) {
            return false;
        }

        // Detach from all columns
        $task->columns()->detach();

        // Attach to new column with position
        $task->columns()->attach($columnId, ['position' => $position]);

        return true;
    }
}
