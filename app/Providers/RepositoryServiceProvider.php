<?php

namespace App\Providers;

use App\Interfaces\Repositories\BoardRepositoryInterface;
use App\Interfaces\Repositories\ProjectRepositoryInterface;
use App\Interfaces\Repositories\TaskRepositoryInterface;
use App\Interfaces\Services\BoardServiceInterface;
use App\Interfaces\Services\ProjectServiceInterface;
use App\Interfaces\Services\TaskServiceInterface;
use App\Repositories\BoardRepository;
use App\Repositories\ProjectRepository;
use App\Repositories\TaskRepository;
use App\Services\BoardService;
use App\Services\ProjectService;
use App\Services\TaskService;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register repositories
        $this->app->bind(TaskRepositoryInterface::class, TaskRepository::class);
        $this->app->bind(ProjectRepositoryInterface::class, ProjectRepository::class);
        $this->app->bind(BoardRepositoryInterface::class, BoardRepository::class);

        // Register services
        $this->app->bind(TaskServiceInterface::class, TaskService::class);
        $this->app->bind(ProjectServiceInterface::class, ProjectService::class);
        $this->app->bind(BoardServiceInterface::class, BoardService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
