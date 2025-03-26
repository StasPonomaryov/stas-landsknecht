import { defineStore } from 'pinia';
import { addDoc, deleteDoc, doc, getCountFromServer, getDocs, query, updateDoc, where } from 'firebase/firestore';
import type { NewClient, Client } from '~/types';

export const useClientsStore = defineStore('clientsStore', {
  state: () => ({
    clients: [] as Client[]
  }),
  actions: {
    async fetchClients() {
      const { $clientsRef } = useNuxtApp();
      const snapshot = await getDocs($clientsRef);
      this.clients = snapshot.docs.map((doc) => ({ ...doc.data() })) as Client[];
    },

    async addClient(client: NewClient, uid: string) {
      const { $clientsRef } = useNuxtApp();
      const docRef = await addDoc($clientsRef, { ...client, users: [uid] });

      this.clients.push({ id: docRef.id, ...client });
    },

    async updateClient(id: string, client: Client) {
      const { $clientsRef } = useNuxtApp();      
      const clientRef = doc($clientsRef, client.id);
      await updateDoc(clientRef, client);

      const index = this.clients.findIndex((client) => client.id === id)
      if (index !== -1) {
        this.clients[index] = { ...this.clients[index], ...client }
      }
    },

    async deleteClient(id: string) {
      const { $clientsRef } = useNuxtApp();
      const clientRef = doc($clientsRef, id);
      await deleteDoc(clientRef);

      this.clients = this.clients.filter((c) => c.id !== id);
    },

    async getClientsCount() {
      const { $clientsRef } = useNuxtApp();
      const snapshot = await getCountFromServer($clientsRef);
      const count = snapshot.data().count;

      return count;
    },

    async fetchUserClients(uid?: string) {
      const { $clientsRef } = useNuxtApp();

      if (!uid) {
        return this.fetchClients();
      }
      
      const q = query($clientsRef, where("users", "array-contains", uid));
      const snapshot = await getDocs(q);
      this.clients = snapshot.docs.map((doc) => ({ ...doc.data() })) as Client[];
    }
  }
});