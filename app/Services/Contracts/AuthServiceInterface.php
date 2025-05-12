<?php

namespace App\Services\Contracts;

use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;

interface AuthServiceInterface
{
    /**
     * Register a new user.
     */
    public function register(array $data): User;

    /**
     * Attempt to log in a user.
     *
     * @throws AuthenticationException
     */
    public function login(array $credentials): User;

    /**
     * Log out the current user.
     */
    public function logout(Request $request): bool;

    /**
     * Get the currently authenticated user.
     */
    public function getCurrentUser(): ?User;

    /**
     * Check if a user is authenticated.
     */
    public function isAuthenticated(): bool;

    /**
     * Send a password reset link to the user.
     */
    public function sendPasswordResetLink(string $email): bool;

    /**
     * Reset the user's password.
     */
    public function resetPassword(array $data): bool;
}
