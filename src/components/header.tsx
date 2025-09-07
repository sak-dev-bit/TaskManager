'use client';

import { LogoIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { PlusCircle, Share2 } from 'lucide-react';
import { TaskFormDialog } from './task-form-dialog';
import { ShareDialog } from './share-dialog';

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-2">
          <LogoIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">TaskSync</h1>
        </div>
        <div className="flex items-center gap-2">
          <ShareDialog>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </ShareDialog>
          <TaskFormDialog>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </TaskFormDialog>
        </div>
      </div>
    </header>
  );
}
