<?php

namespace App\Services\Implementations;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\Contracts\AuthServiceInterface;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthService implements AuthServiceInterface
{
    /**
     * @var UserRepositoryInterface
     */
    protected $userRepository;

    /**
     * AuthService constructor.
     */
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * {@inheritDoc}
     */
    public function register(array $data): User
    {
        // Ensure password is hashed
        $data['password'] = Hash::make($data['password']);

        // Create the user
        $user = $this->userRepository->create($data);

        // Log the user in
        Auth::login($user);

        return $user;
    }

    /**
     * {@inheritDoc}
     */
    public function login(array $credentials): User
    {
        if (! Auth::attempt($credentials)) {
            throw new AuthenticationException('Invalid credentials');
        }

        return $this->getCurrentUser();
    }

    /**
     * {@inheritDoc}
     */
    public function logout(Request $request): bool
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return true;
    }

    /**
     * {@inheritDoc}
     */
    public function getCurrentUser(): ?User
    {
        return Auth::user();
    }

    /**
     * {@inheritDoc}
     */
    public function isAuthenticated(): bool
    {
        return Auth::check();
    }

    /**
     * {@inheritDoc}
     */
    public function sendPasswordResetLink(string $email): bool
    {
        $status = Password::sendResetLink(['email' => $email]);

        return $status === Password::RESET_LINK_SENT;
    }

    /**
     * {@inheritDoc}
     */
    public function resetPassword(array $data): bool
    {
        $status = Password::reset(
            $data,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET;
    }
}
