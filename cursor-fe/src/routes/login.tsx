'use client'

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '../components/ui/button'
import { SignedOut, SignInButton, useUser } from '@clerk/clerk-react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useEffect } from 'react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { user, isLoaded } = useUser()

  // Redirect if already authenticated
  useEffect(() => {
    if (isLoaded && user) {
      navigate({ to: '/dashboard' })
    }
  }, [isLoaded, user, navigate])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center p-4">
      {/* Back to home */}
      <Link to="/" className="absolute top-6 left-6">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </Link>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card border border-border rounded-lg p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-card-foreground">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your FinanceFrend account
            </p>
          </div>

          {/* Sign In Form */}
          <SignedOut>
            <div className="space-y-4">
              <SignInButton mode="modal">
                <Button size="lg" className="w-full gap-2">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </Button>
              </SignInButton>

              <SignInButton mode="modal">
                <Button size="lg" className="w-full gap-2" variant="outline">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.844 2H3.156C2.516 2 2 2.516 2 3.156v17.688C2 21.484 2.516 22 3.156 22h17.688c.64 0 1.156-.516 1.156-1.156V3.156C22 2.516 21.484 2 20.844 2zM7.844 18.268h-3.97V9.573h3.97v8.695zM5.844 7.815c-1.274 0-2.306-1.028-2.306-2.302 0-1.274 1.032-2.306 2.306-2.306 1.272 0 2.303 1.032 2.303 2.306 0 1.274-1.031 2.302-2.303 2.302zm12.422 10.453h-3.969v-4.224c0-1.008-.364-1.694-1.271-1.694-.691 0-1.101.465-1.281.914-.065.164-.082.393-.082.622v4.382h-3.969V9.573h3.969v1.228c.385-.594.966-1.44 2.353-1.44 1.717 0 3.003 1.122 3.003 3.537v5.37z" />
                  </svg>
                  Sign in with Email
                </Button>
              </SignInButton>
            </div>
          </SignedOut>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">
                Secure Authentication
              </span>
            </div>
          </div>

          {/* Info */}
          <p className="text-center text-sm text-muted-foreground">
            Sign in securely with Google or Email. Your data is protected with
            industry-standard encryption.
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Don't have an account? Create one during sign in with Clerk.
        </p>
      </div>
    </div>
  )
}
