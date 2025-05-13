import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { CalendarIcon, Users as UsersIcon, PlusIcon } from 'lucide-react';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

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
  tasks?: Task[];
  start_date?: string;
  end_date?: string;
}

interface IndexProps {
  projects: Project[];
}

// Define allowed badge variants based on the ShadCN UI implementation
type BadgeVariant = 'destructive' | 'secondary' | 'outline' | 'default';

export default function Index({ projects }: IndexProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <AppLayout>
      <Head title="Projects" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Projects</h1>
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Create New Project</DrawerTitle>
                  <DrawerDescription>Fill out the form below to create a new project.</DrawerDescription>
                </DrawerHeader>
                <div className="px-4">
                  <iframe src={route('projects.create')} className="w-full h-[80vh] border-none" />
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
              <p className="text-gray-500 dark:text-gray-400">No projects found. Create your first project to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link key={project.id} href={route('projects.show', project.id)} className="block">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge variant={getStatusBadgeVariant(project.status)}>
                          {project.status || 'No Status'}
                        </Badge>
                      </div>
                      <CardDescription>
                        {project.team?.name || 'No Team'}
                      </CardDescription>
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
                </Link>
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
