import { defineStore } from 'pinia';
import { collection, deleteDoc, doc, Firestore, getCountFromServer, getDocs, query, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import type { Client } from '~/types';
import { useNuxtApp } from 'nuxt/app';

export const useClientsStore = defineStore('clientsStore', {
  state: () => ({
    clients: [] as Client[],
    isLoading: false,
  }),
  actions: {
    async fetchClients() {
      const db = useNuxtApp().$firestore as Firestore | null;
      if (!db) {
        console.error('Firestore is not initialized');
        this.clients = [];
        return;
      }
      const clientsRef = collection(db, 'clients');
      const snapshot = await getDocs(clientsRef);
      this.clients = snapshot.docs.map((doc) => ({ ...doc.data() })) as Client[];
    },

    async addClient(client: Client) {
      if (!client.id) {
        console.error('Invalid client ID');
        return;
      }

      try {
        const db = useNuxtApp().$firestore as Firestore | null;

        if (!db) {
          console.error('Firestore instance is not initialized');
          this.clients = [];
          return;
        }

        const clientsRef = doc(db, 'clients', client.id);
        await setDoc(clientsRef, client);
        await this.fetchUserClients(client.users[0]);
      } catch (error) {
        console.error('Error adding client:', error);
        throw error;
      }
    },

    async updateClient(id: string, client: Client) {
      const db = useNuxtApp().$firestore as Firestore | null;
      if (!db) {
        console.error('Firestore is not initialized');
        return;
      }
      const clientsRef = collection(db, 'clients');
      const clientRef = doc(clientsRef, client.id);
      await updateDoc(clientRef, client);

      const index = this.clients.findIndex((client) => client.id === id)
      if (index !== -1) {
        this.clients[index] = { ...this.clients[index], ...client }
      }
    },

    async deleteClient(id: string) {
      const db = useNuxtApp().$firestore as Firestore | null;
      if (!db) {
        console.error('Firestore is not initialized');
        return;
      }
      const clientsRef = collection(db, 'clients');
      const clientRef = doc(clientsRef, id);
      await deleteDoc(clientRef);

      this.clients = this.clients.filter((c) => c.id !== id);
    },

    async getClientsCount() {
      const db = useNuxtApp().$firestore as Firestore | null;
      if (!db) {
        console.error('Firestore is not initialized');
        return 0;
      }
      const clientsRef = collection(db, 'clients');
      const snapshot = await getCountFromServer(clientsRef);

      return snapshot.data().count;
    },

    async fetchUserClients(uid?: string) {
      if (!uid) {
        console.error('fetchUserClients: uid is required');
        this.clients = [];
        return;
      }
      const db = useNuxtApp().$firestore as Firestore | null;
      if (!db) {
        console.error('Firestore is not initialized');
        this.clients = [];
        return;
      }
      const clientsRef = collection(db, 'clients');
      const q = query(clientsRef, where("users", "array-contains", uid));
      const snapshot = await getDocs(q);
      this.clients = snapshot.docs.map((doc) => ({ ...doc.data() })) as Client[];
    },

    async removeClient(clientIds: string[]) {
      if (!clientIds.length) {
        console.error('Invalid client ID');
        return;
      }

      try {
        const db = useNuxtApp().$firestore as Firestore | null;

        if (!db) {
          console.error('Firestore instance is not initialized');
          return;
        }

        const batch = writeBatch(db);
        const clientsRef = collection(db, 'clients');

        clientIds.forEach(id => {
          const clientRef = doc(clientsRef, id);
          batch.delete(clientRef);
        });

        await batch.commit();

        this.clients = this.clients.filter(client => !clientIds.includes(client.id));

        return true;
      } catch (error) {
        console.error('Error removing client:', error);
        throw error;
      }
    }
  }
});
