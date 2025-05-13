import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { PlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';

// Define types
interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateProps {
  users?: User[];
}

interface TeamFormData {
  name: string;
  description: string;
  members: string[];
  [key: string]: any; // Add index signature to satisfy FormDataType constraint
}

export default function Create({ users = [] }: CreateProps) {
  const [open, setOpen] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm<TeamFormData>({
    name: '',
    description: '',
    members: [],
  });

  // Check if we're in an iframe
  const [isInDialog, setIsInDialog] = useState(false);

  useEffect(() => {
    // Listen for messages from the parent window
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'DIALOG_OPEN') {
        setIsInDialog(true);
        setOpen(true);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // If not in an iframe, open the dialog by default
    if (window.self === window.top) {
      setOpen(true);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('teams.store'), {
      onSuccess: () => {
        reset();
        setOpen(false);
        
        // If in dialog/iframe, redirect the parent window
        if (isInDialog && window.parent) {
          window.parent.location.href = route('teams.index');
        }
      }
    });
  };

  return (
    <AppLayout>
      <Head title="Create Team" />
      
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
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
