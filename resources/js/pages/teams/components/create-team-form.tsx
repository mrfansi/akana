import React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogClose } from '@/components/ui/dialog';

interface CreateTeamFormProps {
  onSuccess?: () => void;
}

interface TeamFormData {
  name: string;
  description: string;
  [key: string]: any; // Add index signature to satisfy FormDataType constraint
}

export default function CreateTeamForm({ onSuccess }: CreateTeamFormProps) {
  const { data, setData, post, processing, errors, reset } = useForm<TeamFormData>({
    name: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('teams.store'), {
      onSuccess: () => {
        reset();
        if (onSuccess) onSuccess();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="px-4">
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Team Name</Label>
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
              rows={3}
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={processing}>Create Team</Button>
        </div>
      </div>
    </form>
  );
}
