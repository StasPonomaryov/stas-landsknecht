import type { FirebaseApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

export default defineNuxtPlugin((nuxtApp) => {
  const db = getFirestore(nuxtApp.$firebaseApp as FirebaseApp);
  const tasksRef = collection(db, "tasks");
  const clientsRef = collection(db, "clients");

  return {
    provide: {
      db,
      tasksRef,
      clientsRef
    },
  };
});