<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with task and project statistics.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = auth()->user();
        
        // Get recent tasks assigned to the user
        $recentTasks = $user->assignedTasks()
            ->with(['project', 'assignee'])
            ->orderBy('updated_at', 'desc')
            ->limit(6)
            ->get();
        
        // Get upcoming tasks due in the next 7 days
        $upcomingTasks = $user->assignedTasks()
            ->with(['project', 'assignee'])
            ->whereNotNull('due_date')
            ->where('due_date', '>=', now())
            ->where('due_date', '<=', now()->addDays(7))
            ->orderBy('due_date', 'asc')
            ->limit(6)
            ->get();
        
        // Get recent projects the user is involved in
        $recentProjects = $user->projects()
            ->with(['team'])
            ->orderBy('updated_at', 'desc')
            ->limit(6)
            ->get();
        
        // Get user statistics
        $userStats = [
            'tasks_count' => $user->assignedTasks()->count(),
            'projects_count' => $user->projects()->count(),
            'due_soon_count' => $user->assignedTasks()
                ->whereNotNull('due_date')
                ->where('due_date', '>=', now())
                ->where('due_date', '<=', now()->addDays(3))
                ->count(),
            'completed_count' => $user->assignedTasks()
                ->where('status', 'Done')
                ->orWhere('status', 'Completed')
                ->count(),
        ];
        
        return inertia('Dashboard', [
            'recentTasks' => $recentTasks,
            'upcomingTasks' => $upcomingTasks,
            'recentProjects' => $recentProjects,
            'userStats' => $userStats,
        ]);
    }
}
