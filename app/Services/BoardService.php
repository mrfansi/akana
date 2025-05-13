<?php

namespace App\Services;

use App\Interfaces\Repositories\BoardRepositoryInterface;
use App\Interfaces\Services\BoardServiceInterface;
use App\Models\Board;
use App\Models\Column;
use Illuminate\Database\Eloquent\Collection;

class BoardService implements BoardServiceInterface
{
    /**
     * The board repository instance.
     *
     * @var \App\Interfaces\Repositories\BoardRepositoryInterface
     */
    protected BoardRepositoryInterface $boardRepository;

    /**
     * Create a new service instance.
     *
     * @param \App\Interfaces\Repositories\BoardRepositoryInterface $boardRepository
     * @return void
     */
    public function __construct(BoardRepositoryInterface $boardRepository)
    {
        $this->boardRepository = $boardRepository;
    }

    /**
     * Get all boards.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllBoards(): Collection
    {
        return $this->boardRepository->all();
    }

    /**
     * Get a board by its ID.
     *
     * @param int $id
     * @return \App\Models\Board|null
     */
    public function getBoardById(int $id): ?Board
    {
        return $this->boardRepository->findById($id);
    }

    /**
     * Get boards by project ID.
     *
     * @param int $projectId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getBoardsByProject(int $projectId): Collection
    {
        return $this->boardRepository->findByProject($projectId);
    }

    /**
     * Create a new board.
     *
     * @param array $data
     * @return \App\Models\Board
     */
    public function createBoard(array $data): Board
    {
        $board = $this->boardRepository->create($data);

        // If the board is created successfully, create default columns
        if ($board) {
            $this->createDefaultColumns($board->id);
        }

        return $board;
    }

    /**
     * Update a board.
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\Board|null
     */
    public function updateBoard(int $id, array $data): ?Board
    {
        return $this->boardRepository->update($id, $data);
    }

    /**
     * Delete a board.
     *
     * @param int $id
     * @return bool
     */
    public function deleteBoard(int $id): bool
    {
        return $this->boardRepository->delete($id);
    }

    /**
     * Add a column to a board.
     *
     * @param int $boardId
     * @param array $columnData
     * @return \App\Models\Column
     */
    public function addColumnToBoard(int $boardId, array $columnData): Column
    {
        return $this->boardRepository->addColumn($boardId, $columnData);
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
        return $this->boardRepository->updateColumnPosition($columnId, $position);
    }

    /**
     * Create default columns for a board.
     *
     * @param int $boardId
     * @return bool
     */
    public function createDefaultColumns(int $boardId): bool
    {
        try {
            $defaultColumns = [
                ['name' => 'To Do', 'position' => 0, 'board_id' => $boardId],
                ['name' => 'In Progress', 'position' => 1, 'board_id' => $boardId],
                ['name' => 'In Review', 'position' => 2, 'board_id' => $boardId],
                ['name' => 'Done', 'position' => 3, 'board_id' => $boardId],
            ];

            foreach ($defaultColumns as $columnData) {
                $this->addColumnToBoard($boardId, $columnData);
            }
            
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
    
    /**
     * Add a column to a board.
     *
     * @param int $boardId
     * @param array $data
     * @return \App\Models\Column|null
     */
    public function addColumn(int $boardId, array $data): ?Column
    {
        // Make sure board_id is set in the data
        $data['board_id'] = $boardId;
        
        // If position is not set, get the next available position
        if (!isset($data['position'])) {
            $board = $this->getBoardById($boardId);
            if ($board) {
                $data['position'] = $board->columns()->count();
            } else {
                $data['position'] = 0;
            }
        }
        
        return $this->boardRepository->addColumn($boardId, $data);
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
        return $this->boardRepository->updateColumn($columnId, $data);
    }
    
    /**
     * Delete a column.
     *
     * @param int $columnId
     * @return bool
     */
    public function deleteColumn(int $columnId): bool
    {
        return $this->boardRepository->deleteColumn($columnId);
    }
}
