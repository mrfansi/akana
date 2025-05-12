<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository implements RepositoryInterface
{
    /**
     * @var Model
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * {@inheritDoc}
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->model->all($columns);
    }

    /**
     * {@inheritDoc}
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->model->paginate($perPage, $columns);
    }

    /**
     * {@inheritDoc}
     */
    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    /**
     * {@inheritDoc}
     */
    public function update(array $data, int $id): Model
    {
        $record = $this->find($id);
        $record->update($data);

        return $record;
    }

    /**
     * {@inheritDoc}
     */
    public function delete(int $id): bool
    {
        return $this->find($id)->delete();
    }

    /**
     * {@inheritDoc}
     */
    public function find(int $id, array $columns = ['*']): ?Model
    {
        return $this->model->find($id, $columns);
    }

    /**
     * {@inheritDoc}
     */
    public function findBy(array $criteria, array $columns = ['*']): Collection
    {
        $query = $this->model->newQuery();

        foreach ($criteria as $key => $value) {
            $query->where($key, $value);
        }

        return $query->get($columns);
    }
}
