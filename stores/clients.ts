import { defineStore } from 'pinia';
import { addDoc, collection, deleteDoc, doc, Firestore, getCountFromServer, getDocs, query, updateDoc, where } from 'firebase/firestore';
import type { NewClient, Client } from '~/types';

export const useClientsStore = defineStore('clientsStore', {
  state: () => ({
    clients: [] as Client[],
    isLoading: false,
  }),
  actions: {
    async fetchClients() {
      console.log('Fetching clients, SSR:', process.server);
      const db = (useNuxtApp().$firestore as Firestore);
      const clientsRef = collection(db, 'clients');
      const snapshot = await getDocs(clientsRef);
      this.clients = snapshot.docs.map((doc) => ({ ...doc.data() })) as Client[];
    },

    async addClient(client: NewClient, uid: string) {
      const db = (useNuxtApp().$firestore as Firestore);
      const clientsRef = collection(db, 'clients');
      const docRef = await addDoc(clientsRef, { ...client, users: [uid] });

      this.clients.push({ id: docRef.id, ...client });
    },

    async updateClient(id: string, client: Client) {
      const db = (useNuxtApp().$firestore as Firestore);
      const clientsRef = collection(db, 'clients');
      const clientRef = doc(clientsRef, client.id);
      await updateDoc(clientRef, client);

      const index = this.clients.findIndex((client) => client.id === id)
      if (index !== -1) {
        this.clients[index] = { ...this.clients[index], ...client }
      }
    },

    async deleteClient(id: string) {
      const db = (useNuxtApp().$firestore as Firestore);
      const clientsRef = collection(db, 'clients');
      const clientRef = doc(clientsRef, id);
      await deleteDoc(clientRef);

      this.clients = this.clients.filter((c) => c.id !== id);
    },

    async getClientsCount() {
      const db = (useNuxtApp().$firestore as Firestore);
      const clientsRef = collection(db, 'clients');
      const snapshot = await getCountFromServer(clientsRef);
      const count = snapshot.data().count;

      return count;
    },

    async fetchUserClients(uid?: string) {
      if (!uid) {
        return this.fetchClients();
      }
      const db = (useNuxtApp().$firestore as Firestore);
      const clientsRef = collection(db, 'clients');
      
      const q = query(clientsRef, where("users", "array-contains", uid));
      const snapshot = await getDocs(q);
      this.clients = snapshot.docs.map((doc) => ({ ...doc.data() })) as Client[];
    },
  }  
});