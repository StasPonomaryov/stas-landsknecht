import { GithubAuthProvider, signInWithPopup, signOut, type Auth, type User } from 'firebase/auth'
import { useNuxtApp, onNuxtReady } from '#app'

export const useFirebaseAuth = () => {
  const { $auth } = useNuxtApp()
  let authStore: any = null

  onNuxtReady(() => {
    authStore = useAuthStore()
  })

  const signInWithGitHub = async (): Promise<User | null> => {
    if (!authStore) {
      console.warn('Pinia store is not ready yet. Waiting...')
      await new Promise(resolve => setTimeout(resolve, 100)) // Неблокуюча затримка
      authStore = useAuthStore()
    }

    try {
      const provider = new GithubAuthProvider()
      const result = await signInWithPopup($auth as Auth, provider)
      if (authStore) {
        authStore.setUser(result.user)
      }
      return result.user
    } catch (error) {
      console.error('GitHub sign-in error:', error)
      return null
    }
  }

  const signOutUser = async () => {
    if (!authStore) {
      authStore = useAuthStore()
    }

    try {
      await signOut($auth as Auth)
      if (authStore) {
        authStore.clearUser()
      }
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const getCurrentUser = (): User | null => {
    return ($auth as Auth)?.currentUser || null
  }

  return {
    signInWithGitHub,
    signOutUser,
    getCurrentUser
  }
}