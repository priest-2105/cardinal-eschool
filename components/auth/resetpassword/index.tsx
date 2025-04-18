"use client"

import type React from "react"
import { useState } from "react"
import { resetPasswordEmail } from '@/lib/api/student/api'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import Image from "next/image"
import { Youtube } from "lucide-react"
import XIcon from "@/public/assets/icons/x-dark.png"
import TiktokIcon from "@/public/assets/icons/tiktok-dark.png"
import WhatsappIcon from "@/public/assets/icons/whatsapp-dark.png"
import cardinalConfig from "@/config"

type ErrorResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

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
      // const response = await resetPasswordEmail(formData.email)
      // console.log('Response:', response)  
      // console.log('Reset password email sent')
      setAlert({ type: 'success', message: 'Password reset email sent. Link expires in 30 minutes.' })
      router.push('/login')
    } catch (error) {
      console.error('Reset password email failed', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as ErrorResponse).response?.data?.message || 'Unknown error occurred';
      setAlert({ type: 'error', message: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <div className="flex min-h-screen items-center">
          <div className="max-w-full flex mx-auto items-center w-full">
            <div className="hidden min-h-screen lg:flex w-1/2 bg-[#E9FFFF] flex-col items-center justify-center p-8">
              <div className="w-full text-center">
                  <Image
                onDragStart={(event) => event.preventDefault()}
                src="/assets/img/pages/login/6955b465-50b7-4e9f-bdf9-d1e67efa258f-removebg-preview 1.png"
                alt="Learning Illustration"
                width={500}
                className="text-center mx-auto"
                height={400}
                priority
              />
              <h1 className="text-3xl font-bold text-center mt-8 mb-4">
                Learn From Highly Skilled Experts & Experienced Tutors
              </h1>
              <div className="flex justify-center items-center mx-auto text-dark space-x-2 py-2">
                <a
                  className="flex items-center space-x-2 hover:opacity-75 mx-2"
                  target="_blank"
                  href={`${cardinalConfig.socialInfo.whatsapp}`}
                  rel="noreferrer"
                >
                  <Image
                    onDragStart={(event) => event.preventDefault()}
                    src={WhatsappIcon || "/placeholder.svg"}
                    alt="whatsapp cion"
                  />{" "}
                </a>
                <a
                  className="flex items-center space-x-2 hover:opacity-75 mx-2"
                  target="_blank"
                  href={`${cardinalConfig.socialInfo.tikTok}`}
                  rel="noreferrer"
                >
                  <Image
                    onDragStart={(event) => event.preventDefault()}
                    src={TiktokIcon || "/placeholder.svg"}
                    alt="tiktok Icon"
                  />{" "}
                </a>
                <a
                  className="flex items-center space-x-2 hover:opacity-75 mx-2"
                  target="_blank"
                  href={`${cardinalConfig.socialInfo.youtube}`}
                  rel="noreferrer"
                >
                  {" "}
                  <Youtube />{" "}
                </a>
                <a
                  className="flex items-center space-x-2 hover:opacity-75 mx-2"
                  target="_blank"
                  href={`${cardinalConfig.socialInfo.X}`}
                  rel="noreferrer"
                >
                  <Image
                    onDragStart={(event) => event.preventDefault()}
                    src={XIcon || "/placeholder.svg"}
                    alt="X-cion"
                  />{" "}
                </a>
              </div>
            </div>
          </div>
            
            <div className="justify-center items-center self-center w-9/12 lg:w-1/2 px-4 mx-auto sm:px-6 lg:px-8 py-12">
              <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
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
              
              <div className="text-center mr-auto mt-10">Back to login ? <Link className="text-[#1BC2C2]" href="/login">Click here</Link></div>
            </div>
        </div>
      </div>
  )
}