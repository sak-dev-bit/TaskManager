'use server';

import { revalidatePath } from 'next/cache';
import { Task, taskSchema } from '@/lib/types';
import { generateShareableLink as generateShareableLinkFlow } from '@/ai/flows/generate-shareable-link';
import { auth } from '@/lib/firebase';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';

async function getUserId() {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("User not authenticated");
  }
  return currentUser.uid;
}

export async function getTasks(): Promise<Task[]> {
  const userId = await getUserId();
  const tasksCol = collection(db, 'tasks');
  const q = query(tasksCol, where("userId", "==", userId));
  const taskSnapshot = await getDocs(q);
  const tasks = taskSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      status: data.status,
      dueDate: data.dueDate ? (data.dueDate as Timestamp).toDate() : undefined,
    } as Task;
  });

  return tasks.sort((a, b) => {
    if (a.status === b.status) return 0;
    if (a.status === 'Completed') return 1;
    if (b.status === 'Completed') return -1;
    return 0;
  });
}

export async function addTask(data: Omit<Task, 'id'>) {
    const userId = await getUserId();
    const validation = taskSchema.omit({id: true}).safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.message);
    }
    
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...validation.data,
      userId,
    });
    
    revalidatePath('/');

    const newDoc = validation.data;
    
    return {
      id: docRef.id,
      ...newDoc
    } as Task;
}

export async function updateTask(id: string, data: Partial<Omit<Task, 'id'>>) {
    const userId = await getUserId();
    const taskRef = doc(db, 'tasks', id);

    // TODO: We should verify the user owns this task before updating.
    
    const validation = taskSchema.partial().safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.message);
    }
    
    await updateDoc(taskRef, validation.data);
    revalidatePath('/');
    
    return { id, ...data } as Task;
}

export async function deleteTask(id: string) {
    const userId = await getUserId();
    const taskRef = doc(db, 'tasks', id);

    // TODO: We should verify the user owns this task before deleting.

    await deleteDoc(taskRef);
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
