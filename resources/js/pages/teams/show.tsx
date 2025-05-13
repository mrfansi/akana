import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { PencilIcon, Trash2Icon, UserPlusIcon, Users as UsersIcon, User as UserIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AddMemberForm from './components/add-member-form';
import TeamMemberItem from './components/team-member-item';
import EditTeamForm from './components/edit-team-form';

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

interface ShowProps {
  team: Team;
  availableUsers?: User[];
}

export default function Show({ team, availableUsers = [] }: ShowProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const { delete: destroy } = useForm();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this team?')) {
      destroy(route('teams.destroy', team.id));
    }
  };

  return (
    <AppLayout>
      <Head title={team.name} />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Link href={route('teams.index')}>
                <Button variant="outline" size="sm">Back to Teams</Button>
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{team.name}</h1>
            </div>
            <div className="flex space-x-2">
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
                  <EditTeamForm team={team} onSuccess={() => setEditOpen(false)} />
                </DialogContent>
              </Dialog>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2Icon className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
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
                            onSuccess={() => setAddMemberOpen(false)}
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
                                <Link 
                                  href={route('projects.show', project.id)}
                                  className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {project.name}
                                </Link>
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
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
