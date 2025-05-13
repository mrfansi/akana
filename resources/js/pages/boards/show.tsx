import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import AppLayout from '@/layouts/app-layout';

// Create custom icon components
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21h-9.5A2.25 2.25 0 014 18.75V8.25A2.25 2.25 0 016.25 6H11" />
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

// Define types
interface User {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  priority?: string;
  due_date?: string;
  assignee?: User;
}

interface Column {
  id: number;
  name: string;
  position?: number;
  wip_limit?: number;
  tasks?: Task[];
}

interface Board {
  id: number;
  name: string;
  description?: string;
  project?: Project;
  columns?: Column[];
}

interface ShowProps {
  board: Board;
}

interface ColumnFormData {
  name: string;
  position: string;
  wip_limit: string;
  [key: string]: any; // Add index signature to satisfy FormDataType constraint
}

interface TaskMoveData {
  column_id: number;
  position: number;
  [key: string]: any; // Add index signature to satisfy FormDataType constraint
}

// Define allowed badge variants based on the ShadCN UI implementation
type BadgeVariant = 'destructive' | 'secondary' | 'outline' | 'default';

export default function Show({ board }: ShowProps) {
  const [columns, setColumns] = useState<Column[]>(board.columns || []);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState<boolean>(false);
  const [isEditColumnOpen, setIsEditColumnOpen] = useState<boolean>(false);
  const [currentColumn, setCurrentColumn] = useState<Column | null>(null);

  const { delete: destroy } = useForm();
  const { post: addColumn } = useForm();
  const { put: updateColumn } = useForm();
  const { delete: deleteColumn } = useForm();
  const { data: moveTaskData, setData: setMoveTaskData, post: moveTask } = useForm<TaskMoveData>({
    column_id: 0,
    position: 0
  });

  const handleDeleteBoard = () => {
    if (confirm('Are you sure you want to delete this board? This will also delete all columns and their tasks.')) {
      destroy(route('boards.destroy', board.id));
    }
  };

  const handleAddColumn = (data: ColumnFormData) => {
    addColumn(route('boards.columns.add', board.id), {
      onSuccess: () => {
        setIsAddColumnOpen(false);
      },
      ...data,
    });
  };

  const handleEditColumn = (data: ColumnFormData) => {
    if (currentColumn) {
      updateColumn(route('boards.columns.update', { id: board.id, columnId: currentColumn.id }), {
        onSuccess: () => {
          setIsEditColumnOpen(false);
          setCurrentColumn(null);
        },
        ...data,
      });
    }
  };

  const handleDeleteColumn = (columnId: number) => {
    if (confirm('Are you sure you want to delete this column? All tasks in this column will be lost.')) {
      deleteColumn(route('boards.columns.remove', { id: board.id, columnId }));
    }
  };

  const onDragEnd = (result: DropResult) => {
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
      setMoveTaskData({
        column_id: destColumn.id,
        position: destination.index
      });
      moveTask(route('tasks.move', movedTask.id));
    }
  };

  return (
    <AppLayout>
      <Head title={board.name} />
      
      <div className="py-12">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Link href={route('boards.index')}>
                <Button variant="outline" size="sm">Back to Boards</Button>
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{board.name}</h1>
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
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-4 mb-6">
              <p className="text-gray-700 dark:text-gray-300">{board.description}</p>
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
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">No columns found. Add your first column to get started.</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex space-x-4 overflow-x-auto pb-4" style={{ minHeight: '70vh' }}>
                {columns.map((column) => (
                  <div key={column.id} className="w-80 flex-shrink-0">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow p-2 h-full flex flex-col">
                      <div className="flex justify-between items-center p-2 mb-2">
                        <div>
                          <h3 className="font-medium">{column.name}</h3>
                          {column.wip_limit && column.wip_limit > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
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
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteColumn(column.id)}
                            className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <Droppable droppableId={column.id.toString()}>
                        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-grow p-1 rounded-md ${snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                            style={{ minHeight: '200px' }}
                          >
                            {column.tasks?.map((task, index) => (
                              <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`mb-2 ${snapshot.isDragging ? 'opacity-70' : ''}`}
                                  >
                                    <Link href={route('tasks.show', task.id)}>
                                      <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
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
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                              {task.description}
                                            </p>
                                          )}
                                        </CardContent>
                                        <CardFooter className="p-3 pt-0 flex justify-between text-xs text-gray-500 dark:text-gray-400">
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

interface AddColumnFormProps {
  onSubmit: (data: ColumnFormData) => void;
  onCancel: () => void;
}

function AddColumnForm({ onSubmit, onCancel }: AddColumnFormProps) {
  const [data, setData] = useState<ColumnFormData>({
    name: '',
    position: '',
    wip_limit: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
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
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave empty to add at the end</p>
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
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Maximum number of tasks allowed in this column (0 for no limit)</p>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Add Column</Button>
      </DialogFooter>
    </form>
  );
}

interface EditColumnFormProps {
  column: Column;
  onSubmit: (data: ColumnFormData) => void;
  onCancel: () => void;
}

function EditColumnForm({ column, onSubmit, onCancel }: EditColumnFormProps) {
  const [data, setData] = useState<ColumnFormData>({
    name: column.name || '',
    position: column.position?.toString() || '',
    wip_limit: column.wip_limit?.toString() || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
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
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Maximum number of tasks allowed in this column (0 for no limit)</p>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Update Column</Button>
      </DialogFooter>
    </form>
  );
}

function getPriorityBadgeVariant(priority?: string): BadgeVariant {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary'; // Changed from 'warning' to match available variants
    case 'low':
      return 'secondary';
    default:
      return 'outline';
  }
}
