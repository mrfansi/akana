<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeamController extends Controller
{
    /**
     * Display a listing of the teams.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $teams = Team::withCount('members')->get();

        return Inertia::render('teams/index', [
            'teams' => $teams,
        ]);
    }

    /**
     * Show the form for creating a new team.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $users = User::all();

        return Inertia::render('teams/create', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created team in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $team = Team::create($validated);

        // Add the current user as the team owner
        $team->members()->attach(Auth::id(), ['role' => 'owner']);

        return redirect()->route('teams.show', $team->id)
            ->with('success', 'Team created successfully.');
    }

    /**
     * Display the specified team.
     *
     * @param  \App\Models\Team  $team
     * @return \Inertia\Response
     */
    public function show(Team $team)
    {
        $team->load('members', 'projects');
        
        // Get users who are not already members of this team
        $availableUsers = User::whereDoesntHave('teams', function ($query) use ($team) {
            $query->where('team_id', $team->id);
        })->get();

        return Inertia::render('teams/show', [
            'team' => $team,
            'availableUsers' => $availableUsers,
        ]);
    }

    /**
     * Show the form for editing the specified team.
     *
     * @param  \App\Models\Team  $team
     * @return \Inertia\Response
     */
    public function edit(Team $team)
    {
        return Inertia::render('teams/edit', [
            'team' => $team,
        ]);
    }

    /**
     * Update the specified team in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Team  $team
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Team $team)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $team->update($validated);

        return redirect()->route('teams.show', $team->id)
            ->with('success', 'Team updated successfully.');
    }

    /**
     * Remove the specified team from storage.
     *
     * @param  \App\Models\Team  $team
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Team $team)
    {
        // Check if user has permission to delete the team
        // This should be expanded with proper authorization
        
        $team->delete();

        return redirect()->route('teams.index')
            ->with('success', 'Team deleted successfully.');
    }
}
