'use client';

import type { Task } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, Edit, MoreVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
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
} from './ui/alert-dialog';
import { useTransition } from 'react';
import { deleteTask } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { TaskFormDialog } from './task-form-dialog';
import { cn } from '@/lib/utils';

export function TaskCard({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const getStatusBadge = () => {
    switch (task.status) {
      case 'To Do':
        return <Badge variant="secondary">To Do</Badge>;
      case 'In Progress':
        return <Badge variant="default">In Progress</Badge>;
      case 'Completed':
        return (
          <Badge className="border-transparent bg-accent text-accent-foreground hover:bg-accent/80">
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{task.status}</Badge>;
    }
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTask(task.id);
      if (result.success) {
        toast({
          title: 'Task deleted',
          description: `The task "${task.title}" has been successfully deleted.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error deleting task',
          description: 'Something went wrong. Please try again.',
        });
      }
    });
  };

  return (
    <Card className={cn('transform transition-all hover:shadow-lg', task.status === 'Completed' && 'opacity-60')}>
      <CardHeader className="flex-row items-start justify-between gap-4 p-4">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold leading-none tracking-tight">
            {task.title}
          </CardTitle>
          {task.description && (
            <CardDescription className="line-clamp-2 text-sm">
              {task.description}
            </CardDescription>
          )}
        </div>
        <AlertDialog>
          <TaskFormDialog task={task}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
          </TaskFormDialog>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                task &quot;{task.title}&quot;.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="flex items-center justify-between p-4 pt-0">
        {getStatusBadge()}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{format(task.dueDate, 'MMM d')}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
