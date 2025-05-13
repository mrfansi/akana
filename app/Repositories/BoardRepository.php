<?php

namespace App\Repositories;

use App\Interfaces\Repositories\BoardRepositoryInterface;
use App\Models\Board;
use App\Models\Column;
use Illuminate\Database\Eloquent\Collection;

class BoardRepository implements BoardRepositoryInterface
{
    /**
     * Get all boards.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all(): Collection
    {
        return Board::all();
    }

    /**
     * Find a board by its ID.
     *
     * @param int $id
     * @return \App\Models\Board|null
     */
    public function findById(int $id): ?Board
    {
        $result = Board::find($id);
        return $result instanceof Board ? $result : null;
    }

    /**
     * Find boards by project ID.
     *
     * @param int $projectId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findByProject(int $projectId): Collection
    {
        return Board::where('project_id', $projectId)->get();
    }

    /**
     * Create a new board.
     *
     * @param array $data
     * @return \App\Models\Board
     */
    public function create(array $data): Board
    {
        return Board::create($data);
    }

    /**
     * Update a board.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\Board|null
     */
    public function update(int $id, array $data): ?Board
    {
        $board = $this->findById($id);
        if (!$board) {
            return null;
        }
        $board->update($data);
        return $board;
    }

    /**
     * Delete a board.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $board = $this->findById($id);
        if (!$board) {
            return false;
        }
        return $board->delete();
    }

    /**
     * Add a column to a board.
     *
     * @param int $boardId
     * @param array $columnData
     * @return \App\Models\Column
     */
    public function addColumn(int $boardId, array $columnData): Column
    {
        $board = $this->findById($boardId);
        if (!$board) {
            throw new \InvalidArgumentException("Board not found");
        }

        // Set the board_id
        $columnData['board_id'] = $boardId;

        // If position is not set, place it at the end
        if (!isset($columnData['position'])) {
            $lastPosition = $board->columns()->max('position') ?? -1;
            $columnData['position'] = $lastPosition + 1;
        }

        return Column::create($columnData);
    }

    /**
     * Update a column's position.
     *
     * @param int $columnId
     * @param int $position
     * @return bool
     */
    public function updateColumnPosition(int $columnId, int $position): bool
    {
        $column = Column::query()->find($columnId);
        if (!$column) {
            return false;
        }

        $column->position = $position;
        return $column->save();
    }
    
    /**
     * Update a column.
     *
     * @param int $columnId
     * @param array $data
     * @return \App\Models\Column|null
     */
    public function updateColumn(int $columnId, array $data): ?Column
    {
        $column = Column::find($columnId);
        if (!($column instanceof Column)) {
            return null;
        }
        
        $column->update($data);
        return $column;
    }
    
    /**
     * Delete a column.
     *
     * @param int $columnId
     * @return bool
     */
    public function deleteColumn(int $columnId): bool
    {
        $column = Column::query()->find($columnId);
        if (!$column) {
            return false;
        }
        
        return $column->delete();
    }
}
