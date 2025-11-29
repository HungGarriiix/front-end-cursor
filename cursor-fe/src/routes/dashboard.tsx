import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Chatbot } from '@/components/dashboard/chatbot'
import { ProtectedRoute } from '@/components/protected-route'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
        <Chatbot />
      </div>
    </ProtectedRoute>
  )
}

export default DashboardLayout
