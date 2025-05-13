import React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogClose } from '@/components/ui/dialog';

// Define types
interface Project {
  id: number;
  name: string;
}

interface CreateBoardFormProps {
  projects: Project[];
  onSuccess?: () => void;
}

interface BoardFormData {
  name: string;
  description: string;
  project_id: string;
  [key: string]: any; // Add index signature to satisfy FormDataType constraint
}

export default function CreateBoardForm({ projects, onSuccess }: CreateBoardFormProps) {
  const { data, setData, post, processing, errors, reset } = useForm<BoardFormData>({
    name: '',
    description: '',
    project_id: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('boards.store'), {
      onSuccess: () => {
        reset();
        if (onSuccess) onSuccess();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="px-4">
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
          <h3 className="text-sm font-medium mb-2">Default Columns</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            When you create a board, the following default columns will be added automatically:
          </p>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white dark:bg-gray-600 p-2 rounded border text-center text-sm">To Do</div>
            <div className="bg-white dark:bg-gray-600 p-2 rounded border text-center text-sm">In Progress</div>
            <div className="bg-white dark:bg-gray-600 p-2 rounded border text-center text-sm">In Review</div>
            <div className="bg-white dark:bg-gray-600 p-2 rounded border text-center text-sm">Done</div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            You can add, edit, or remove columns after creating the board.
          </p>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={processing}>Create Board</Button>
        </div>
      </div>
    </form>
  );
}
