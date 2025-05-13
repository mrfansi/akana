import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Create custom icon components
const CalendarIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
);

const ClockIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const UserIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);
// Create placeholder icons until we can install the proper package
const ViewColumnsIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
);

const ClipboardDocumentListIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
    </svg>
);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Task {
    id: number;
    title: string;
    description?: string;
    priority?: string;
    status?: string;
    due_date?: string;
    assignee?: {
        name: string;
    };
    project?: {
        name: string;
    };
}

interface Project {
    id: number;
    name: string;
    description?: string;
    status?: string;
    team?: {
        name: string;
    };
    tasks?: any[];
    boards?: any[];
}

interface UserStats {
    tasks_count?: number;
    projects_count?: number;
    due_soon_count?: number;
    completed_count?: number;
}

interface DashboardProps {
    recentTasks?: Task[];
    upcomingTasks?: Task[];
    recentProjects?: Project[];
    userStats?: UserStats;
}

export default function Dashboard({ recentTasks = [], upcomingTasks = [], recentProjects = [], userStats = {} }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Dashboard</h1>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">My Tasks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{userStats?.tasks_count || 0}</div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">My Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{userStats?.projects_count || 0}</div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Soon</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{userStats?.due_soon_count || 0}</div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</CardTitle>
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
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
                                    <ClipboardDocumentListIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                    <p className="text-gray-500 dark:text-gray-400">No tasks assigned to you.</p>
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
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                                        {task.description || 'No description provided.'}
                                                    </p>
                                                </CardContent>
                                                <CardFooter className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-0">
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
                                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
                                    <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                    <p className="text-gray-500 dark:text-gray-400">No upcoming tasks due soon.</p>
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
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                                        {project.description || 'No description provided.'}
                                                    </p>
                                                </CardContent>
                                                <CardFooter className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
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
                                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
                                    <ClipboardDocumentListIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                    <p className="text-gray-500 dark:text-gray-400">No projects found.</p>
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

// Define allowed badge variants based on the ShadCN UI implementation
type BadgeVariant = 'destructive' | 'secondary' | 'outline' | 'default';

function getPriorityBadgeVariant(priority?: string): BadgeVariant {
    switch (priority?.toLowerCase()) {
        case 'high':
            return 'destructive';
        case 'medium':
            return 'secondary';  // Changed from 'warning' to match available variants
        case 'low':
            return 'secondary';
        default:
            return 'outline';
    }
}

function getStatusBadgeVariant(status?: string): BadgeVariant {
    switch (status?.toLowerCase()) {
        case 'completed':
        case 'done':
            return 'secondary';  // Changed from 'success' to match available variants
        case 'in progress':
            return 'default';    // Changed from 'primary' to match available variants
        case 'on hold':
        case 'blocked':
            return 'secondary';  // Changed from 'warning' to match available variants
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
