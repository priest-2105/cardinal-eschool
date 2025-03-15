"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Youtube, Eye, EyeIcon as EyeClosed } from "lucide-react"
import XIcon from "@/public/assets/icons/x-dark.png"
import TiktokIcon from "@/public/assets/icons/tiktok-dark.png"
import WhatsappIcon from "@/public/assets/icons/whatsapp-dark.png"

import cardinalConfig from "@/config"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    // Handle form submission
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen items-center">
        <div className="w-full lg:w-1/2 px-4 mx-auto sm:px-6 lg:px-8 py-12">
          <div className="max-w-lg flex mx-auto items-center align-middle self-center">
            <div></div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Admin Log In</h2>
              <p className="text-gray-600 font-semibold mb-8">
                Enter your email address and password to securely log in to Cardinal E-School Admin portal
              </p>
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
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

