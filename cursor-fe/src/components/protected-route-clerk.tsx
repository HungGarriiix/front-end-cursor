import { useUser } from '@clerk/clerk-react'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * ProtectedRoute component using Clerk for authentication
 * Redirects to /login if user is not authenticated
 * Shows loading spinner while checking authentication status
 *
 * Security features:
 * - Prevents unauthorized access to protected routes
 * - Waits for Clerk to load before rendering
 * - Uses Clerk's built-in security and session management
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    // Only redirect after Clerk has finished loading
    if (isLoaded && !isSignedIn) {
      navigate({ to: '/login', replace: true })
    }
  }, [isLoaded, isSignedIn, navigate])

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if not authenticated
  if (!isSignedIn) {
    return null
  }

  return <>{children}</>
}
