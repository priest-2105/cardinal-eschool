"use client"

import type React from "react"
import { useState } from "react"
import { useAppDispatch } from '@/lib/hooks'
import { setAuthState } from '@/lib/authSlice'
import { login } from '@/lib/api/tutor/api'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeIcon as EyeClosed } from "lucide-react" 
import { useRouter } from "next/navigation"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function LoginPageComponent() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setAlert({ type: "error", message: "Both email and password are required." });
      return;
    }

    setIsSubmitting(true);
    setAlert(null);
    try {
      const response = await login(formData.email, formData.password);
      dispatch(setAuthState({
        token: response.data.token,
        user: response.data.user,
      }));
      console.log('Login successful');
      setAlert({ type: 'success', message: 'Login successful' });
      router.push('/tutor');
    } catch (error: unknown) {
      console.error('Login failed', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
      <div className="flex min-h-screen items-center">
        <div className="w-full lg:w-1/2 px-4 mx-auto sm:px-6 lg:px-8 py-12">
          <div className="max-w-lg flex mx-auto items-center align-middle self-center">
            <div></div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Tutor Log In</h2>
              <p className="text-gray-600 font-semibold mb-8">
                Enter your email address and password to securely log in to Cardinal E-School Tutor portal
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
              <div className="text-center mr-auto mt-10">Forgot Password ? <Link className="text-[#1BC2C2]" href="/tutor/resetpassword">Click here</Link></div>
              </form>
            </div>
          </div>
        </div>
      </div>
  )
}