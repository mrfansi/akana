<?php

namespace App\Interfaces\Services;

use App\Models\Board;
use App\Models\Column;
use Illuminate\Database\Eloquent\Collection;

interface BoardServiceInterface
{
    /**
     * Get all boards.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllBoards(): Collection;

    /**
     * Get a board by its ID.
     *
     * @param int $id
     * @return \App\Models\Board|null
     */
    public function getBoardById(int $id): ?Board;

    /**
     * Get boards by project ID.
     *
     * @param int $projectId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getBoardsByProject(int $projectId): Collection;

    /**
     * Create a new board.
     *
     * @param array $data
     * @return \App\Models\Board
     */
    public function createBoard(array $data): Board;

    /**
     * Update a board.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\Board|null
     */
    public function updateBoard(int $id, array $data): ?Board;

    /**
     * Delete a board.
     *
     * @param int $id
     * @return bool
     */
    public function deleteBoard(int $id): bool;

    /**
     * Add a column to a board.
     *
     * @param int $boardId
     * @param array $columnData
     * @return \App\Models\Column
     */
    public function addColumnToBoard(int $boardId, array $columnData): Column;

    /**
     * Update a column's position.
     *
     * @param int $columnId
     * @param int $position
     * @return bool
     */
    public function updateColumnPosition(int $columnId, int $position): bool;
    
    /**
     * Create default columns for a board.
     *
     * @param int $boardId
     * @return bool
     */
    public function createDefaultColumns(int $boardId): bool;
    
    /**
     * Add a column to a board.
     *
     * @param int $boardId
     * @param array $data
     * @return \App\Models\Column|null
     */
    public function addColumn(int $boardId, array $data): ?Column;
    
    /**
     * Update a column.
     *
     * @param int $columnId
     * @param array $data
     * @return \App\Models\Column|null
     */
    public function updateColumn(int $columnId, array $data): ?Column;
    
    /**
     * Delete a column.
     *
     * @param int $columnId
     * @return bool
     */
    public function deleteColumn(int $columnId): bool;
}
