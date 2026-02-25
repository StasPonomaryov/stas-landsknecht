import { GithubAuthProvider, signInWithPopup, signOut, type Auth, type User } from 'firebase/auth';
import { useNuxtApp } from '#app';

export const useFirebaseAuth = () => {
  const { $auth } = useNuxtApp();

  const signInWithGitHub = async (): Promise<User | null> => {
    if (!$auth) {
      throw new Error('Firebase auth is not configured');
    }

    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup($auth as Auth, provider);

      return result.user;
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    if (!$auth) {
      return;
    }

    try {
      await signOut($auth as Auth);
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
