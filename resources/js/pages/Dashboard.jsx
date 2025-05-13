import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { CalendarIcon, ClockIcon, UserIcon, ViewColumnsIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import AppLayout from '@/Layouts/AppLayout';

export default function Dashboard({ recentTasks, recentProjects, upcomingTasks, userStats }) {
  return (
    <AppLayout title="Dashboard">
      <Head title="Dashboard" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">My Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userStats?.tasks_count || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">My Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userStats?.projects_count || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Due Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userStats?.due_soon_count || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userStats?.completed_count || 0}</div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="tasks">My Tasks</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="projects">Recent Projects</TabsTrigger>
            </TabsList>
            
            {/* My Tasks Tab */}
            <TabsContent value="tasks">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">My Recent Tasks</h2>
                <Link href={route('tasks.index')}>
                  <Button variant="outline" size="sm">View All Tasks</Button>
                </Link>
              </div>
              
              {recentTasks?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentTasks.map((task) => (
                    <Link key={task.id} href={route('tasks.show', task.id)}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{task.title}</CardTitle>
                            <Badge variant={getPriorityBadgeVariant(task.priority)}>
                              {task.priority || 'No Priority'}
                            </Badge>
                          </div>
                          <CardDescription>
                            {task.project?.name || 'No Project'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {task.description || 'No description provided.'}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between text-xs text-gray-500 pt-0">
                          <Badge variant={getStatusBadgeVariant(task.status)}>
                            {task.status || 'No Status'}
                          </Badge>
                          <div className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <ClipboardDocumentListIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No tasks assigned to you.</p>
                  <Link href={route('tasks.create')} className="mt-4 inline-block">
                    <Button size="sm">Create a Task</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            {/* Upcoming Tab */}
            <TabsContent value="upcoming">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Upcoming Tasks</h2>
                <Link href={route('tasks.index')}>
                  <Button variant="outline" size="sm">View All Tasks</Button>
                </Link>
              </div>
              
              {upcomingTasks?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingTasks.map((task) => (
                    <Link key={task.id} href={route('tasks.show', task.id)}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{task.title}</CardTitle>
                            <Badge variant={getPriorityBadgeVariant(task.priority)}>
                              {task.priority || 'No Priority'}
                            </Badge>
                          </div>
                          <CardDescription>
                            {task.project?.name || 'No Project'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {task.description || 'No description provided.'}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between text-xs text-gray-500 pt-0">
                          <div className="flex items-center">
                            <UserIcon className="h-3 w-3 mr-1" />
                            {task.assignee?.name || 'Unassigned'}
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No upcoming tasks due soon.</p>
                </div>
              )}
            </TabsContent>
            
            {/* Projects Tab */}
            <TabsContent value="projects">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Recent Projects</h2>
                <Link href={route('projects.index')}>
                  <Button variant="outline" size="sm">View All Projects</Button>
                </Link>
              </div>
              
              {recentProjects?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentProjects.map((project) => (
                    <Link key={project.id} href={route('projects.show', project.id)}>
                      <Card className="hover:shadow-md transition-shadow">
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
                            <ClipboardDocumentListIcon className="h-4 w-4 mr-1" />
                            {project.tasks?.length || 0} tasks
                          </div>
                          <div className="flex items-center">
                            <ViewColumnsIcon className="h-4 w-4 mr-1" />
                            {project.boards?.length || 0} boards
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <ClipboardDocumentListIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No projects found.</p>
                  <Link href={route('projects.create')} className="mt-4 inline-block">
                    <Button size="sm">Create a Project</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
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

function getStatusBadgeVariant(status) {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'done':
      return 'success';
    case 'in progress':
      return 'primary';
    case 'on hold':
    case 'blocked':
      return 'warning';
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
