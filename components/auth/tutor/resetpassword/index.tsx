"use client"

import type React from "react"
import { useState } from "react"
import { resetPasswordEmail } from '@/lib/api/tutor/api'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function ResetPasswordPageComponent() {
  const [formData, setFormData] = useState({
    email: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAlert(null)
    try {
      const response = await resetPasswordEmail(formData.email)
      console.log('Response:', response)  
      console.log('Reset password email sent')
      setAlert({ type: 'success', message: 'Password reset email sent. Link expires in 30 minutes.' })
      router.push('/tutor/login')
    } catch (error) {
      console.error('Reset password email failed', error)
      const errorMessage = (error as unknown).response?.data?.message || (error as unknown).message
      setAlert({ type: 'error', message: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen items-center">
        <div className="w-full lg:w-1/2 px-4 mx-auto sm:px-6 lg:px-8 py-12">
          <div className="max-w-lg flex mx-auto items-center align-middle self-center">
            <div></div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Tutor Reset Password</h2>
              <p className="text-gray-600 font-semibold mb-8">
                Enter your email address to reset your password
              </p>
              {alert && (
                <Alert variant={alert.type === 'success' ? 'default' : 'danger'} className="absolute top-4 right-4">
                  <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                  <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                /> 
                <Button type="submit" className="w-full" size="lg">
                  {isSubmitting ? 'Resetting' : 'Reset'}
                </Button>
              </form>
              <div className="text-center mr-auto mt-10"> <Link className="text-[#1BC2C2]" href="/tutor/login">Back to login</Link></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}