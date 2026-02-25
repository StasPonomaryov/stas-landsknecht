import { defineStore } from 'pinia';
import { collection, doc, Firestore, getCountFromServer, getDocs, query, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import type { Task } from '~/types';
import { useNuxtApp } from 'nuxt/app';

export const useTasksStore = defineStore('tasksStore', {
  state: () => ({
    tasks: [] as Task[]
  }),
  actions: {
    async fetchTasks() {
      const db = useNuxtApp().$firestore as Firestore | null;
      if (!db) {
        console.error('Firestore is not initialized');
        this.tasks = [];
        return;
      }
      const tasksRef = collection(db, 'tasks');
      const snapshot = await getDocs(tasksRef);
      this.tasks = snapshot.docs.map((doc) => ({ ...doc.data() })) as Task[];
    },

    async addTask(task: Task) {
      if (!task.id) {
        console.error('Invalid task ID');
        return;
      }

      try {
        const db = useNuxtApp().$firestore as Firestore | null;

        if (!db) {
          console.error('Firestore instance is not initialized');
          this.tasks = [];
          return;
        }

        const tasksRef = doc(db, 'tasks', task.id);
        await setDoc(tasksRef, task);
        await this.fetchUserTasks(task.users[0]);
      } catch (error) {
        console.error('Error adding task:', error);
        throw error;
      }
    },

    async getTasksCount() {
      const db = useNuxtApp().$firestore as Firestore | null;
      if (!db) {
        console.error('Firestore is not initialized');
        return 0;
      }
      const tasksRef = collection(db, 'tasks');
      const snapshot = await getCountFromServer(tasksRef);

      return snapshot.data().count;
    },

    async updateTask(id: string, task: Task) {
      const db = useNuxtApp().$firestore as Firestore | null;
      if (!db) {
        console.error('Firestore is not initialized');
        return;
      }
      const tasksRef = collection(db, 'tasks');
      const taskRef = doc(tasksRef, task.id);
      await updateDoc(taskRef, task);

      const index = this.tasks.findIndex((task) => task.id === id)

      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...task }
      }
    },

    async updateUserTask(id: string, task: Task, uid: string) {
      const db = useNuxtApp().$firestore as Firestore | null;
      if (!db) {
        console.error('Firestore is not initialized');
        return;
      }
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
        const db = useNuxtApp().$firestore as Firestore | null;

        if (!db) {
          console.error('Firestore instance is not initialized');
          this.tasks = [];
          return;
        }

        const tasksRef = collection(db, 'tasks');
        const q = query(tasksRef, where('users', 'array-contains', uid));
        const snapshot = await getDocs(q);
        this.tasks = snapshot.docs
          .map((doc) => ({ ...doc.data() }))
          .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()) as Task[];
      } catch (error) {
        console.error('Error fetching user tasks:', error);
        this.tasks = [];
        throw error;
      }
    },

    async removeTask(taskIds: string[]) {
      if (!taskIds.length) {
        console.error('Invalid task ID');
        return;
      }

      try {
        const db = useNuxtApp().$firestore as Firestore | null;

        if (!db) {
          console.error('Firestore instance is not initialized');
          return;
        }

        const batch = writeBatch(db);
        const tasksRef = collection(db, 'tasks');

        taskIds.forEach(id => {
          const taskRef = doc(tasksRef, id);
          batch.delete(taskRef);
        });

        await batch.commit();

        this.tasks = this.tasks.filter(task => !taskIds.includes(task.id));

        return true;
      } catch (error) {
        console.error('Error removing task:', error);
        throw error;
      }
    }
  }
});
