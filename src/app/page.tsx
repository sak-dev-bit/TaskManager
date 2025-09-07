
'use client';

import { useEffect, useState } from 'react';
import { getTasks } from '@/app/actions';
import { Header } from '@/components/header';
import { TaskCard } from '@/components/task-card';
import { taskStatus, type Task, type TaskStatus } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, loading: authLoading, signIn, getIdToken } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      if (user) {
        setLoadingTasks(true);
        const idToken = await getIdToken();
        if (idToken) {
          const userTasks = await getTasks(idToken);
          setTasks(userTasks);
        }
        setLoadingTasks(false);
      } else {
        setTasks([]);
        setLoadingTasks(false);
      }
    }
    loadTasks();
  }, [user, getIdToken]);

  const columns: TaskStatus[] = [...taskStatus];
  
  const tasksByStatus = columns.reduce((acc, status) => {
    acc[status] = tasks.filter(task => task.status === status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  if (authLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
          <h2 className="text-2xl font-bold">Welcome to TaskSync</h2>
          <p className="text-muted-foreground">Please sign in to manage your tasks.</p>
          <Button onClick={signIn}>Sign In with Google</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {loadingTasks ? (
           <div className="flex justify-center">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
           </div>
        ) : (
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
            {columns.map((status) => (
              <div key={status} className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{status}</h2>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-sm font-medium text-secondary-foreground">
                    {tasksByStatus[status].length}
                  </span>
                </div>
                <div className="flex flex-col gap-4 rounded-lg border bg-card/40 p-2 min-h-[200px]">
                  {tasksByStatus[status].map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
