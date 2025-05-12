<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

interface RepositoryInterface
{
    /**
     * Get all resources.
     */
    public function all(array $columns = ['*']): Collection;

    /**
     * Get paginated resources.
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator;

    /**
     * Create a resource.
     */
    public function create(array $data): Model;

    /**
     * Update a resource.
     */
    public function update(array $data, int $id): Model;

    /**
     * Delete a resource.
     */
    public function delete(int $id): bool;

    /**
     * Find a resource by id.
     */
    public function find(int $id, array $columns = ['*']): ?Model;

    /**
     * Find a resource by criteria.
     */
    public function findBy(array $criteria, array $columns = ['*']): Collection;
}
