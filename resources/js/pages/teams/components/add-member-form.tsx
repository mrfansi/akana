import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogClose } from '@/components/ui/dialog';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AddMemberFormProps {
  teamId: number;
  availableUsers: User[];
  onSuccess?: () => void;
}

interface MemberFormData {
  user_id: string;
  role: string;
  [key: string]: any; // Add index signature to satisfy FormDataType constraint
}

export default function AddMemberForm({ teamId, availableUsers, onSuccess }: AddMemberFormProps) {
  const { data, setData, post, processing, errors, reset } = useForm<MemberFormData>({
    user_id: '',
    role: 'member',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('teams.members.store', teamId), {
      onSuccess: () => {
        reset();
        if (onSuccess) onSuccess();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <Label htmlFor="user_id">User</Label>
        <Select 
          value={data.user_id} 
          onValueChange={(value) => setData('user_id', value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {availableUsers.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name} ({user.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>}
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select 
          value={data.role} 
          onValueChange={(value) => setData('role', value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <DialogClose asChild>
          <Button variant="outline" type="button">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={processing}>Add Member</Button>
      </div>
    </form>
  );
}
