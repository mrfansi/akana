import React from 'react';
import { useForm } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User as UserIcon, X as XIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface TeamMemberItemProps {
  teamId: number;
  member: User;
  currentUserIsAdmin?: boolean;
  onRemove?: () => void;
}

export default function TeamMemberItem({ teamId, member, currentUserIsAdmin = false, onRemove }: TeamMemberItemProps) {
  const { delete: destroy, processing } = useForm();

  const handleRemoveMember = () => {
    destroy(route('teams.members.destroy', { team: teamId, user: member.id }), {
      onSuccess: () => {
        if (onRemove) onRemove();
      },
    });
  };

  return (
    <div className="py-3 flex items-center justify-between">
      <div className="flex items-center">
        <UserIcon className="h-5 w-5 mr-3 text-gray-500" />
        <div>
          <p className="font-medium">{member.name}</p>
          <p className="text-sm text-gray-500">{member.email}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant="secondary">{member.role || 'Member'}</Badge>
        
        {currentUserIsAdmin && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                <XIcon className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove {member.name} from this team? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleRemoveMember}
                  className="bg-red-500 hover:bg-red-600"
                  disabled={processing}
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
