<?php

namespace App\Providers;

use App\Models\Role;
use App\Models\User;
use App\Repositories\Contracts\RoleRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\RoleRepository;
use App\Repositories\Eloquent\UserRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Bind UserRepository
        $this->app->bind(UserRepositoryInterface::class, function ($app) {
            return new UserRepository(new User);
        });

        // Bind RoleRepository
        $this->app->bind(RoleRepositoryInterface::class, function ($app) {
            return new RoleRepository(new Role);
        });

        // Additional repositories can be bound here as the application grows
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
