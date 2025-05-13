<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * The task service instance.
     *
     * @var \App\Interfaces\Services\TaskServiceInterface
     */
    protected $taskService;

    /**
     * Create a new controller instance.
     *
     * @param \App\Interfaces\Services\TaskServiceInterface $taskService
     * @return void
     */
    public function __construct(\App\Interfaces\Services\TaskServiceInterface $taskService)
    {
        $this->taskService = $taskService;
    }

    /**
     * Display a listing of the tasks.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $tasks = $this->taskService->getAllTasks();
        
        return inertia('Tasks/Index', [
            'tasks' => $tasks
        ]);
    }

    /**
     * Show the form for creating a new task.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return inertia('Tasks/Create');
    }

    /**
     * Store a newly created task in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'assignee_id' => 'nullable|exists:users,id',
            'status' => 'nullable|string|max:50',
            'priority' => 'nullable|string|max:50',
            'due_date' => 'nullable|date',
            'estimated_hours' => 'nullable|numeric|min:0',
        ]);

        $task = $this->taskService->createTask($validated);

        return redirect()->route('tasks.show', $task->id)
            ->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified task.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $task = $this->taskService->getTaskById($id);
        
        if (!$task) {
            abort(404);
        }

        // Load relationships
        $task->load(['assignee', 'reporter', 'project', 'comments.user', 'attachments']);

        return inertia('Tasks/Show', [
            'task' => $task
        ]);
    }

    /**
     * Show the form for editing the specified task.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $task = $this->taskService->getTaskById($id);
        
        if (!$task) {
            abort(404);
        }

        // Load relationships
        $task->load(['assignee', 'reporter', 'project']);

        return inertia('Tasks/Edit', [
            'task' => $task
        ]);
    }

    /**
     * Update the specified task in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assignee_id' => 'nullable|exists:users,id',
            'status' => 'nullable|string|max:50',
            'priority' => 'nullable|string|max:50',
            'due_date' => 'nullable|date',
            'estimated_hours' => 'nullable|numeric|min:0',
            'actual_hours' => 'nullable|numeric|min:0',
        ]);

        $task = $this->taskService->updateTask($id, $validated);

        if (!$task) {
            abort(404);
        }

        return redirect()->route('tasks.show', $task->id)
            ->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified task from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $result = $this->taskService->deleteTask($id);

        if (!$result) {
            abort(404);
        }

        return redirect()->route('tasks.index')
            ->with('success', 'Task deleted successfully.');
    }

    /**
     * Move a task to a column.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function moveToColumn(Request $request, $id)
    {
        $validated = $request->validate([
            'column_id' => 'required|exists:columns,id',
            'position' => 'required|integer|min:0',
        ]);

        $result = $this->taskService->moveTaskToColumn(
            $id,
            $validated['column_id'],
            $validated['position']
        );

        if (!$result) {
            return response()->json(['error' => 'Failed to move task'], 400);
        }

        return response()->json(['success' => true]);
    }
}
