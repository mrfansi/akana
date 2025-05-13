import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { PlusIcon, PencilIcon, TrashIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ board }) {
  const [columns, setColumns] = useState(board.columns || []);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [isEditColumnOpen, setIsEditColumnOpen] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(null);

  const { delete: destroy } = useForm();
  const { post: addColumn } = useForm();
  const { put: updateColumn } = useForm();
  const { delete: deleteColumn } = useForm();
  const { post: moveTask } = useForm();

  const handleDeleteBoard = () => {
    if (confirm('Are you sure you want to delete this board? This will also delete all columns and their tasks.')) {
      destroy(route('boards.destroy', board.id));
    }
  };

  const handleAddColumn = (data) => {
    addColumn(route('boards.columns.add', board.id), {
      data,
      onSuccess: () => {
        setIsAddColumnOpen(false);
      },
    });
  };

  const handleEditColumn = (data) => {
    updateColumn(route('boards.columns.update', { id: board.id, columnId: currentColumn.id }), {
      data,
      onSuccess: () => {
        setIsEditColumnOpen(false);
        setCurrentColumn(null);
      },
    });
  };

  const handleDeleteColumn = (columnId) => {
    if (confirm('Are you sure you want to delete this column? All tasks in this column will be lost.')) {
      deleteColumn(route('boards.columns.remove', { id: board.id, columnId }));
    }
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // If the task was dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the source and destination columns
    const sourceColumn = columns.find(col => col.id.toString() === source.droppableId);
    const destColumn = columns.find(col => col.id.toString() === destination.droppableId);
    
    if (sourceColumn && destColumn) {
      // Make a copy of the tasks arrays
      const sourceTasks = [...(sourceColumn.tasks || [])];
      const destTasks = source.droppableId === destination.droppableId 
        ? sourceTasks 
        : [...(destColumn.tasks || [])];
      
      // Get the task that was moved
      const [movedTask] = sourceTasks.splice(source.index, 1);
      
      // Insert the task at the destination
      destTasks.splice(destination.index, 0, movedTask);
      
      // Create new columns array with updated tasks
      const newColumns = columns.map(col => {
        if (col.id.toString() === source.droppableId) {
          return { ...col, tasks: sourceTasks };
        }
        if (col.id.toString() === destination.droppableId) {
          return { ...col, tasks: destTasks };
        }
        return col;
      });
      
      // Update state
      setColumns(newColumns);
      
      // Send update to server
      moveTask(route('tasks.move', movedTask.id), {
        data: {
          column_id: destColumn.id,
          position: destination.index,
        },
      });
    }
  };

  return (
    <AppLayout title={board.name}>
      <Head title={board.name} />
      
      <div className="py-12">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Link href={route('boards.index')}>
                <Button variant="outline" size="sm">Back to Boards</Button>
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900">{board.name}</h1>
              <Badge variant="outline">
                {board.project?.name || 'No Project'}
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Link href={route('boards.edit', board.id)}>
                <Button variant="outline">Edit Board</Button>
              </Link>
              <Button variant="destructive" onClick={handleDeleteBoard}>Delete Board</Button>
            </div>
          </div>

          {board.description && (
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4 mb-6">
              <p className="text-gray-700">{board.description}</p>
            </div>
          )}

          <div className="flex items-center mb-4">
            <h2 className="text-lg font-medium mr-4">Columns</h2>
            <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusIcon className="h-4 w-4 mr-1" /> Add Column
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Column</DialogTitle>
                  <DialogDescription>
                    Create a new column for your board.
                  </DialogDescription>
                </DialogHeader>
                <AddColumnForm onSubmit={handleAddColumn} onCancel={() => setIsAddColumnOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {columns.length === 0 ? (
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
              <p className="text-gray-500">No columns found. Add your first column to get started.</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex space-x-4 overflow-x-auto pb-4" style={{ minHeight: '70vh' }}>
                {columns.map((column) => (
                  <div key={column.id} className="w-80 flex-shrink-0">
                    <div className="bg-gray-100 rounded-lg shadow p-2 h-full flex flex-col">
                      <div className="flex justify-between items-center p-2 mb-2">
                        <div>
                          <h3 className="font-medium">{column.name}</h3>
                          {column.wip_limit > 0 && (
                            <p className="text-xs text-gray-500">
                              {(column.tasks?.length || 0)} / {column.wip_limit} tasks
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => {
                              setCurrentColumn(column);
                              setIsEditColumnOpen(true);
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteColumn(column.id)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <Droppable droppableId={column.id.toString()}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-grow p-1 rounded-md ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                            style={{ minHeight: '200px' }}
                          >
                            {column.tasks?.map((task, index) => (
                              <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`mb-2 ${snapshot.isDragging ? 'opacity-70' : ''}`}
                                  >
                                    <Link href={route('tasks.show', task.id)}>
                                      <Card className="bg-white hover:shadow-md transition-shadow">
                                        <CardHeader className="p-3 pb-0">
                                          <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                                          {task.priority && (
                                            <Badge variant={getPriorityBadgeVariant(task.priority)} className="text-xs">
                                              {task.priority}
                                            </Badge>
                                          )}
                                        </CardHeader>
                                        <CardContent className="p-3 pt-1 pb-1">
                                          {task.description && (
                                            <p className="text-xs text-gray-500 line-clamp-2">
                                              {task.description}
                                            </p>
                                          )}
                                        </CardContent>
                                        <CardFooter className="p-3 pt-0 flex justify-between text-xs text-gray-500">
                                          {task.assignee && (
                                            <div className="flex items-center">
                                              <UserIcon className="h-3 w-3 mr-1" />
                                              <span className="truncate max-w-[80px]">{task.assignee.name}</span>
                                            </div>
                                          )}
                                          {task.due_date && (
                                            <div className="flex items-center">
                                              <CalendarIcon className="h-3 w-3 mr-1" />
                                              {new Date(task.due_date).toLocaleDateString()}
                                            </div>
                                          )}
                                        </CardFooter>
                                      </Card>
                                    </Link>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            <Link href={route('tasks.create')} className="block mt-2">
                              <Button variant="ghost" className="w-full text-xs justify-start">
                                <PlusIcon className="h-4 w-4 mr-1" /> Add Task
                              </Button>
                            </Link>
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                ))}
              </div>
            </DragDropContext>
          )}

          {/* Edit Column Dialog */}
          <Dialog open={isEditColumnOpen} onOpenChange={setIsEditColumnOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Column</DialogTitle>
                <DialogDescription>
                  Update the column details.
                </DialogDescription>
              </DialogHeader>
              {currentColumn && (
                <EditColumnForm 
                  column={currentColumn} 
                  onSubmit={handleEditColumn} 
                  onCancel={() => {
                    setIsEditColumnOpen(false);
                    setCurrentColumn(null);
                  }} 
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AppLayout>
  );
}

function AddColumnForm({ onSubmit, onCancel }) {
  const [data, setData] = useState({
    name: '',
    position: '',
    wip_limit: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        <div>
          <Label htmlFor="name">Column Name</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            type="number"
            min="0"
            value={data.position}
            onChange={(e) => setData({ ...data, position: e.target.value })}
          />
          <p className="text-xs text-gray-500 mt-1">Leave empty to add at the end</p>
        </div>

        <div>
          <Label htmlFor="wip_limit">WIP Limit</Label>
          <Input
            id="wip_limit"
            type="number"
            min="0"
            value={data.wip_limit}
            onChange={(e) => setData({ ...data, wip_limit: e.target.value })}
          />
          <p className="text-xs text-gray-500 mt-1">Maximum number of tasks allowed in this column (0 for no limit)</p>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Add Column</Button>
      </DialogFooter>
    </form>
  );
}

function EditColumnForm({ column, onSubmit, onCancel }) {
  const [data, setData] = useState({
    name: column.name || '',
    position: column.position?.toString() || '',
    wip_limit: column.wip_limit?.toString() || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        <div>
          <Label htmlFor="name">Column Name</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            type="number"
            min="0"
            value={data.position}
            onChange={(e) => setData({ ...data, position: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="wip_limit">WIP Limit</Label>
          <Input
            id="wip_limit"
            type="number"
            min="0"
            value={data.wip_limit}
            onChange={(e) => setData({ ...data, wip_limit: e.target.value })}
          />
          <p className="text-xs text-gray-500 mt-1">Maximum number of tasks allowed in this column (0 for no limit)</p>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Update Column</Button>
      </DialogFooter>
    </form>
  );
}

function getPriorityBadgeVariant(priority) {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'warning';
    case 'low':
      return 'secondary';
    default:
      return 'outline';
  }
}
