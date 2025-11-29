'use client'

import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { Home, User, Calendar, History, Settings, LogOut } from 'lucide-react'
import { Button } from '../ui/button'
import { useClerk } from '@clerk/clerk-react'

const menuItems = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'Calendar',
    href: '/dashboard/calendar',
    icon: Calendar,
  },
  {
    label: 'History',
    href: '/dashboard/history',
    icon: History,
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useClerk()
  const pathname = location.pathname

  const handleLogout = async () => {
    try {
      await signOut()
      await navigate({ to: '/' })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="text-2xl font-bold text-primary">FinanceFlow</div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          // For home (/dashboard), only match exactly /dashboard or /dashboard/
          // For other routes, match exactly or when it's a subroute
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard' || pathname === '/dashboard/'
              : pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link key={item.href} to={item.href} className="block">
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-6 border-t border-border space-y-2">
        <Link to="/dashboard/settings" className="block">
          <Button
            variant={pathname === '/dashboard/settings' ? 'default' : 'ghost'}
            className="w-full justify-start gap-3"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
