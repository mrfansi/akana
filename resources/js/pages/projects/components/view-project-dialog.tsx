import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PencilIcon, Trash2Icon, CalendarIcon, Users as UsersIcon, ClipboardList as ClipboardDocumentListIcon } from 'lucide-react';
import { EditProjectForm } from '.';

// Define types
interface Team {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
}

interface Column {
  id: number;
  name: string;
}

interface Board {
  id: number;
  name: string;
  description?: string;
  columns?: Column[];
}

interface Project {
  id: number;
  name: string;
  description?: string;
  status?: string;
  team?: Team;
  tasks?: Task[];
  boards?: Board[];
  start_date?: string;
  end_date?: string;
}

interface ViewProjectDialogProps {
  project: Project;
  trigger: React.ReactNode;
}

// Define allowed badge variants based on the ShadCN UI implementation
type BadgeVariant = 'destructive' | 'secondary' | 'outline' | 'default';

export default function ViewProjectDialog({ project, trigger }: ViewProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const { delete: destroy } = useForm();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this project? This will also delete all associated tasks and boards.')) {
      destroy(route('projects.destroy', project.id));
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <DialogTitle className="text-2xl">{project.name}</DialogTitle>
            <Badge variant={getStatusBadgeVariant(project.status)}>
              {project.status || 'No Status'}
            </Badge>
          </div>
          <DialogDescription>
            Project details, tasks, and boards
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-end space-x-2 mb-4">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Edit Project: {project.name}</DialogTitle>
                <DialogDescription>Make changes to your project here.</DialogDescription>
              </DialogHeader>
              <EditProjectForm project={project} onSuccess={() => {
                setEditOpen(false);
                window.location.reload(); // Refresh to get updated data
              }} />
            </DialogContent>
          </Dialog>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2Icon className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <h2 className="text-lg font-medium mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {project.description || 'No description provided.'}
            </p>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Team</h3>
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-2" />
                      <p>{project.team?.name || 'Not assigned'}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Timeline</h3>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <p>
                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No start date'}
                        {' - '}
                        {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No end date'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="boards">Boards</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Project Tasks</h2>
              <a href={route('tasks.create')} target="_blank" rel="noopener noreferrer">
                <Button size="sm">Create Task</Button>
              </a>
            </div>
            
            {(!project.tasks || project.tasks.length === 0) ? (
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                <ClipboardDocumentListIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No tasks found for this project.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.tasks.map((task) => (
                  <a key={task.id} href={route('tasks.show', task.id)} className="block">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{task.title}</CardTitle>
                          <Badge variant={getPriorityBadgeVariant(task.priority)}>
                            {task.priority || 'No Priority'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {task.description || 'No description provided.'}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-0">
                        <Badge variant={getStatusBadgeVariant(task.status)}>
                          {task.status || 'No Status'}
                        </Badge>
                        <div className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                        </div>
                      </CardFooter>
                    </Card>
                  </a>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="boards" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Project Boards</h2>
              <a href={route('boards.create')} target="_blank" rel="noopener noreferrer">
                <Button size="sm">Create Board</Button>
              </a>
            </div>
            
            {(!project.boards || project.boards.length === 0) ? (
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                <ClipboardDocumentListIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No boards found for this project.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.boards.map((board) => (
                  <a key={board.id} href={route('boards.show', board.id)} className="block">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-base">{board.name}</CardTitle>
                        <CardDescription>
                          {board.columns?.length || 0} columns
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {board.description || 'No description provided.'}
                        </p>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function getStatusBadgeVariant(status?: string): BadgeVariant {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'done':
      return 'default'; // Changed from 'success' to match available variants
    case 'in progress':
      return 'default'; // Changed from 'primary' to match available variants
    case 'on hold':
    case 'blocked':
      return 'secondary'; // Changed from 'warning' to match available variants
    case 'cancelled':
      return 'destructive';
    case 'planning':
    case 'to do':
    case 'backlog':
      return 'secondary';
    default:
      return 'outline';
  }
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
