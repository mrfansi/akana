import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';

// Define types
interface Column {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
}

interface Board {
  id: number;
  name: string;
  description?: string;
  project_id?: number;
  columns?: Column[];
}

interface EditProps {
  board: Board;
  projects: Project[];
}

interface BoardFormData {
  name: string;
  description: string;
  project_id: string;
  [key: string]: any; // Add index signature to satisfy FormDataType constraint
}

export default function Edit({ board, projects }: EditProps) {
  const { data, setData, put, processing, errors } = useForm<BoardFormData>({
    name: board.name || '',
    description: board.description || '',
    project_id: board.project_id?.toString() || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('boards.update', board.id));
  };

  return (
    <AppLayout>
      <Head title={`Edit Board: ${board.name}`} />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Link href={route('boards.show', board.id)}>
                <Button variant="outline" size="sm">Back to Board</Button>
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Edit Board</h1>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
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

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Board Columns</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    You can manage columns directly from the board view after saving your changes.
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {board.columns && board.columns.length > 0 ? (
                      board.columns.map((column) => (
                        <div key={column.id} className="bg-white dark:bg-gray-600 p-2 rounded border text-center text-sm">
                          {column.name}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-4 text-center text-sm text-gray-500 dark:text-gray-400 p-2">
                        No columns found
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Link href={route('boards.show', board.id)}>
                    <Button variant="outline" type="button">Cancel</Button>
                  </Link>
                  <Button type="submit" disabled={processing}>Update Board</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
