import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PencilIcon, Trash2Icon, UserPlusIcon, Users as UsersIcon } from 'lucide-react';
import AddMemberForm from './add-member-form';
import TeamMemberItem from './team-member-item';
import EditTeamForm from './edit-team-form';

// Define types
interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface Project {
  id: number;
  name: string;
}

interface Team {
  id: number;
  name: string;
  description?: string;
  members: User[];
  projects?: Project[];
}

interface ViewTeamDialogProps {
  team: Team;
  availableUsers?: User[];
  trigger: React.ReactNode;
}

export default function ViewTeamDialog({ team, availableUsers = [], trigger }: ViewTeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const { delete: destroy } = useForm();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this team?')) {
      destroy(route('teams.destroy', team.id));
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{team.name}</DialogTitle>
          <DialogDescription>
            Team details and members
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-end space-x-2 mb-4">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Edit Team: {team.name}</DialogTitle>
                <DialogDescription>Make changes to your team here.</DialogDescription>
              </DialogHeader>
              <EditTeamForm team={team} onSuccess={() => {
                setEditOpen(false);
                window.location.reload(); // Refresh to get updated data
              }} />
            </DialogContent>
          </Dialog>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2Icon className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">
                  {team.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Team Members</CardTitle>
                  <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <UserPlusIcon className="mr-2 h-4 w-4" />
                        Add Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Add Team Member</DialogTitle>
                        <DialogDescription>Invite a new member to join this team.</DialogDescription>
                      </DialogHeader>
                      <AddMemberForm
                        teamId={team.id}
                        availableUsers={availableUsers}
                        onSuccess={() => {
                          setAddMemberOpen(false);
                          window.location.reload(); // Refresh to get updated data
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {team.members && team.members.length > 0 ? (
                      <div className="divide-y">
                        {team.members.map((member) => (
                          <TeamMemberItem
                            key={member.id}
                            teamId={team.id}
                            member={member}
                            currentUserIsAdmin={true} // This should be based on actual user permissions
                            onRemove={() => window.location.reload()} // Refresh the page after removing a member
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No members in this team yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Team Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Count</h3>
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-2" />
                      <p>{team.members?.length || 0} members</p>
                    </div>
                  </div>

                  <Separator />

                  {team.projects && team.projects.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Projects</h3>
                      <ul className="mt-2 space-y-2">
                        {team.projects.map((project) => (
                          <li key={project.id}>
                            <a 
                              href={route('projects.show', project.id)}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                              onClick={(e) => {
                                e.preventDefault();
                                // Open project dialog (would need to implement this)
                                window.location.href = route('projects.show', project.id);
                              }}
                            >
                              {project.name}
                            </a>
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
      </DialogContent>
    </Dialog>
  );
}
