import { type User } from "firebase/auth";
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null
  }),
  actions: {
    setUser(user: User) {
      this.user = user
    },
    clearUser() {
      this.user = null
    },
    getUserName(): string {
      return this.user?.displayName || this.user?.email || ''
    },
    isAuthenticated(): boolean {
      return !!this.user
    }
  },
  persist: true,
});