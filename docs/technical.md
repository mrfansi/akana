# Akana - Technical Documentation

## Technology Stack

### Backend

- **Framework**: Laravel 12
- **PHP Version**: 8.2+
- **Database**: MySQL 8.0+
- **Cache**: Redis
- **WebSockets**: Laravel Reverb

### Frontend

- **Framework**: React with Inertia.js
- **UI Components**: ShadCN UI
- **State Management**: React Context API
- **Build Tool**: Vite

## Database Schema

### Core Tables

#### Users

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### Roles

```sql
CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### Role User

```sql
CREATE TABLE role_user (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
```

#### Teams

```sql
CREATE TABLE teams (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### Team User

```sql
CREATE TABLE team_user (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Projects

```sql
CREATE TABLE projects (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    team_id BIGINT UNSIGNED NOT NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);
```

#### Tasks

```sql
CREATE TABLE tasks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    project_id BIGINT UNSIGNED NOT NULL,
    assignee_id BIGINT UNSIGNED NULL,
    reporter_id BIGINT UNSIGNED NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'todo',
    priority VARCHAR(50) NOT NULL DEFAULT 'medium',
    due_date DATE NULL,
    estimated_hours DECIMAL(8, 2) NULL,
    actual_hours DECIMAL(8, 2) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Task Dependencies

```sql
CREATE TABLE task_dependencies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    task_id BIGINT UNSIGNED NOT NULL,
    dependency_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (dependency_id) REFERENCES tasks(id) ON DELETE CASCADE
);
```

#### Comments

```sql
CREATE TABLE comments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    task_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Attachments

```sql
CREATE TABLE attachments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    task_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size BIGINT UNSIGNED NOT NULL,
    file_type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Boards

```sql
CREATE TABLE boards (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    project_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### Columns

```sql
CREATE TABLE columns (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    board_id BIGINT UNSIGNED NOT NULL,
    position INT NOT NULL,
    wip_limit INT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);
```

#### Column Tasks

```sql
CREATE TABLE column_tasks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    column_id BIGINT UNSIGNED NOT NULL,
    task_id BIGINT UNSIGNED NOT NULL,
    position INT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
```

#### Activities

```sql
CREATE TABLE activities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    subject_type VARCHAR(255) NOT NULL,
    subject_id BIGINT UNSIGNED NOT NULL,
    action VARCHAR(255) NOT NULL,
    data JSON NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Implementation Details

### Backend Implementation

#### Directory Structure

```plaintext
app/
├── Console/
├── Events/
│   ├── TaskAssigned.php
│   ├── TaskCreated.php
│   ├── TaskDeleted.php
│   └── TaskUpdated.php
├── Exceptions/
├── Http/
│   ├── Controllers/
│   │   ├── Auth/
│   │   ├── BoardController.php
│   │   ├── CommentController.php
│   │   ├── DashboardController.php
│   │   ├── ProjectController.php
│   │   ├── TaskController.php
│   │   └── TeamController.php
│   ├── Middleware/
│   └── Requests/
│       ├── Board/
│       ├── Project/
│       └── Task/
├── Interfaces/
│   ├── Repositories/
│   │   ├── BoardRepositoryInterface.php
│   │   ├── ProjectRepositoryInterface.php
│   │   └── TaskRepositoryInterface.php
│   └── Services/
│       ├── BoardServiceInterface.php
│       ├── ProjectServiceInterface.php
│       └── TaskServiceInterface.php
├── Listeners/
│   ├── SendTaskAssignedNotification.php
│   ├── SendTaskCreatedNotification.php
│   └── SendTaskUpdatedNotification.php
├── Models/
│   ├── Attachment.php
│   ├── Board.php
│   ├── Column.php
│   ├── Comment.php
│   ├── Project.php
│   ├── Role.php
│   ├── Task.php
│   ├── Team.php
│   └── User.php
├── Notifications/
│   ├── TaskAssigned.php
│   ├── TaskCreated.php
│   └── TaskUpdated.php
├── Policies/
│   ├── BoardPolicy.php
│   ├── ProjectPolicy.php
│   └── TaskPolicy.php
├── Providers/
│   ├── AppServiceProvider.php
│   ├── AuthServiceProvider.php
│   ├── EventServiceProvider.php
│   ├── RepositoryServiceProvider.php
│   └── RouteServiceProvider.php
├── Repositories/
│   ├── BoardRepository.php
│   ├── ProjectRepository.php
│   └── TaskRepository.php
└── Services/
    ├── BoardService.php
    ├── ProjectService.php
    └── TaskService.php
```

#### Model Relationships

```php
// User.php
public function roles()
{
    return $this->belongsToMany(Role::class);
}

public function teams()
{
    return $this->belongsToMany(Team::class);
}

public function assignedTasks()
{
    return $this->hasMany(Task::class, 'assignee_id');
}

public function reportedTasks()
{
    return $this->hasMany(Task::class, 'reporter_id');
}

// Team.php
public function users()
{
    return $this->belongsToMany(User::class);
}

public function projects()
{
    return $this->hasMany(Project::class);
}

// Project.php
public function team()
{
    return $this->belongsTo(Team::class);
}

public function tasks()
{
    return $this->hasMany(Task::class);
}

public function boards()
{
    return $this->hasMany(Board::class);
}

// Board.php
public function project()
{
    return $this->belongsTo(Project::class);
}

public function columns()
{
    return $this->hasMany(Column::class)->orderBy('position');
}

// Column.php
public function board()
{
    return $this->belongsTo(Board::class);
}

public function tasks()
{
    return $this->belongsToMany(Task::class, 'column_tasks')
        ->withPivot('position')
        ->orderBy('column_tasks.position');
}

// Task.php
public function project()
{
    return $this->belongsTo(Project::class);
}

public function assignee()
{
    return $this->belongsTo(User::class, 'assignee_id');
}

public function reporter()
{
    return $this->belongsTo(User::class, 'reporter_id');
}

public function comments()
{
    return $this->hasMany(Comment::class);
}

public function attachments()
{
    return $this->hasMany(Attachment::class);
}

public function columns()
{
    return $this->belongsToMany(Column::class, 'column_tasks')
        ->withPivot('position');
}

public function dependencies()
{
    return $this->belongsToMany(Task::class, 'task_dependencies', 'task_id', 'dependency_id');
}

public function dependents()
{
    return $this->belongsToMany(Task::class, 'task_dependencies', 'dependency_id', 'task_id');
}
```

#### Repository Pattern Implementation

```php
// TaskRepositoryInterface.php
namespace App\Interfaces\Repositories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

interface TaskRepositoryInterface
{
    public function all(): Collection;
    public function findById(int $id): ?Task;
    public function findByProject(int $projectId): Collection;
    public function findByAssignee(int $userId): Collection;
    public function create(array $data): Task;
    public function update(int $id, array $data): ?Task;
    public function delete(int $id): bool;
    public function addDependency(int $taskId, int $dependencyId): bool;
    public function removeDependency(int $taskId, int $dependencyId): bool;
    public function moveToColumn(int $taskId, int $columnId, int $position): bool;
}

// TaskRepository.php
namespace App\Repositories;

use App\Interfaces\Repositories\TaskRepositoryInterface;
use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

class TaskRepository implements TaskRepositoryInterface
{
    public function all(): Collection
    {
        return Task::all();
    }

    public function findById(int $id): ?Task
    {
        return Task::find($id);
    }

    public function findByProject(int $projectId): Collection
    {
        return Task::where('project_id', $projectId)->get();
    }

    public function findByAssignee(int $userId): Collection
    {
        return Task::where('assignee_id', $userId)->get();
    }

    public function create(array $data): Task
    {
        return Task::create($data);
    }

    public function update(int $id, array $data): ?Task
    {
        $task = $this->findById($id);
        if (!$task) {
            return null;
        }
        $task->update($data);
        return $task;
    }

    public function delete(int $id): bool
    {
        $task = $this->findById($id);
        if (!$task) {
            return false;
        }
        return $task->delete();
    }

    public function addDependency(int $taskId, int $dependencyId): bool
    {
        $task = $this->findById($taskId);
        if (!$task) {
            return false;
        }
        $task->dependencies()->attach($dependencyId);
        return true;
    }

    public function removeDependency(int $taskId, int $dependencyId): bool
    {
        $task = $this->findById($taskId);
        if (!$task) {
            return false;
        }
        $task->dependencies()->detach($dependencyId);
        return true;
    }

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

### Service Layer Implementation

```php
// TaskServiceInterface.php
namespace App\Interfaces\Services;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

interface TaskServiceInterface
{
    public function getAllTasks(): Collection;
    public function getTaskById(int $id): ?Task;
    public function getTasksByProject(int $projectId): Collection;
    public function getTasksByAssignee(int $userId): Collection;
    public function createTask(array $data): Task;
    public function updateTask(int $id, array $data): ?Task;
    public function deleteTask(int $id): bool;
    public function addTaskDependency(int $taskId, int $dependencyId): bool;
    public function removeTaskDependency(int $taskId, int $dependencyId): bool;
    public function moveTaskToColumn(int $taskId, int $columnId, int $position): bool;
}

// TaskService.php
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
    protected TaskRepositoryInterface $taskRepository;

    public function __construct(TaskRepositoryInterface $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    public function getAllTasks(): Collection
    {
        return $this->taskRepository->all();
    }

    public function getTaskById(int $id): ?Task
    {
        return $this->taskRepository->findById($id);
    }

    public function getTasksByProject(int $projectId): Collection
    {
        return $this->taskRepository->findByProject($projectId);
    }

    public function getTasksByAssignee(int $userId): Collection
    {
        return $this->taskRepository->findByAssignee($userId);
    }

    public function createTask(array $data): Task
    {
        $task = $this->taskRepository->create($data);
        event(new TaskCreated($task));
        return $task;
    }

    public function updateTask(int $id, array $data): ?Task
    {
        $task = $this->taskRepository->update($id, $data);
        if ($task) {
            event(new TaskUpdated($task));
            
            // If assignee has changed, fire TaskAssigned event
            if (isset($data['assignee_id']) && $task->assignee_id != $data['assignee_id']) {
                event(new TaskAssigned($task));
            }
        }
        return $task;
    }

    public function deleteTask(int $id): bool
    {
        $task = $this->getTaskById($id);
        if ($task) {
            $result = $this->taskRepository->delete($id);
            if ($result) {
                event(new TaskDeleted($task));
            }
            return $result;
        }
        return false;
    }

    public function addTaskDependency(int $taskId, int $dependencyId): bool
    {
        return $this->taskRepository->addDependency($taskId, $dependencyId);
    }

    public function removeTaskDependency(int $taskId, int $dependencyId): bool
    {
        return $this->taskRepository->removeDependency($taskId, $dependencyId);
    }

    public function moveTaskToColumn(int $taskId, int $columnId, int $position): bool
    {
        $result = $this->taskRepository->moveToColumn($taskId, $columnId, $position);
        if ($result) {
            $task = $this->getTaskById($taskId);
            event(new TaskUpdated($task));
        }
        return $result;
    }
}
```

### Controller Implementation

```php
// TaskController.php
namespace App\Http\Controllers;

use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Interfaces\Services\TaskServiceInterface;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    protected TaskServiceInterface $taskService;

    public function __construct(TaskServiceInterface $taskService)
    {
        $this->taskService = $taskService;
    }

    public function index(Request $request)
    {
        $tasks = $this->taskService->getAllTasks();
        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks
        ]);
    }

    public function create()
    {
        return Inertia::render('Tasks/Create');
    }

    public function store(StoreTaskRequest $request)
    {
        $task = $this->taskService->createTask($request->validated());
        return redirect()->route('tasks.show', $task->id)
            ->with('success', 'Task created successfully.');
    }

    public function show(Task $task)
    {
        return Inertia::render('Tasks/Show', [
            'task' => $task->load(['assignee', 'reporter', 'comments.user', 'attachments', 'dependencies', 'dependents'])
        ]);
    }

    public function edit(Task $task)
    {
        return Inertia::render('Tasks/Edit', [
            'task' => $task->load(['assignee', 'reporter', 'dependencies', 'dependents'])
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->taskService->updateTask($task->id, $request->validated());
        return redirect()->route('tasks.show', $task->id)
            ->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        $this->taskService->deleteTask($task->id);
        return redirect()->route('tasks.index')
            ->with('success', 'Task deleted successfully.');
    }

    public function moveToColumn(Request $request, Task $task)
    {
        $request->validate([
            'column_id' => 'required|exists:columns,id',
            'position' => 'required|integer|min:0'
        ]);

        $this->taskService->moveTaskToColumn(
            $task->id,
            $request->column_id,
            $request->position
        );

        return response()->json(['success' => true]);
    }
}
```

## Frontend Implementation

### Directory Structure

```plaintext
resources/
├── js/
│   ├── Components/
│   │   ├── Board/
│   │   │   ├── Column.jsx
│   │   │   ├── Task.jsx
│   │   │   └── TaskDetails.jsx
│   │   ├── Dashboard/
│   │   │   ├── ProjectSummary.jsx
│   │   │   ├── RoleBasedMetrics.jsx
│   │   │   └── TasksOverview.jsx
│   │   ├── Layout/
│   │   │   ├── AppLayout.jsx
│   │   │   ├── MainNavigation.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── Project/
│   │   │   ├── ProjectForm.jsx
│   │   │   └── ProjectList.jsx
│   │   ├── Task/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   └── TaskTimeline.jsx
│   │   └── UI/
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Dropdown.jsx
│   │       ├── Modal.jsx
│   │       └── Table.jsx
│   ├── Layouts/
│   │   └── AuthenticatedLayout.jsx
│   ├── Pages/
│   │   ├── Auth/
│   │   ├── Boards/
│   │   │   ├── Create.jsx
│   │   │   ├── Edit.jsx
│   │   │   ├── Index.jsx
│   │   │   └── Show.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Projects/
│   │   │   ├── Create.jsx
│   │   │   ├── Edit.jsx
│   │   │   ├── Index.jsx
│   │   │   └── Show.jsx
│   │   └── Tasks/
│   │       ├── Create.jsx
│   │       ├── Edit.jsx
│   │       ├── Index.jsx
│   │       └── Show.jsx
│   └── app.jsx
└── css/
    └── app.css
```

### React Component Implementation

```jsx
// resources/js/Components/Board/Column.jsx
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Task from './Task';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';

const Column = ({ column, tasks, onTaskMove, onAddTask }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'task',
        drop: (item) => onTaskMove(item.id, column.id, tasks.length),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <Card className={`w-72 flex-shrink-0 ${isOver ? 'bg-gray-100' : ''}`}>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">{column.name}</h3>
                    <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs">
                        {tasks.length} {column.wip_limit ? `/ ${column.wip_limit}` : ''}
                    </span>
                </div>
                
                <div ref={drop} className="space-y-2 min-h-[200px]">
                    {tasks.map((task, index) => (
                        <Task key={task.id} task={task} index={index} columnId={column.id} />
                    ))}
                </div>
                
                <div className="mt-4">
                    <Button onClick={() => onAddTask(column.id)} variant="ghost" className="w-full">
                        + Add Task
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default Column;
```

```jsx
// resources/js/Pages/Boards/Show.jsx
import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Column from '@/Components/Board/Column';
import TaskDetails from '@/Components/Board/TaskDetails';
import { Button } from '@/Components/UI/Button';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function Show({ auth, board, columns, tasks }) {
    const [selectedTask, setSelectedTask] = useState(null);
    const [boardColumns, setBoardColumns] = useState(columns);
    const [boardTasks, setBoardTasks] = useState(tasks);

    const handleTaskMove = async (taskId, columnId, position) => {
        try {
            await axios.post(`/tasks/${taskId}/move-to-column`, {
                column_id: columnId,
                position: position
            });
            
            // Update local state
            const updatedTasks = [...boardTasks];
            const taskIndex = updatedTasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                updatedTasks[taskIndex].pivot = {
                    ...updatedTasks[taskIndex].pivot,
                    column_id: columnId,
                    position: position
                };
            }
            setBoardTasks(updatedTasks);
        } catch (error) {
            console.error('Error moving task:', error);
        }
    };

    const handleAddColumn = () => {
        router.get(route('boards.columns.create', board.id));
    };

    const handleAddTask = (columnId) => {
        router.get(route('tasks.create', { column_id: columnId, board_id: board.id }));
    };

    const getTasksForColumn = (columnId) => {
        return boardTasks.filter(task => 
            task.columns.some(col => col.id === columnId)
        ).sort((a, b) => {
            const aPosition = a.columns.find(col => col.id === columnId)?.pivot.position || 0;
            const bPosition = b.columns.find(col => col.id === columnId)?.pivot.position || 0;
            return aPosition - bPosition;
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{board.name}</h2>}
        >
            <Head title={board.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">{board.name}</h1>
                                <Button onClick={handleAddColumn}>Add Column</Button>
                            </div>
                            
                            <DndProvider backend={HTML5Backend}>
                                <div className="flex space-x-4 overflow-x-auto pb-4">
                                    {boardColumns.map(column => (
                                        <Column
                                            key={column.id}
                                            column={column}
                                            tasks={getTasksForColumn(column.id)}
                                            onTaskMove={handleTaskMove}
                                            onAddTask={handleAddTask}
                                        />
                                    ))}
                                </div>
                            </DndProvider>
                            
                            {selectedTask && (
                                <TaskDetails
                                    task={selectedTask}
                                    onClose={() => setSelectedTask(null)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
```

## Real-Time Updates with Laravel Reverb

### Event Broadcasting Configuration

```php
// config/broadcasting.php
'reverb' => [
    'driver' => 'reverb',
    'app_id' => env('REVERB_APP_ID'),
    'key' => env('REVERB_APP_KEY'),
    'options' => [
        'host' => env('REVERB_HOST', 'localhost'),
        'port' => env('REVERB_PORT', 8080),
        'scheme' => env('REVERB_SCHEME', 'http'),
    ],
],
```

### Event Implementation

```php
// app/Events/TaskUpdated.php
namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $task;

    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('project.' . $this->task->project_id);
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->task->id,
            'title' => $this->task->title,
            'status' => $this->task->status,
            'assignee_id' => $this->task->assignee_id,
            'updated_at' => $this->task->updated_at->toIso8601String(),
        ];
    }
}
```

### Frontend Integration with Echo

```jsx
// resources/js/bootstrap.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
    wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
    forceTLS: false,
    disableStats: true,
});
```

```jsx
// resources/js/Pages/Boards/Show.jsx (addition to the component)
useEffect(() => {
    // Subscribe to the project channel
    const channel = window.Echo.private(`project.${board.project_id}`);
    
    channel.listen('.task.updated', (e) => {
        // Update the task in the local state
        setBoardTasks(prevTasks => {
            return prevTasks.map(task => {
                if (task.id === e.id) {
                    return { ...task, ...e };
                }
                return task;
            });
        });
    });
    
    // Cleanup subscription on component unmount
    return () => {
        channel.stopListening('.task.updated');
    };
}, [board.project_id]);
```

## Deployment and Setup

### Installation Steps

1. Clone the repository
2. Install PHP dependencies: `composer install`
3. Install JavaScript dependencies: `npm install`
4. Copy environment file: `cp .env.example .env`
5. Generate application key: `php artisan key:generate`
6. Configure database in `.env`
7. Run migrations: `php artisan migrate --seed`
8. Start Laravel Reverb: `php artisan reverb:start`
9. Compile assets: `npm run dev`
10. Start the server: `php artisan serve`

### Environment Configuration

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=akana
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=reverb
REVERB_APP_ID=akana
REVERB_APP_KEY=akana_key
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

## Testing

### Unit Tests

```php
// tests/Unit/TaskServiceTest.php
namespace Tests\Unit;

use App\Events\TaskCreated;
use App\Events\TaskUpdated;
use App\Interfaces\Repositories\TaskRepositoryInterface;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class TaskServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $taskRepository;
    protected $taskService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->taskRepository = $this->createMock(TaskRepositoryInterface::class);
        $this->taskService = new TaskService($this->taskRepository);
    }

    public function test_create_task_fires_event()
    {
        Event::fake();

        $task = new Task();
        $task->id = 1;
        $task->title = 'Test Task';

        $this->taskRepository->method('create')->willReturn($task);

        $result = $this->taskService->createTask(['title' => 'Test Task']);

        $this->assertEquals($task, $result);
        Event::assertDispatched(TaskCreated::class, function ($event) use ($task) {
            return $event->task->id === $task->id;
        });
    }

    public function test_update_task_fires_event()
    {
        Event::fake();

        $task = new Task();
        $task->id = 1;
        $task->title = 'Updated Task';

        $this->taskRepository->method('update')->willReturn($task);
        $this->taskRepository->method('findById')->willReturn($task);

        $result = $this->taskService->updateTask(1, ['title' => 'Updated Task']);

        $this->assertEquals($task, $result);
        Event::assertDispatched(TaskUpdated::class, function ($event) use ($task) {
            return $event->task->id === $task->id;
        });
    }
}
```

### Feature Tests

```php
// tests/Feature/TaskControllerTest.php
namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_displays_tasks()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create();

        $response = $this->actingAs($user)->get(route('tasks.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Tasks/Index')
            ->has('tasks')
        );
    }

    public function test_store_creates_new_task()
    {
        $user = User::factory()->create();
        $taskData = Task::factory()->make()->toArray();

        $response = $this->actingAs($user)->post(route('tasks.store'), $taskData);

        $response->assertRedirect();
        $this->assertDatabaseHas('tasks', [
            'title' => $taskData['title'],
        ]);
    }

    public function test_update_modifies_task()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create();
        $updatedData = ['title' => 'Updated Title'];

        $response = $this->actingAs($user)->put(route('tasks.update', $task), $updatedData);

        $response->assertRedirect();
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Updated Title',
        ]);
    }
}
```