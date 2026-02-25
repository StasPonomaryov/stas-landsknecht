import { GithubAuthProvider, signInWithPopup, signOut, type Auth, type User } from 'firebase/auth';
import { useNuxtApp } from '#app';
import { useAuthStore } from '~/stores/auth';

export const useFirebaseAuth = () => {
  if (import.meta.server) {
    return {
      signInWithGitHub: async (): Promise<User | null> => null,
      signOutUser: async () => {},
      getCurrentUser: (): User | null => null,
    };
  }

  const { $auth } = useNuxtApp();
  const authStore = useAuthStore();

  const signInWithGitHub = async (): Promise<User | null> => {
    if (!$auth) {
      throw new Error('Firebase is not configured. Check your environment variables.');
    }
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup($auth as Auth, provider);
      authStore.setUser(result.user);
      authStore.setAuthResolved(true);

      return result.user;
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    if (!$auth) {
      authStore.clearUser();
      authStore.setAuthResolved(true);
      return;
    }
    try {
      await signOut($auth as Auth);
      authStore.clearUser();
      authStore.setAuthResolved(true);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const getCurrentUser = (): User | null => {
    return ($auth as Auth)?.currentUser || null;
  };

  return {
    signInWithGitHub,
    signOutUser,
    getCurrentUser,
  };
};
