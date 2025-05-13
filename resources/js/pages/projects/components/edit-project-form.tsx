import React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';

// Define types
interface Team {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
  description?: string;
  status?: string;
  team_id?: string;
  start_date?: string;
  end_date?: string;
}

interface EditProjectFormProps {
  project: Project;
  teams?: Team[];
  onSuccess?: () => void;
}

export default function EditProjectForm({ project, teams = [], onSuccess }: EditProjectFormProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: project.name || '',
    description: project.description || '',
    status: project.status || '',
    team_id: project.team_id?.toString() || '',
    start_date: project.start_date || '',
    end_date: project.end_date || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('projects.update', project.id), {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        <div>
          <Label htmlFor="name">Project Name</Label>
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
          <Label htmlFor="status">Status</Label>
          <Select
            value={data.status}
            onValueChange={(value) => setData('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Planning">Planning</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
        </div>

        <div>
          <Label htmlFor="team_id">Team</Label>
          <Select
            value={data.team_id}
            onValueChange={(value) => setData('team_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No Team</SelectItem>
              {teams?.map((team) => (
                <SelectItem key={team.id} value={team.id.toString()}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.team_id && <p className="text-red-500 text-sm mt-1">{errors.team_id}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={data.start_date}
              onChange={(e) => setData('start_date', e.target.value)}
            />
            {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
          </div>

          <div>
            <Label htmlFor="end_date">End Date</Label>
            <Input
              id="end_date"
              type="date"
              value={data.end_date}
              onChange={(e) => setData('end_date', e.target.value)}
            />
            {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={processing}>Update Project</Button>
      </DialogFooter>
    </form>
  );
}
