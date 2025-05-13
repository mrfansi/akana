import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { CalendarIcon, Clock as ClockIcon, PlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateTaskForm from './components/create-task-form';

// Define types for the task data
interface Project {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  priority?: string;
  estimated_hours?: number;
  due_date?: string;
  project?: Project;
}

interface User {
  id: number;
  name: string;
}

interface IndexProps {
  tasks: Task[];
  projects: Project[];
  users: User[];
}

// Define allowed badge variants based on the ShadCN UI implementation
type BadgeVariant = 'destructive' | 'secondary' | 'outline' | 'default';

export default function Index({ tasks, projects, users }: IndexProps) {
  const [open, setOpen] = useState(false);

  return (
    <AppLayout>
      <Head title="Tasks" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Tasks</h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>Fill in the details to create a new task.</DialogDescription>
                </DialogHeader>
                <CreateTaskForm
                  projects={projects}
                  users={users}
                  onSuccess={() => setOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {tasks.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
              <p className="text-gray-500 dark:text-gray-400">No tasks found. Create your first task to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <Link key={task.id} href={route('tasks.show', task.id)} className="block">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <Badge variant={getBadgeVariant(task.priority)}>
                          {task.priority || 'No Priority'}
                        </Badge>
                      </div>
                      <CardDescription>
                        {task.project?.name || 'No Project'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {task.description || 'No description provided.'}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {task.estimated_hours ? `${task.estimated_hours}h` : 'No estimate'}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function getBadgeVariant(priority?: string): BadgeVariant {
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
