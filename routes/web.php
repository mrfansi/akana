<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    
    // Task routes
    Route::resource('tasks', App\Http\Controllers\TaskController::class);
    Route::post('tasks/{id}/move', [App\Http\Controllers\TaskController::class, 'moveToColumn'])->name('tasks.move');
    
    // Project routes
    Route::resource('projects', App\Http\Controllers\ProjectController::class);
    
    // Board routes
    Route::resource('boards', App\Http\Controllers\BoardController::class);
    Route::post('boards/{id}/columns', [App\Http\Controllers\BoardController::class, 'addColumn'])->name('boards.columns.add');
    Route::put('boards/{id}/columns/{columnId}', [App\Http\Controllers\BoardController::class, 'updateColumn'])->name('boards.columns.update');
    Route::delete('boards/{id}/columns/{columnId}', [App\Http\Controllers\BoardController::class, 'removeColumn'])->name('boards.columns.remove');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
