import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { PlusIcon, Users as UsersIcon, EyeIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateTeamForm from './components/create-team-form';
import ViewTeamDialog from './components/view-team-dialog';

// Define types for the team data
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
  members_count?: number;
  members: User[];
  projects?: Project[];
}

interface IndexProps {
  teams: Team[];
}

export default function Index({ teams }: IndexProps) {
  const [open, setOpen] = useState(false);

  return (
    <AppLayout>
      <Head title="Teams" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Teams</h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                  <DialogDescription>Fill in the details to create a new team.</DialogDescription>
                </DialogHeader>
                <CreateTeamForm onSuccess={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {teams && teams.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
              <p className="text-gray-500 dark:text-gray-400">No teams found. Create your first team to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams && teams.map((team) => (
                <div key={team.id}>
                  <ViewTeamDialog
                    team={{
                      ...team,
                      members: team.members || [],
                    }}
                    availableUsers={[]}
                    trigger={
                      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                          <div className="flex justify-between">
                            <CardTitle className="text-lg">{team.name}</CardTitle>
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <CardDescription>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <UsersIcon className="h-4 w-4 mr-1" />
                              {team.members_count || 0} {(team.members_count || 0) === 1 ? 'member' : 'members'}
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {team.description || 'No description provided.'}
                          </p>
                        </CardContent>
                      </Card>
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
