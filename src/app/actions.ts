'use server';

import { revalidatePath } from 'next/cache';
import { Task, taskSchema } from '@/lib/types';
import { generateShareableLink as generateShareableLinkFlow } from '@/ai/flows/generate-shareable-link';

// In-memory store for tasks
let tasks: Task[] = [
    {
        id: '1',
        title: 'Design the landing page',
        description: 'Create a mockup in Figma for the new landing page.',
        status: 'In Progress',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    },
    {
        id: '2',
        title: 'Implement user authentication',
        description: 'Set up Firebase Authentication with email and password.',
        status: 'To Do',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
    {
        id: '3',
        title: 'Deploy to production',
        description: 'Finalize testing and deploy the app.',
        status: 'To Do',
    },
    {
        id: '4',
        title: 'Write documentation',
        description: 'Document all the components and APIs.',
        status: 'Completed',
        dueDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    },
];

export async function getTasks(): Promise<Task[]> {
  return Promise.resolve(tasks.sort((a, b) => {
    if (a.status === b.status) return 0;
    if (a.status === 'Completed') return 1;
    if (b.status === 'Completed') return -1;
    return 0;
  }));
}

export async function addTask(data: Omit<Task, 'id'>) {
    const validation = taskSchema.omit({id: true}).safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.message);
    }
    const newTask: Task = {
        id: crypto.randomUUID(),
        ...validation.data,
    };
    tasks.push(newTask);
    revalidatePath('/');
    return newTask;
}

export async function updateTask(id: string, data: Partial<Omit<Task, 'id'>>) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        throw new Error('Task not found');
    }

    const taskToUpdate = tasks[taskIndex];
    const updatedData = {...taskToUpdate, ...data};
    
    const validation = taskSchema.safeParse(updatedData);
    if (!validation.success) {
        throw new Error(validation.error.message);
    }

    tasks[taskIndex] = validation.data;
    revalidatePath('/');
    return tasks[taskIndex];
}

export async function deleteTask(id: string) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        throw new Error('Task not found');
    }
    tasks.splice(taskIndex, 1);
    revalidatePath('/');
    return { success: true };
}


export async function generateShareableLink(): Promise<{ shareableLink: string }> {
    try {
        const result = await generateShareableLinkFlow({
            taskListId: 'default-list',
            userId: 'user-123',
        });
        return result;
    } catch (error) {
        console.error("Error generating shareable link:", error);
        return { shareableLink: 'ERROR' };
    }
}
