import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { CalendarIcon, Users as UsersIcon, PlusIcon, EyeIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateProjectForm from './components/create-project-form';
import ViewProjectDialog from './components/view-project-dialog';

// Define types
interface Team {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
}

interface Project {
  id: number;
  name: string;
  description?: string;
  status?: string;
  team?: Team;
  team_id?: string;
  tasks?: Task[];
  boards?: { id: number; name: string; description?: string; }[];
  start_date?: string;
  end_date?: string;
}

interface IndexProps {
  projects: Project[];
  teams: Team[];
}

// Define allowed badge variants based on the ShadCN UI implementation
type BadgeVariant = 'destructive' | 'secondary' | 'outline' | 'default';

export default function Index({ projects, teams }: IndexProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <AppLayout>
      <Head title="Projects" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Projects</h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>Fill out the form below to create a new project.</DialogDescription>
                </DialogHeader>
                <CreateProjectForm
                  teams={teams}
                  onSuccess={() => setOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
              <p className="text-gray-500 dark:text-gray-400">No projects found. Create your first project to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id}>
                  <ViewProjectDialog
                    project={project}
                    trigger={
                      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex justify-between w-full">
                              <CardTitle className="text-lg">{project.name}</CardTitle>
                              <EyeIcon className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <CardDescription>
                              {project.team?.name || 'No Team'}
                            </CardDescription>
                            <Badge variant={getStatusBadgeVariant(project.status)}>
                              {project.status || 'No Status'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {project.description || 'No description provided.'}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <UsersIcon className="h-4 w-4 mr-1" />
                            {project.tasks?.length || 0} tasks
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {project.start_date && project.end_date ? (
                              <span>
                                {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                              </span>
                            ) : (
                              'No dates set'
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function getStatusBadgeVariant(status?: string): BadgeVariant {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'default'; // Changed from 'success' to match available variants
    case 'in progress':
      return 'default'; // Changed from 'primary' to match available variants
    case 'on hold':
      return 'secondary'; // Changed from 'warning' to match available variants
    case 'cancelled':
      return 'destructive';
    case 'planning':
      return 'secondary';
    default:
      return 'outline';
  }
}
