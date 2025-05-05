import { defineStore } from 'pinia';
import { addDoc, collection, doc, Firestore, getCountFromServer, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import type { NewTask, Task } from '~/types';
import { useNuxtApp } from 'nuxt/app';

export const useTasksStore = defineStore('tasksStore', {
  state: () => ({
    tasks: [] as Task[]
  }),
  actions: {
    async fetchTasks() {
      console.log('Fetching tasks, SSR:', process.server);
      const db = (useNuxtApp().$firestore as Firestore);
      const tasksRef = collection(db, 'tasks');
      const snapshot = await getDocs(tasksRef);
      this.tasks = snapshot.docs.map((doc) => ({ ...doc.data() })) as Task[];
    },

    async addTask(task: NewTask) {
      const db = (useNuxtApp().$firestore as Firestore);
      const tasksRef = collection(db, 'tasks');
      const docRef = await addDoc(tasksRef, task);

      this.tasks.push({ id: docRef.id, ...task });
    },

    async getTasksCount() {
      const db = (useNuxtApp().$firestore as Firestore);
      const tasksRef = collection(db, 'tasks');
      const snapshot = await getCountFromServer(tasksRef);
      const count = snapshot.data().count;

      return count;
    },

    async updateTask(id: string, task: Task) {
      const db = (useNuxtApp().$firestore as Firestore);
      const tasksRef = collection(db, 'tasks');
      const taskRef = doc(tasksRef, task.id);
      await updateDoc(taskRef, task);

      const index = this.tasks.findIndex((task) => task.id === id)

      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...task }
      }
    },

    async updateUserTask(id: string, task: Task, uid: string) {
      const db = (useNuxtApp().$firestore as Firestore);
      const tasksRef = collection(db, 'tasks');
      const taskRef = doc(tasksRef, task.id);

      await setDoc(taskRef, { users: task.users }, { merge: true });

      const index = this.tasks.findIndex((task) => task.id === id);

      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...task };
      }
    },

    async fetchUserTasks(uid?: string) {
      if (!uid) {
        console.error('Invalid user ID');
        this.tasks = [];
        return;
      }

      try {
        const db = useNuxtApp().$firestore as Firestore | undefined;
        if (!db) {
          console.error('Firestore instance is not initialized');
          this.tasks = [];
          return;
        }

        console.log('Fetching tasks for UID:', uid);
        const tasksRef = collection(db, 'tasks');
        const q = query(tasksRef, where('users', 'array-contains', uid));
        const snapshot = await getDocs(q);
        this.tasks = snapshot.docs
          .map((doc) => ({ ...doc.data() }))
          .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()) as Task[];
      } catch (error) {
        console.error('Error fetching user tasks:', error);
        this.tasks = [];
      }
    },
  }
});