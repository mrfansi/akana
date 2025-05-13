import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { PencilIcon, Trash2Icon, PlusIcon } from 'lucide-react';
import { EditBoardForm } from '.';

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
  project_id?: string;
  columns?: Column[];
}

interface ViewBoardDialogProps {
  board: Board;
  trigger: React.ReactNode;
}

interface ColumnFormData {
  name: string;
  position: string;
  wip_limit: string;
  board_id?: number;
  [key: string]: any; // Add index signature to satisfy FormDataType constraint
}

interface TaskMoveData {
  column_id: number;
  position: number;
  [key: string]: any; // Add index signature to satisfy FormDataType constraint
}

// Define allowed badge variants based on the ShadCN UI implementation
type BadgeVariant = 'destructive' | 'secondary' | 'outline' | 'default';

export default function ViewBoardDialog({ board, trigger }: ViewBoardDialogProps) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addColumnOpen, setAddColumnOpen] = useState(false);
  const [currentColumn, setCurrentColumn] = useState<Column | null>(null);
  const [editColumnOpen, setEditColumnOpen] = useState(false);
  
  const deleteForm = useForm({});
  const columnForm = useForm<ColumnFormData>({
    name: '',
    position: '',
    wip_limit: '',
    board_id: board.id
  });
  
  const editColumnForm = useForm<ColumnFormData>({
    name: '',
    position: '',
    wip_limit: '',
    board_id: board.id
  });
  
  const taskMoveForm = useForm<TaskMoveData>({
    column_id: 0,
    position: 0
  });

  const handleDeleteBoard = () => {
    if (confirm('Are you sure you want to delete this board?')) {
      deleteForm.delete(route('boards.destroy', board.id), {
        onSuccess: () => {
          setOpen(false);
          window.location.href = route('boards.index');
        }
      });
    }
  };

  const handleAddColumn = (data: ColumnFormData) => {
    columnForm.data.name = data.name;
    columnForm.data.position = data.position;
    columnForm.data.wip_limit = data.wip_limit;
    columnForm.data.board_id = board.id;
    
    columnForm.post(route('columns.store'), {
      onSuccess: () => {
        setAddColumnOpen(false);
        window.location.reload(); // Refresh to get updated data
      }
    });
  };

  const handleEditColumn = (data: ColumnFormData) => {
    if (!currentColumn) return;
    
    editColumnForm.data.name = data.name;
    editColumnForm.data.position = data.position;
    editColumnForm.data.wip_limit = data.wip_limit;
    editColumnForm.data.board_id = board.id;
    
    editColumnForm.post(route('columns.update', currentColumn.id), {
      onSuccess: () => {
        setEditColumnOpen(false);
        window.location.reload(); // Refresh to get updated data
      }
    });
  };

  const handleDeleteColumn = (columnId: number) => {
    if (confirm('Are you sure you want to delete this column? All tasks in this column will be deleted.')) {
      deleteForm.delete(route('columns.destroy', columnId), {
        onSuccess: () => {
          window.location.reload();
        }
      });
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item is dropped in the same place, do nothing
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Extract the task ID from the draggableId
    const taskId = parseInt(draggableId.replace('task-', ''));
    
    // Extract the column ID from the destination droppableId
    const columnId = parseInt(destination.droppableId.replace('column-', ''));
    
    // Prepare the data for the API call
    taskMoveForm.data.column_id = columnId;
    taskMoveForm.data.position = destination.index;

    // Make the API call to update the task's position
    taskMoveForm.post(route('tasks.move', taskId), {
      preserveScroll: true,
      onSuccess: () => {
        // Optionally refresh the data or update the local state
        // For simplicity, we're reloading the page
        window.location.reload();
      },
      onError: (errors: Record<string, string>) => {
        console.error('Error moving task:', errors);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <DialogTitle className="text-2xl">{board.name}</DialogTitle>
          </div>
          <DialogDescription>
            {board.project ? `Project: ${board.project.name}` : 'Board details and columns'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {board.description || 'No description provided.'}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Edit Board: {board.name}</DialogTitle>
                  <DialogDescription>Make changes to your board here.</DialogDescription>
                </DialogHeader>
                <EditBoardForm board={board} onSuccess={() => {
                  setEditOpen(false);
                  window.location.reload(); // Refresh to get updated data
                }} />
              </DialogContent>
            </Dialog>
            <Button variant="destructive" onClick={handleDeleteBoard}>
              <Trash2Icon className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Columns</h2>
            <Dialog open={addColumnOpen} onOpenChange={setAddColumnOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Column
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Column</DialogTitle>
                  <DialogDescription>Create a new column for this board.</DialogDescription>
                </DialogHeader>
                <AddColumnForm 
                  onSubmit={handleAddColumn} 
                  onCancel={() => setAddColumnOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          </div>

          {(!board.columns || board.columns.length === 0) ? (
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center">
              <p className="text-gray-500 dark:text-gray-400">No columns found for this board. Add a column to get started.</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {board.columns.map((column) => (
                  <div key={column.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{column.name}</h3>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setCurrentColumn(column);
                            setEditColumnOpen(true);
                          }}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteColumn(column.id)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {column.wip_limit ? (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        WIP Limit: {column.tasks?.length || 0}/{column.wip_limit}
                      </div>
                    ) : null}
                    
                    <Droppable droppableId={`column-${column.id}`}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="min-h-[100px]"
                        >
                          {column.tasks && column.tasks.length > 0 ? (
                            <div className="space-y-2">
                              {column.tasks.map((task, index) => (
                                <Draggable 
                                  key={task.id} 
                                  draggableId={`task-${task.id}`} 
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <Card className="bg-white dark:bg-gray-800">
                                        <CardHeader className="py-2 px-3">
                                          <CardTitle className="text-sm">{task.title}</CardTitle>
                                        </CardHeader>
                                        {task.description && (
                                          <CardContent className="py-1 px-3">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                              {task.description}
                                            </p>
                                          </CardContent>
                                        )}
                                        <CardFooter className="py-1 px-3 flex justify-between items-center">
                                          {task.priority && (
                                            <Badge variant={getPriorityBadgeVariant(task.priority)}>
                                              {task.priority}
                                            </Badge>
                                          )}
                                          {task.assignee && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                              {task.assignee.name}
                                            </div>
                                          )}
                                        </CardFooter>
                                      </Card>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                              No tasks in this column
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          )}
        </div>

        <Dialog open={editColumnOpen} onOpenChange={setEditColumnOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Column</DialogTitle>
              <DialogDescription>Update column details.</DialogDescription>
            </DialogHeader>
            {currentColumn && (
              <EditColumnForm 
                column={currentColumn} 
                onSubmit={handleEditColumn} 
                onCancel={() => {
                  setEditColumnOpen(false);
                  setCurrentColumn(null);
                }} 
              />
            )}
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
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
