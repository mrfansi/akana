import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ViewColumnsIcon } from '@heroicons/react/24/outline';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ boards }) {
  return (
    <AppLayout title="Boards">
      <Head title="Boards" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Kanban Boards</h1>
            <Link href={route('boards.create')}>
              <Button>Create Board</Button>
            </Link>
          </div>

          {boards.length === 0 ? (
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
              <p className="text-gray-500">No boards found. Create your first board to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <Link key={board.id} href={route('boards.show', board.id)} className="block">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{board.name}</CardTitle>
                      <CardDescription>
                        {board.project?.name || 'No Project'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {board.description || 'No description provided.'}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <ViewColumnsIcon className="h-4 w-4 mr-1" />
                        {board.columns?.length || 0} columns
                      </div>
                      <div>
                        {board.columns?.reduce((acc, column) => acc + (column.tasks?.length || 0), 0) || 0} tasks
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
