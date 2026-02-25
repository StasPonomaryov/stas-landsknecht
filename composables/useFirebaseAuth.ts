import { GithubAuthProvider, signInWithPopup, signOut, type Auth, type User } from 'firebase/auth';
import { useNuxtApp } from '#app';
import { useAuthStore } from '~/stores/auth';

export const useFirebaseAuth = () => {
  const { $auth } = useNuxtApp();
  const authStore = useAuthStore();

  const signInWithGitHub = async (): Promise<User | null> => {
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
