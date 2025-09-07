
'use server';

import { revalidatePath } from 'next/cache';
import { Task, taskSchema } from '@/lib/types';
import { generateShareableLink as generateShareableLinkFlow } from '@/ai/flows/generate-shareable-link';
import { db } from '@/lib/firebase';
import { admin } from '@/lib/firebase-admin';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, Timestamp, getDoc } from 'firebase/firestore';

async function getUserId(idToken: string) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export async function getTasks(idToken: string): Promise<Task[]> {
  const userId = await getUserId(idToken);
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

export async function addTask(idToken: string, data: Omit<Task, 'id'>) {
    const userId = await getUserId(idToken);
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

export async function updateTask(idToken: string, id: string, data: Partial<Omit<Task, 'id'>>) {
    const userId = await getUserId(idToken);
    const taskRef = doc(db, 'tasks', id);

    const taskDoc = await getDoc(taskRef);
    if (taskDoc.exists() && taskDoc.data().userId !== userId) {
        throw new Error("User does not have permission to update this task.");
    }
    
    const validation = taskSchema.partial().safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.message);
    }
    
    await updateDoc(taskRef, validation.data);
    revalidatePath('/');
    
    return { id, ...data } as Task;
}

export async function deleteTask(idToken: string, id: string) {
    const userId = await getUserId(idToken);
    const taskRef = doc(db, 'tasks', id);

    const taskDoc = await getDoc(taskRef);
    if (taskDoc.exists() && taskDoc.data().userId !== userId) {
        throw new Error("User does not have permission to delete this task.");
    }

    await deleteDoc(taskRef);
    revalidatePath('/');
    return { success: true };
}


export async function generateShareableLink(idToken: string): Promise<{ shareableLink: string }> {
    try {
        const userId = await getUserId(idToken);
        const result = await generateShareableLinkFlow({
            taskListId: 'default-list',
            userId: userId,
        });
        return result;
    } catch (error) {
        console.error("Error generating shareable link:", error);
        return { shareableLink: 'ERROR' };
    }
}
