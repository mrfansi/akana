import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { PlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateTaskForm from './components/create-task-form';

// Define types
interface User {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
}

interface CreateProps {
  projects: Project[];
  users: User[];
}

interface TaskFormData {
  title: string;
  description: string;
  project_id: string;
  assignee_id: string;
  status: string;
  priority: string;
  due_date: Date | null;
  estimated_hours: string;
  [key: string]: any; // Add index signature to satisfy FormDataType constraint
}

export default function Create({ projects, users }: CreateProps) {
  const [open, setOpen] = useState(false);

  return (
    <AppLayout>
      <Head title="Create Task" />
      
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
        </div>
      </div>
    </AppLayout>
  );
}
