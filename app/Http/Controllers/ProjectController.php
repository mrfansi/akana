<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * The project service instance.
     *
     * @var \App\Interfaces\Services\ProjectServiceInterface
     */
    protected $projectService;

    /**
     * Create a new controller instance.
     *
     * @param \App\Interfaces\Services\ProjectServiceInterface $projectService
     * @return void
     */
    public function __construct(\App\Interfaces\Services\ProjectServiceInterface $projectService)
    {
        $this->projectService = $projectService;
    }

    /**
     * Display a listing of the projects.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $projects = $this->projectService->getAllProjects();
        $teams = \App\Models\Team::all();
        
        return inertia('projects/index', [
            'projects' => $projects,
            'teams' => $teams
        ]);
    }

    /**
     * Show the form for creating a new project.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return inertia('projects/create');
    }

    /**
     * Store a newly created project in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'team_id' => 'required|exists:teams,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|string|max:50',
        ]);

        $project = $this->projectService->createProject($validated);

        return redirect()->route('projects.show', $project->id)
            ->with('success', 'Project created successfully.');
    }

    /**
     * Display the specified project.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $project = $this->projectService->getProjectById($id);
        
        if (!$project) {
            abort(404);
        }

        // Load relationships
        $project->load(['team', 'tasks', 'boards.columns.tasks']);

        return inertia('projects/show', [
            'project' => $project
        ]);
    }

    /**
     * Show the form for editing the specified project.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $project = $this->projectService->getProjectById($id);
        
        if (!$project) {
            abort(404);
        }

        // Load relationships
        $project->load(['team']);

        return inertia('projects/edit', [
            'project' => $project
        ]);
    }

    /**
     * Update the specified project in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'team_id' => 'required|exists:teams,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|string|max:50',
        ]);

        $project = $this->projectService->updateProject($id, $validated);

        if (!$project) {
            abort(404);
        }

        return redirect()->route('projects.show', $project->id)
            ->with('success', 'Project updated successfully.');
    }

    /**
     * Remove the specified project from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $result = $this->projectService->deleteProject($id);

        if (!$result) {
            abort(404);
        }

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}
