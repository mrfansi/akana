import React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';

// Define types
interface Project {
  id: number;
  name: string;
}

interface Board {
  id: number;
  name: string;
  description?: string;
  project_id?: string;
}

interface EditBoardFormProps {
  board: Board;
  projects?: Project[];
  onSuccess?: () => void;
}

export default function EditBoardForm({ board, projects = [], onSuccess }: EditBoardFormProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: board.name || '',
    description: board.description || '',
    project_id: board.project_id?.toString() || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('boards.update', board.id), {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
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
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            rows={4}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
              <SelectItem value="">No Project</SelectItem>
              {projects?.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.project_id && <p className="text-red-500 text-sm mt-1">{errors.project_id}</p>}
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={processing}>Update Board</Button>
      </DialogFooter>
    </form>
  );
}
