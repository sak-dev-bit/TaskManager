import { getTasks } from '@/app/actions';
import { Header } from '@/components/header';
import { TaskCard } from '@/components/task-card';
import { taskStatus, type Task, type TaskStatus } from '@/lib/types';

export default async function Home() {
  const tasks = await getTasks();
  
  const columns: TaskStatus[] = [...taskStatus];
  
  const tasksByStatus = columns.reduce((acc, status) => {
    acc[status] = tasks.filter(task => task.status === status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
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
                {tasksByStatus[status].length > 0 ? (
                  tasksByStatus[status].map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-border">
                    <p className="text-sm text-muted-foreground">No tasks here.</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
