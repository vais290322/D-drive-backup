import React, { useState } from 'react'
import { Bell, Lock, Palette, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input type="email" placeholder="john@example.com" />
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        )
      case 'security':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input type="password" />
              </div>
              <div className="flex justify-end">
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>
        )
      case 'appearance':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <label className="text-base font-medium">Dark Mode</label>
                  <p className="text-sm text-muted-foreground">
                    Enable dark mode for a comfortable viewing experience at night.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Toggle
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      case 'notifications':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Control what notifications you receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <label className="text-base font-medium">Email Notifications</label>
                  <p className="text-sm text-muted-foreground">
                    Receive daily summaries of your activity.
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <label className="text-base font-medium">Push Notifications</label>
                  <p className="text-sm text-muted-foreground">
                    Receive real-time alerts for critical updates.
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20 p-6 md:p-10">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="space-y-0.5">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 pl-4">
              <Button
                variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                className="justify-start w-full text-left"
                onClick={() => setActiveTab('profile')}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant={activeTab === 'security' ? 'secondary' : 'ghost'}
                className="justify-start w-full text-left"
                onClick={() => setActiveTab('security')}
              >
                <Lock className="mr-2 h-4 w-4" />
                Security
              </Button>
              <Button
                variant={activeTab === 'appearance' ? 'secondary' : 'ghost'}
                className="justify-start w-full text-left"
                onClick={() => setActiveTab('appearance')}
              >
                <Palette className="mr-2 h-4 w-4" />
                Appearance
              </Button>
              <Button
                variant={activeTab === 'notifications' ? 'secondary' : 'ghost'}
                className="justify-start w-full text-left"
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
            </nav>
          </aside>
          <div className="flex-1 lg:max-w-2xl">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}
