import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { CalendarIcon } from 'lucide-react';

// Define types
interface User {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  project_id?: number;
  assignee_id?: number;
  status?: string;
  priority?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
}

interface EditProps {
  task: Task;
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
  actual_hours: string;
  [key: string]: any; // Add index signature to satisfy FormDataType constraint
}

export default function Edit({ task, projects, users }: EditProps) {
  const { data, setData, put, processing, errors } = useForm<TaskFormData>({
    title: task.title || '',
    description: task.description || '',
    project_id: task.project_id?.toString() || '',
    assignee_id: task.assignee_id?.toString() || '',
    status: task.status || 'To Do',
    priority: task.priority || 'Medium',
    due_date: task.due_date ? new Date(task.due_date) : null,
    estimated_hours: task.estimated_hours?.toString() || '',
    actual_hours: task.actual_hours?.toString() || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('tasks.update', task.id));
  };

  return (
    <AppLayout>
      <Head title={`Edit Task: ${task.title}`} />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Link href={route('tasks.show', task.id)}>
                <Button variant="outline" size="sm">Back to Task</Button>
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Edit Task</h1>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        required
                      />
                      {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                      <Label htmlFor="project_id">Project</Label>
                      <Select
                        value={data.project_id}
                        onValueChange={(value) => setData('project_id', value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects?.map((project) => (
                            <SelectItem key={project.id} value={project.id.toString()}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.project_id && <p className="text-red-500 text-sm mt-1">{errors.project_id}</p>}
                    </div>

                    <div>
                      <Label htmlFor="assignee_id">Assignee</Label>
                      <Select
                        value={data.assignee_id}
                        onValueChange={(value) => setData('assignee_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Unassigned</SelectItem>
                          {users?.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.assignee_id && <p className="text-red-500 text-sm mt-1">{errors.assignee_id}</p>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={data.status}
                        onValueChange={(value) => setData('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="To Do">To Do</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="In Review">In Review</SelectItem>
                          <SelectItem value="Done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={data.priority}
                        onValueChange={(value) => setData('priority', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="due_date">Due Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {data.due_date ? format(new Date(data.due_date), 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={data.due_date ? new Date(data.due_date) : undefined}
                              onSelect={(date) => setData('due_date', date || null)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="estimated_hours">Estimated Hours</Label>
                          <Input
                            id="estimated_hours"
                            type="number"
                            min="0"
                            step="0.5"
                            value={data.estimated_hours}
                            onChange={(e) => setData('estimated_hours', e.target.value)}
                          />
                          {errors.estimated_hours && <p className="text-red-500 text-sm mt-1">{errors.estimated_hours}</p>}
                        </div>
                        
                        <div>
                          <Label htmlFor="actual_hours">Actual Hours</Label>
                          <Input
                            id="actual_hours"
                            type="number"
                            min="0"
                            step="0.5"
                            value={data.actual_hours}
                            onChange={(e) => setData('actual_hours', e.target.value)}
                          />
                          {errors.actual_hours && <p className="text-red-500 text-sm mt-1">{errors.actual_hours}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="flex justify-end space-x-2">
                  <Link href={route('tasks.show', task.id)}>
                    <Button variant="outline" type="button">Cancel</Button>
                  </Link>
                  <Button type="submit" disabled={processing}>Update Task</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
