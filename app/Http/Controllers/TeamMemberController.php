<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeamMemberController extends Controller
{
    /**
     * Add a member to the team.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Team  $team
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, Team $team)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|string|in:member,admin,owner',
        ]);

        // Check if the user is already a member of the team
        $existingMember = $team->members()->where('user_id', $validated['user_id'])->exists();
        
        if ($existingMember) {
            return back()->withErrors(['user_id' => 'This user is already a member of the team.']);
        }

        // Add the user to the team with the specified role
        $team->members()->attach($validated['user_id'], ['role' => $validated['role']]);

        return back()->with('success', 'Team member added successfully.');
    }

    /**
     * Remove a member from the team.
     *
     * @param  \App\Models\Team  $team
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Team $team, User $user)
    {
        // Check if the authenticated user has permission to remove members
        // This should be expanded with proper authorization
        
        // Prevent removing the last owner of the team
        $isLastOwner = $team->members()->wherePivot('role', 'owner')->count() === 1 &&
                      $team->members()->wherePivot('user_id', $user->id)->wherePivot('role', 'owner')->exists();
        
        if ($isLastOwner) {
            return back()->withErrors(['error' => 'Cannot remove the last owner of the team.']);
        }
        
        // Remove the user from the team
        $team->members()->detach($user->id);

        return back()->with('success', 'Team member removed successfully.');
    }
}
