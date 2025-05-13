import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { CalendarIcon, Plus } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Define types
interface Team {
  id: number;
  name: string;
}

interface CreateProps {
  teams: Team[];
}

interface ProjectFormData {
  name: string;
  description: string;
  team_id: string;
  start_date: Date | null;
  end_date: Date | null;
  status: string;
  [key: string]: any; // Add index signature to satisfy FormDataType constraint
}

export default function Create({ teams }: CreateProps) {
  // Check if this page is being loaded in an iframe (embedded in a dialog)
  const isEmbedded = window.self !== window.top;
  
  // Listen for messages from the parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // If we receive a message indicating we're embedded in a dialog
      if (event.data === 'embedded-in-dialog') {
        setOpen(true);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  const [open, setOpen] = useState(!isEmbedded);
  const { data, setData, post, processing, errors, reset } = useForm<ProjectFormData>({
    name: '',
    description: '',
    team_id: '',
    start_date: null,
    end_date: null,
    status: 'Planning',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('projects.store'), {
      onSuccess: () => {
        // Reset form after successful submission
        reset();
        setOpen(false);
        // If embedded in iframe, send message to parent to refresh
        if (isEmbedded) {
          window.parent.postMessage('project-created', '*');
        }
      }
    });
  };

  return (
    isEmbedded ? (
      // When embedded in iframe, just show the form
      <>
        <Head title="Create Project" />
        <form onSubmit={handleSubmit} className="p-6">
          {/* When embedded in a dialog, we need to make sure the form fits properly */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
                      {teams?.map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          {team.name}
                        </SelectItem>
                      )) || <SelectItem value="no-team">No teams available</SelectItem>}
                    </SelectContent>
                  </Select>
                  {errors.team_id && <p className="text-red-500 text-sm mt-1">{errors.team_id}</p>}
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
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                </div>
              
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {data.start_date ? format(new Date(data.start_date), 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={data.start_date ? new Date(data.start_date) : undefined}
                          onSelect={(date) => setData('start_date', date || null)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                  </div>
      
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {data.end_date ? format(new Date(data.end_date), 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={data.end_date ? new Date(data.end_date) : undefined}
                          onSelect={(date) => setData('end_date', date || null)}
                          initialFocus
                          disabled={(date) => {
                            // Disable dates before start_date
                            return data.start_date ? date < new Date(data.start_date) : false;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
                  </div>
                </div>
      
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button type="submit" disabled={processing}>Create Project</Button>
            </div>
          </div>
        </form>
      </>
    ) : (
      // When not embedded, show the full page with drawer
      <AppLayout>
        <Head title="Create Project" />
        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Projects</h1>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>Fill in the details to create a new project.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="px-4">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Project Name</Label>
                            <Input
                              id="name"
                              type="text"
                              value={data.name}
                              onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
                                {teams?.map((team) => (
                                  <SelectItem key={team.id} value={team.id.toString()}>
                                    {team.name}
                                  </SelectItem>
                                )) || <SelectItem value="no-team">No teams available</SelectItem>}
                              </SelectContent>
                            </Select>
                            {errors.team_id && <p className="text-red-500 text-sm mt-1">{errors.team_id}</p>}
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
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="On Hold">On Hold</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                          </div>
                        
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="start_date">Start Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.start_date ? format(new Date(data.start_date), 'PPP') : <span>Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={data.start_date ? new Date(data.start_date) : undefined}
                                    onSelect={(date) => setData('start_date', date || null)}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                            </div>

                            <div>
                              <Label htmlFor="end_date">End Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.end_date ? format(new Date(data.end_date), 'PPP') : <span>Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={data.end_date ? new Date(data.end_date) : undefined}
                                    onSelect={(date) => setData('end_date', date || null)}
                                    initialFocus
                                    disabled={(date) => {
                                      // Disable dates before start_date
                                      return data.start_date ? date < new Date(data.start_date) : false;
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                              {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              rows={4}
                              value={data.description}
                              onChange={(e) => setData('description', e.target.value)}
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-6">
                        <DialogClose asChild>
                          <Button variant="outline" type="button">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>Create Project</Button>
                      </div>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Project list would go here */}
            </div>
          </div>
        </div>
      </AppLayout>
    )
  );
}
