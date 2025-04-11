'use client'

import { Button } from "@/components/dashboard/student/ui/button"
import { Card } from "@/components/dashboard/student/ui/card"
import { Input } from "@/components/dashboard/student/ui/input"
import { Label } from "@/components/dashboard/student/ui/label"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/lib/store"
import { changePassword, login } from "@/lib/api/student/api"
import { setAuthState } from "@/lib/authSlice"
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/student/ui/alert"
import { useRouter } from "next/navigation"

export default function StudentSettings() {
  const token = useSelector((state: RootState) => state.auth?.token);
  const email = useSelector((state: RootState) => state.auth?.user?.email);
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirmation: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAlert(null)
    try {
      if (token && email) {
        await changePassword(token, formData.currentPassword, formData.newPassword, formData.newPasswordConfirmation);
        const response = await login(email, formData.newPassword);
        dispatch(setAuthState({ token: response.data.token, user: response.data.user }));
        setAlert({ type: 'success', message: 'Password changed successfully. You are now logged in with the new password.' });
        setTimeout(() => {
          router.push('/student')
        }, 2000);
      }
    } catch (error) {
      console.error('Password change failed', error);
      setAlert({ type: 'error', message: (error as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Account Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {alert && (
          <Alert
            variant={alert.type === 'success' ? 'default' : 'danger'}
            className="absolute top-12 z-50 bg-white right-4"
            onClose={() => setAlert(null)}
          >
            <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Change Password</h3>
            <form onSubmit={handleSubmit} className="sm:grid sm:grid-cols-2 gap-4 max-sm:block">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                />
              </div>
              <br/><div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={formData.newPasswordConfirmation}
                  onChange={(e) => setFormData({ ...formData, newPasswordConfirmation: e.target.value })}
                />
              </div>
              <Button type="submit" className="bg-[#1BC2C2] hover:bg-teal-600" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Card>
  )
}

