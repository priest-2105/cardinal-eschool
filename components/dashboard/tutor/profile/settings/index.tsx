'use client'

import { Button } from "@/components/dashboard/tutor/ui/button"
import { Card } from "@/components/dashboard/tutor/ui/card"
import { Input } from "@/components/dashboard/tutor/ui/input"
import { Label } from "@/components/dashboard/tutor/ui/label" 

export default function TutorSettings() {

  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Account Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Change Password</h3>
            <div className="sm:grid sm:grid-cols-2 gap-4 max-sm:block">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2"></div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>
            <Button className="bg-[#1BC2C2] hover:bg-teal-600">
              Update Password
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="tutor@example.com" />
              </div>
            </div>
            <Button className="bg-[#1BC2C2] hover:bg-teal-600">
              Confirm Email
            </Button>
          </div>

          {/* <div className="space-y-4">
            <h3 className="text-lg font-medium">Notification Preferences</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <Switch
                  id="sms-notifications"
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Language Preferences</h3>
            <div className="space-y-2">
              <Label htmlFor="language">Preferred Language</Label>
              <Select defaultValue="english">
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}
        </div>

        <div className="flex justify-end">
          <Button className="bg-[#1BC2C2] hover:bg-teal-600">
            Save All Changes
          </Button>
        </div>
      </div>
    </Card>
  )
}

