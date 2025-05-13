<?php

namespace App\Interfaces\Repositories;

use App\Models\Board;
use Illuminate\Database\Eloquent\Collection;

interface BoardRepositoryInterface
{
    /**
     * Get all boards.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all(): Collection;

    /**
     * Find a board by its ID.
     *
     * @param int $id
     * @return \App\Models\Board|null
     */
    public function findById(int $id): ?Board;

    /**
     * Find boards by project ID.
     *
     * @param int $projectId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findByProject(int $projectId): Collection;

    /**
     * Create a new board.
     *
     * @param array $data
     * @return \App\Models\Board
     */
    public function create(array $data): Board;

    /**
     * Update a board.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\Board|null
     */
    public function update(int $id, array $data): ?Board;

    /**
     * Delete a board.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Add a column to a board.
     *
     * @param int $boardId
     * @param array $columnData
     * @return \App\Models\Column
     */
    public function addColumn(int $boardId, array $columnData): \App\Models\Column;

    /**
     * Update a column's position.
     *
     * @param int $columnId
     * @param int $position
     * @return bool
     */
    public function updateColumnPosition(int $columnId, int $position): bool;
    
    /**
     * Update a column.
     *
     * @param int $columnId
     * @param array $data
     * @return \App\Models\Column|null
     */
    public function updateColumn(int $columnId, array $data): ?\App\Models\Column;
    
    /**
     * Delete a column.
     *
     * @param int $columnId
     * @return bool
     */
    public function deleteColumn(int $columnId): bool;
}
