"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/dashboard/student/ui/select"
import { Eye, EyeOff, Youtube } from "lucide-react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { motion, AnimatePresence } from "framer-motion"
import Popup from "@/components/ui/Popup"
import XIcon from "@/public/assets/icons/x-dark.png"
import TiktokIcon from "@/public/assets/icons/tiktok-dark.png"
import WhatsappIcon from "@/public/assets/icons/whatsapp-dark.png"
import cardinalConfig from "@/config"
import { DatePicker } from "@/components/ui/date-picker"

interface FormErrors {
  [key: string]: string
}

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState({ 
    email: "", 
  })
  const [popupMessage, setPopupMessage] = useState("") 
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  
  const validateForm = () => {
    const newErrors: FormErrors = {};
  
    // Simple email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) {
      setPopupMessage("Please correct the highlighted fields.");
      return false;
    }
    return true;
  };
  

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        router.push("/assessment")
      } catch (error) {
        console.error("Error during form submission:", error)
        setPopupMessage("An error occurred. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {popupMessage && <Popup message={popupMessage} onClose={() => setPopupMessage("")} />}
      <div className="w-full max-w-lg px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-2 text-center">Forgot Password</h2>
        <p className="text-gray-600 font-semibold mb-8 text-center">
          Take the next steps to apply to Cardinal E-School
        </p>
  
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
  
          <div className="flex justify-between">
            <Button
              className="w-full"
              type="submit"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 