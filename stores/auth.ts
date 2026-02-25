import { onAuthStateChanged, type Auth, type User } from "firebase/auth";
import { defineStore } from 'pinia';

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

const mapFirebaseUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
});

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    isAuthResolved: false,
    _authInitialized: false,
  }),
  actions: {
    setUser(user: User | AuthUser) {
      this.user = 'uid' in user && 'emailVerified' in user
        ? mapFirebaseUser(user)
        : user;
    },
    clearUser() {
      this.user = null
    },
    setAuthResolved(value: boolean) {
      this.isAuthResolved = value;
    },
    initializeAuth(auth: Auth) {
      if (this._authInitialized) {
        return;
      }

      this._authInitialized = true;
      this.setAuthResolved(false);

      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          this.setUser(firebaseUser);
        } else {
          this.clearUser();
        }

        this.setAuthResolved(true);
      });
    },
    getUserName(): string {
      return this.user?.displayName || this.user?.email || ''
    },
    isAuthenticated(): boolean {
      return !!this.user
    }
  },
  persist: {
    pick: ['user'],
  },
});
