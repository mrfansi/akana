<?php

namespace App\Services;

use App\Events\TaskAssigned;
use App\Events\TaskCreated;
use App\Events\TaskDeleted;
use App\Events\TaskUpdated;
use App\Interfaces\Repositories\TaskRepositoryInterface;
use App\Interfaces\Services\TaskServiceInterface;
use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class TaskService implements TaskServiceInterface
{
    /**
     * The task repository instance.
     *
     * @var \App\Interfaces\Repositories\TaskRepositoryInterface
     */
    protected TaskRepositoryInterface $taskRepository;

    /**
     * Create a new service instance.
     *
     * @param \App\Interfaces\Repositories\TaskRepositoryInterface $taskRepository
     * @return void
     */
    public function __construct(TaskRepositoryInterface $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    /**
     * Get all tasks.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllTasks(): Collection
    {
        return $this->taskRepository->all();
    }

    /**
     * Get a task by its ID.
     *
     * @param int $id
     * @return \App\Models\Task|null
     */
    public function getTaskById(int $id): ?Task
    {
        return $this->taskRepository->findById($id);
    }

    /**
     * Get tasks by project ID.
     *
     * @param int $projectId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getTasksByProject(int $projectId): Collection
    {
        return $this->taskRepository->findByProject($projectId);
    }

    /**
     * Get tasks by assignee ID.
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getTasksByAssignee(int $userId): Collection
    {
        return $this->taskRepository->findByAssignee($userId);
    }

    /**
     * Create a new task.
     *
     * @param array $data
     * @return \App\Models\Task
     */
    public function createTask(array $data): Task
    {
        // If reporter_id is not set, use the authenticated user
        if (!isset($data['reporter_id']) && Auth::check()) {
            $data['reporter_id'] = Auth::id();
        }

        $task = $this->taskRepository->create($data);

        // Dispatch task created event
        event(new TaskCreated($task));

        return $task;
    }

    /**
     * Update a task.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\Task|null
     */
    public function updateTask(int $id, array $data): ?Task
    {
        $task = $this->getTaskById($id);
        if (!$task) {
            return null;
        }

        // Check if assignee has changed
        $assigneeChanged = isset($data['assignee_id']) && $task->assignee_id != $data['assignee_id'];

        $task = $this->taskRepository->update($id, $data);

        // Dispatch task updated event
        event(new TaskUpdated($task));

        // If assignee has changed, dispatch task assigned event
        if ($assigneeChanged) {
            event(new TaskAssigned($task));
        }

        return $task;
    }

    /**
     * Delete a task.
     *
     * @param int $id
     * @return bool
     */
    public function deleteTask(int $id): bool
    {
        $task = $this->getTaskById($id);
        if (!$task) {
            return false;
        }

        $result = $this->taskRepository->delete($id);

        if ($result) {
            // Dispatch task deleted event
            event(new TaskDeleted($task));
        }

        return $result;
    }

    /**
     * Add a dependency to a task.
     *
     * @param int $taskId
     * @param int $dependencyId
     * @return bool
     */
    public function addTaskDependency(int $taskId, int $dependencyId): bool
    {
        return $this->taskRepository->addDependency($taskId, $dependencyId);
    }

    /**
     * Remove a dependency from a task.
     *
     * @param int $taskId
     * @param int $dependencyId
     * @return bool
     */
    public function removeTaskDependency(int $taskId, int $dependencyId): bool
    {
        return $this->taskRepository->removeDependency($taskId, $dependencyId);
    }

    /**
     * Move a task to a column.
     *
     * @param int $taskId
     * @param int $columnId
     * @param int $position
     * @return bool
     */
    public function moveTaskToColumn(int $taskId, int $columnId, int $position): bool
    {
        $result = $this->taskRepository->moveToColumn($taskId, $columnId, $position);

        if ($result) {
            $task = $this->getTaskById($taskId);
            // Dispatch task updated event
            event(new TaskUpdated($task));
        }

        return $result;
    }
}
