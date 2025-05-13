import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { CalendarIcon, Clock as ClockIcon, User as UserIcon, MessageSquare as ChatBubbleLeftIcon, Paperclip as PaperClipIcon, PencilIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EditTaskForm from './components/edit-task-form';

// Define types
interface User {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user?: User;
}

interface Attachment {
  id: number;
  file_name: string;
  file_path: string;
  file_size: number;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  project?: Project;
  assignee?: User;
  reporter?: User;
  comments?: Comment[];
  attachments?: Attachment[];
  dependencies?: Task[];
}

interface ShowProps {
  task: Task;
  projects: Project[];
  users: User[];
}

// Define allowed badge variants based on the ShadCN UI implementation
type BadgeVariant = 'destructive' | 'secondary' | 'outline' | 'default';

export default function Show({ task, projects, users }: ShowProps) {
  const [open, setOpen] = useState(false);
  const { delete: destroy } = useForm();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      destroy(route('tasks.destroy', task.id));
    }
  };

  return (
    <AppLayout>
      <Head title={task.title} />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Link href={route('tasks.index')}>
                <Button variant="outline" size="sm">Back to Tasks</Button>
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{task.title}</h1>
              <Badge variant={getBadgeVariant(task.priority)}>
                {task.priority || 'No Priority'}
              </Badge>
              <Badge variant={getStatusBadgeVariant(task.status)}>
                {task.status || 'No Status'}
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <PencilIcon className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Task: {task.title}</DialogTitle>
                    <DialogDescription>Make changes to your task here.</DialogDescription>
                  </DialogHeader>
                  <EditTaskForm
                    task={task}
                    projects={projects}
                    users={users}
                    onSuccess={() => setOpen(false)}
                  />
                </DialogContent>
              </Dialog>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">
                      {task.description || 'No description provided.'}
                    </p>
                  </CardContent>
                </Card>

                {task.comments && task.comments.length > 0 && (
                  <div className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Comments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {task.comments.map((comment) => (
                            <div key={comment.id} className="border-b pb-4 last:border-0 last:pb-0">
                              <div className="flex items-center mb-2">
                                <UserIcon className="h-4 w-4 mr-2" />
                                <span className="font-medium">{comment.user?.name || 'Unknown User'}</span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                                  {new Date(comment.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {task.attachments && task.attachments.length > 0 && (
                  <div className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Attachments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {task.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center">
                              <PaperClipIcon className="h-4 w-4 mr-2" />
                              <a 
                                href={attachment.file_path} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {attachment.file_name}
                              </a>
                              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                                ({formatFileSize(attachment.file_size)})
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Project</h3>
                        <p>{task.project?.name || 'Not assigned'}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Assignee</h3>
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-2" />
                          <p>{task.assignee?.name || 'Not assigned'}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reporter</h3>
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-2" />
                          <p>{task.reporter?.name || 'Not assigned'}</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Date</h3>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <p>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Tracking</h3>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          <p>
                            {task.estimated_hours ? `${task.estimated_hours}h estimated` : 'No estimate'}
                            {task.actual_hours ? ` / ${task.actual_hours}h spent` : ''}
                          </p>
                        </div>
                      </div>

                      {task.dependencies && task.dependencies.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dependencies</h3>
                          <ul className="list-disc list-inside">
                            {task.dependencies.map((dependency) => (
                              <li key={dependency.id}>
                                <Link 
                                  href={route('tasks.show', dependency.id)}
                                  className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {dependency.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
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

function getStatusBadgeVariant(status?: string): BadgeVariant {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'done':
      return 'secondary'; // Changed from 'success' to match available variants
    case 'in progress':
      return 'default';   // Changed from 'primary' to match available variants
    case 'blocked':
      return 'destructive';
    case 'to do':
    case 'backlog':
      return 'secondary';
    default:
      return 'outline';
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}
