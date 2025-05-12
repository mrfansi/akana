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

```
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