"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button" 
import { Youtube } from 'lucide-react'; 
import XIcon from '@/public/assets/icons/x-dark.png';
import TiktokIcon from '@/public/assets/icons/tiktok-dark.png';
import WhatsappIcon from '@/public/assets/icons/whatsapp-dark.png';

import cardinalConfig from "@/config"

export default function LoginPage() {
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "", 
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    // Handle form submission
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen items-center">
        {/* Left Column - Hidden on mobile and tablet */}
        <div className="hidden  min-h-screen lg:flex lg:w-1/2 bg-[#E9FFFF] flex-col items-center justify-center p-8">
          <div className="max-w-md">
            <Image
              onDragStart={(event) => event.preventDefault()}
              src="/assets/img/pages/login/6955b465-50b7-4e9f-bdf9-d1e67efa258f-removebg-preview 1.png"
              alt="Learning Illustration"
              width={500}
              height={400}
              priority
            />
            <h1 className="text-3xl font-bold text-center mt-8 mb-4">
              Learn From Highly Skilled Experts & Experienced Tutors
            </h1>
            <div className='flex items-center mx-auto text-dark space-x-2 py-2'>
                <a className='flex items-center space-x-2 hover:opacity-75 mx-2' target='_blank' href={`${cardinalConfig.socialInfo.whatsapp}`}>  
                  <Image onDragStart={(event) => event.preventDefault()} src={WhatsappIcon} alt="whatsapp cion" /> </a> 
                <a className='flex items-center space-x-2 hover:opacity-75 mx-2' target='_blank' href={`${cardinalConfig.socialInfo.tikTok}`}>  
                  <Image onDragStart={(event) => event.preventDefault()} src={TiktokIcon} alt="tiktok Icon" />  </a> 
                <a className='flex items-center space-x-2 hover:opacity-75 mx-2' target='_blank' href={`${cardinalConfig.socialInfo.youtube}`}>  <Youtube/>  </a> 
                <a className='flex items-center space-x-2 hover:opacity-75 mx-2' target='_blank' href={`${cardinalConfig.socialInfo.X}`}>  
                  <Image onDragStart={(event) => event.preventDefault()} src={XIcon} alt="X-cion" /> </a> 
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full  lg:w-1/2 px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-right mb-8  items-start align-top self-start">
              <span className="text-sm text-gray-600">
                Already a Cardinal?{" "}
                <Link href={cardinalConfig.routes.signup} className="text-[#1BC2C2] hover:underline font-semibold">
                  Sign Up!
                </Link>
              </span>
            </div>
          <div className="max-w-md mx-auto items-center align-middle self-center">
            <h2 className="text-3xl font-bold mb-2">LogIn</h2>
            <p className="text-gray-600 mb-8">Continue to Cardinal E-School</p>

            <form onSubmit={handleSubmit} className="space-y-6">
            
              <Input
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
 
              <Input
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
 

              <div className="text-sm text-gray-600">
                By clicking continue, I agree to{" "}
                <Link href="/terms" className="text-[#1BC2C2] hover:underline">
                  Terms of Use
                </Link>{" "}
                and acknowledge that I have read the{" "}
                <Link href="/privacy" className="text-[#1BC2C2] hover:underline">
                  Privacy Policy
                </Link>
                .
              </div>

              <Button type="submit" fullWidth size="lg">
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

