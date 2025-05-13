import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateBoardForm from './components/create-board-form';

import { PlusIcon } from 'lucide-react';

// Create custom icon component
const ViewColumnsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
);

// Define types
interface Task {
  id: number;
  title: string;
}

interface Column {
  id: number;
  name: string;
  tasks?: Task[];
}

interface Project {
  id: number;
  name: string;
}

interface Board {
  id: number;
  name: string;
  description?: string;
  project?: Project;
  columns?: Column[];
}

interface IndexProps {
  boards: Board[];
  projects: Project[];
}

export default function Index({ boards, projects }: IndexProps) {
  const [open, setOpen] = useState(false);
  return (
    <AppLayout>
      <Head title="Boards" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Kanban Boards</h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Board
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Create New Board</DialogTitle>
                  <DialogDescription>Fill out the form below to create a new board.</DialogDescription>
                </DialogHeader>
                <CreateBoardForm
                  projects={projects}
                  onSuccess={() => setOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {boards.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
              <p className="text-gray-500 dark:text-gray-400">No boards found. Create your first board to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <Link key={board.id} href={route('boards.show', board.id)} className="block">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{board.name}</CardTitle>
                      <CardDescription>
                        {board.project?.name || 'No Project'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {board.description || 'No description provided.'}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <ViewColumnsIcon className="h-4 w-4 mr-1" />
                        {board.columns?.length || 0} columns
                      </div>
                      <div>
                        {board.columns?.reduce((acc, column) => acc + (column.tasks?.length || 0), 0) || 0} tasks
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
