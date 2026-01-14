import { signOutFn, type CurrentUser } from '@/server/functions/auth'
import { useLoaderData } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'

export function useAuth() {
  const { currentUser } = useLoaderData({ from: '__root__' }) as {
    currentUser: CurrentUser
  }
  const signOut = useServerFn(signOutFn)

  return {
    currentUser,
    signOut,
  }
}
