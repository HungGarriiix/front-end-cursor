'use client'

import type React from 'react'
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useUser } from '@clerk/clerk-react'
import { Mail, Phone, MapPin, Calendar, Edit2 } from 'lucide-react'

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user: clerkUser } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: clerkUser?.fullName || '',
    email: clerkUser?.primaryEmailAddress?.emailAddress || '',
    phone: clerkUser?.primaryPhoneNumber?.phoneNumber || '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinDate:
      clerkUser?.createdAt?.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }) || 'January 2024',
  })

  const initials =
    clerkUser?.fullName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
    // TODO: In a real app, save user profile to backend or Clerk metadata
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-gray-400 mt-1">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <CardTitle>Personal Information</CardTitle>
              <Button
                variant={isEditing ? 'default' : 'outline'}
                size="sm"
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="gap-2"
              >
                <Edit2 className="w-4 h-4" />
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={clerkUser?.imageUrl || '/placeholder.svg'}
                  alt={clerkUser?.fullName || 'User'}
                />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Profile Picture</p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {clerkUser?.fullName}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-transparent"
                >
                  Change Picture
                </Button>
              </div>
            </div>

            <div className="border-t border-border pt-6" />

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                {isEditing ? (
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-input border-border"
                  />
                ) : (
                  <p className="text-foreground py-2">{formData.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <label className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                </div>
                {isEditing ? (
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-input border-border"
                  />
                ) : (
                  <p className="text-foreground py-2">{formData.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <label className="text-sm font-medium text-foreground">
                    Phone Number
                  </label>
                </div>
                {isEditing ? (
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-input border-border"
                  />
                ) : (
                  <p className="text-foreground py-2">{formData.phone}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <label className="text-sm font-medium text-foreground">
                    Location
                  </label>
                </div>
                {isEditing ? (
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="bg-input border-border"
                  />
                ) : (
                  <p className="text-foreground py-2">{formData.location}</p>
                )}
              </div>

              {/* Join Date */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <label className="text-sm font-medium text-foreground">
                    Member Since
                  </label>
                </div>
                <p className="text-foreground py-2">{formData.joinDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
