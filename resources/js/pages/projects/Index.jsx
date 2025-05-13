import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { CalendarIcon, UsersIcon } from '@heroicons/react/24/outline';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ projects }) {
  return (
    <AppLayout title="Projects">
      <Head title="Projects" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
            <Link href={route('projects.create')}>
              <Button>Create Project</Button>
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
              <p className="text-gray-500">No projects found. Create your first project to get started.</p>
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
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {project.description || 'No description provided.'}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between text-xs text-gray-500">
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

function getStatusBadgeVariant(status) {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'in progress':
      return 'primary';
    case 'on hold':
      return 'warning';
    case 'cancelled':
      return 'destructive';
    case 'planning':
      return 'secondary';
    default:
      return 'outline';
  }
}
