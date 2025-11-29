import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'

interface User {
  id: string
  email: string
  name: string
  image?: string
  phone?: string
  location?: string
  joinDate?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser()
  const { signOut } = useClerk()
  const [user, setUser] = useState<User | null>(null)

  // Sync Clerk user with local state
  useEffect(() => {
    if (isLoaded) {
      if (clerkUser) {
        const mappedUser: User = {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          name: clerkUser.fullName || clerkUser.firstName || 'User',
          image: clerkUser.imageUrl,
          phone: clerkUser.primaryPhoneNumber?.phoneNumber,
          joinDate: clerkUser.createdAt
            ? new Date(clerkUser.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })
            : undefined,
        }
        setUser(mappedUser)
      } else {
        setUser(null)
      }
    }
  }, [clerkUser, isLoaded])

  const logout = async () => {
    try {
      await signOut()
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: !isLoaded,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
