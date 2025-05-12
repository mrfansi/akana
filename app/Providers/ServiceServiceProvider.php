<?php

namespace App\Providers;

use App\Services\Contracts\AuthServiceInterface;
use App\Services\Implementations\AuthService;
use Illuminate\Support\ServiceProvider;

class ServiceServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Bind AuthService
        $this->app->bind(AuthServiceInterface::class, AuthService::class);

        // Additional services can be bound here as the application grows
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
