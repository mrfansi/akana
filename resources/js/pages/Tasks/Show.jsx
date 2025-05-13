import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { CalendarIcon, ClockIcon, UserIcon, ChatBubbleLeftIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ task }) {
  const { delete: destroy } = useForm();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      destroy(route('tasks.destroy', task.id));
    }
  };

  return (
    <AppLayout title={task.title}>
      <Head title={task.title} />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Link href={route('tasks.index')}>
                <Button variant="outline" size="sm">Back to Tasks</Button>
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900">{task.title}</h1>
              <Badge variant={getBadgeVariant(task.priority)}>
                {task.priority || 'No Priority'}
              </Badge>
              <Badge variant={getStatusBadgeVariant(task.status)}>
                {task.status || 'No Status'}
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Link href={route('tasks.edit', task.id)}>
                <Button variant="outline">Edit</Button>
              </Link>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
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
                                <span className="text-gray-500 text-sm ml-2">
                                  {new Date(comment.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-gray-700">{comment.content}</p>
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
                                className="text-blue-600 hover:underline"
                              >
                                {attachment.file_name}
                              </a>
                              <span className="text-gray-500 text-sm ml-2">
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
                        <h3 className="text-sm font-medium text-gray-500">Project</h3>
                        <p>{task.project?.name || 'Not assigned'}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Assignee</h3>
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-2" />
                          <p>{task.assignee?.name || 'Not assigned'}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Reporter</h3>
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-2" />
                          <p>{task.reporter?.name || 'Not assigned'}</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <p>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Time Tracking</h3>
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
                          <h3 className="text-sm font-medium text-gray-500">Dependencies</h3>
                          <ul className="list-disc list-inside">
                            {task.dependencies.map((dependency) => (
                              <li key={dependency.id}>
                                <Link 
                                  href={route('tasks.show', dependency.id)}
                                  className="text-blue-600 hover:underline"
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

function getBadgeVariant(priority) {
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
    case 'blocked':
      return 'destructive';
    case 'to do':
    case 'backlog':
      return 'secondary';
    default:
      return 'outline';
  }
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}
