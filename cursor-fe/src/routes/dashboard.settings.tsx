'use client'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Lock, Bell, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const navigate = useNavigate()

  const handleBack = async () => {
    await navigate({ to: '/dashboard' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            title="Go back"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 mt-1">
              Manage your account preferences and security
            </p>
          </div>
        </div>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Account Settings</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your account preferences and security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Add an extra layer of security
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>

            {/* Change Password */}
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Change Password</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Update your password regularly
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Notifications</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Manage email and app notifications
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-red-500">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
