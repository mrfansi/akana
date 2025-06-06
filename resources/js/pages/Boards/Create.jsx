import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import AppLayout from '@/Layouts/AppLayout';

export default function Create({ projects }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    project_id: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('boards.store'));
  };

  return (
    <AppLayout title="Create Board">
      <Head title="Create Board" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Link href={route('boards.index')}>
                <Button variant="outline" size="sm">Back to Boards</Button>
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900">Create New Board</h1>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Board Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Default Columns</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    When you create a board, the following default columns will be added automatically:
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-white p-2 rounded border text-center text-sm">To Do</div>
                    <div className="bg-white p-2 rounded border text-center text-sm">In Progress</div>
                    <div className="bg-white p-2 rounded border text-center text-sm">In Review</div>
                    <div className="bg-white p-2 rounded border text-center text-sm">Done</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    You can add, edit, or remove columns after creating the board.
                  </p>
                </div>

                <div className="flex justify-end space-x-2">
                  <Link href={route('boards.index')}>
                    <Button variant="outline" type="button">Cancel</Button>
                  </Link>
                  <Button type="submit" disabled={processing}>Create Board</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
