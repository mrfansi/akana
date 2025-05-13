<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BoardController extends Controller
{
    /**
     * The board service instance.
     *
     * @var \App\Interfaces\Services\BoardServiceInterface
     */
    protected $boardService;

    /**
     * Create a new controller instance.
     *
     * @param \App\Interfaces\Services\BoardServiceInterface $boardService
     * @return void
     */
    public function __construct(\App\Interfaces\Services\BoardServiceInterface $boardService)
    {
        $this->boardService = $boardService;
    }

    /**
     * Display a listing of the boards.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $boards = $this->boardService->getAllBoards();
        
        return inertia('boards/index', [
            'boards' => $boards
        ]);
    }

    /**
     * Show the form for creating a new board.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return inertia('boards/create');
    }

    /**
     * Store a newly created board in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
        ]);

        $board = $this->boardService->createBoard($validated);

        // Create default columns for the board
        $this->boardService->createDefaultColumns($board->id);

        return redirect()->route('boards.show', $board->id)
            ->with('success', 'Board created successfully.');
    }

    /**
     * Display the specified board.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $board = $this->boardService->getBoardById($id);
        
        if (!$board) {
            abort(404);
        }

        // Load relationships
        $board->load(['project', 'columns.tasks.assignee']);

        return inertia('boards/show', [
            'board' => $board
        ]);
    }

    /**
     * Show the form for editing the specified board.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $board = $this->boardService->getBoardById($id);
        
        if (!$board) {
            abort(404);
        }

        // Load relationships
        $board->load(['project']);

        return inertia('boards/edit', [
            'board' => $board
        ]);
    }

    /**
     * Update the specified board in storage.
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
            'project_id' => 'required|exists:projects,id',
        ]);

        $board = $this->boardService->updateBoard($id, $validated);

        if (!$board) {
            abort(404);
        }

        return redirect()->route('boards.show', $board->id)
            ->with('success', 'Board updated successfully.');
    }

    /**
     * Remove the specified board from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $result = $this->boardService->deleteBoard($id);

        if (!$result) {
            abort(404);
        }

        return redirect()->route('boards.index')
            ->with('success', 'Board deleted successfully.');
    }

    /**
     * Add a column to the board.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function addColumn(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'nullable|integer|min:0',
            'wip_limit' => 'nullable|integer|min:0',
        ]);

        $column = $this->boardService->addColumn($id, $validated);

        if (!$column) {
            return redirect()->back()->with('error', 'Failed to add column.');
        }

        return redirect()->route('boards.show', $id)
            ->with('success', 'Column added successfully.');
    }

    /**
     * Update a column on the board.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @param  int  $columnId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateColumn(Request $request, $id, $columnId)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'nullable|integer|min:0',
            'wip_limit' => 'nullable|integer|min:0',
        ]);

        $column = $this->boardService->updateColumn($columnId, $validated);

        if (!$column) {
            return redirect()->back()->with('error', 'Failed to update column.');
        }

        return redirect()->route('boards.show', $id)
            ->with('success', 'Column updated successfully.');
    }

    /**
     * Remove a column from the board.
     *
     * @param  int  $id
     * @param  int  $columnId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function removeColumn($id, $columnId)
    {
        $result = $this->boardService->deleteColumn($columnId);

        if (!$result) {
            return redirect()->back()->with('error', 'Failed to remove column.');
        }

        return redirect()->route('boards.show', $id)
            ->with('success', 'Column removed successfully.');
    }
}
