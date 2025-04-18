"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAppDispatch } from '@/lib/hooks'
import { setAuthState } from '@/lib/authSlice'
import { login } from '@/lib/api/admin/api'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeIcon as EyeClosed } from "lucide-react" 
import { useRouter } from "next/navigation"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import cardinalConfig from "@/config"


export default function AdminLoginComponent() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const dispatch = useAppDispatch()
  const router = useRouter()

  
  useEffect(() => {
    const commonAdminRoutes = [
      cardinalConfig.routes.dashboard.admin.home,
      cardinalConfig.routes.dashboard.admin.adminmanagecourses,
      cardinalConfig.routes.dashboard.admin.adminManageStudents,
      cardinalConfig.routes.dashboard.admin.adminManageTutors,
      cardinalConfig.routes.dashboard.admin.adminAnnouncements,
      
    ]

    commonAdminRoutes.forEach(route => {
      router.prefetch(route)
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.prefetch('/admin')


    if (!formData.email || !formData.password) {
      setAlert({ type: "error", message: "Both email and password are required." });
      return;
    }

    setIsSubmitting(true)
    setAlert(null)
    try {
      const response = await login(formData.email, formData.password)
      // console.log('Response:', response)  
      dispatch(setAuthState({
        token: response.data.token,
        user: response.data.user,
      }))
      // console.log('Login successful')
      setAlert({ type: 'success', message: 'Login successful' })
      router.push('/admin')
    } catch (error: unknown) { // replaced explicit any with unknown
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setAlert({ type: 'error', message: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <div className="flex min-h-screen items-center">
        <div className="w-full lg:w-1/2 px-4 mx-auto sm:px-6 lg:px-8 py-12">
          <div className="max-w-lg flex mx-auto items-center align-middle self-center">
            <div></div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Admin Log In</h2>
              <p className="text-gray-600 font-semibold mb-8">
                Enter your email address and password to securely log in to Cardinal E-School Admin portal
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
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeClosed /> : <Eye />}
                  </button>
                </div>
                <Button type="submit" className="w-full" size="lg">
                  {isSubmitting ? 'Submitting' : 'Submit'}
                </Button>
              <div className="text-center mr-auto mt-10">Forgot Password ? <Link className="text-[#1BC2C2]" href="/admin/resetpassword">Click here</Link></div>
              </form>
            </div>
          </div>
        </div>
      </div>
  )
}