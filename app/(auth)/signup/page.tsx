"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Eye, EyeClosed, Youtube } from 'lucide-react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { motion, AnimatePresence } from "framer-motion"
import Popup from "@/components/ui/Popup"
import XIcon from '@/public/assets/icons/x-dark.png';
import TiktokIcon from '@/public/assets/icons/tiktok-dark.png';
import WhatsappIcon from '@/public/assets/icons/whatsapp-dark.png';
import cardinalConfig from "@/config"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    email: "",
    phone: "",
    guardianName: "",
    guardianEmail: "",
    guardianPhone: "",
    guardianRelationship: "",
    referralChannel: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStength, setpasswordStength] = useState(5);
  const [popupMessage, setPopupMessage] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0);

  const router = useRouter()

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.gender || !formData.age || !formData.password || !formData.confirmPassword) {
      setPopupMessage("Please fill in all required fields.")
      return false
    }
    if (parseInt(formData.age) < 18 && (!formData.guardianName || !formData.guardianEmail || !formData.guardianPhone || !formData.guardianRelationship)) {
      setPopupMessage("Please fill in all guardian information.")
      return false
    }
    if (parseInt(formData.age) >= 18 && (!formData.email || !formData.phone)) {
      setPopupMessage("Please fill in all student information.")
      return false
    }
    if (!formData.email.includes("@")) {
      setPopupMessage("Please enter a valid email address.")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setPopupMessage("Passwords do not match.")
      return false
    }
    return true
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({ ...formData, password: value })

    let strength = 0
    if (value.length > 5) strength++
    if (value.length > 8) strength++
    if (/[A-Z]/.test(value)) strength++
    if (/[0-9]/.test(value)) strength++
    if (/[^A-Za-z0-9]/.test(value)) strength++

    setPasswordStrength(strength);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      localStorage.setItem("signupData", JSON.stringify(formData))
      router.push("/assessmentform")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {popupMessage && <Popup message={popupMessage} onClose={() => setPopupMessage("")} />}
      <div className="flex min-h-screen">
        {/* Left Column - Hidden on mobile and tablet */}
        <div className="hidden min-h-screen lg:flex lg:w-1/2 bg-[#E9FFFF] flex-col items-center justify-center p-8">
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
            <div className='flex justify-center items-center mx-auto text-dark space-x-2 py-2'>
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
        <div className="w-full lg:w-1/2 px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-right mb-8">
            <span className="text-sm text-gray-600 absolute top-10 right-10 h-max">
              Already a Cardinal?{" "}
              <Link href={cardinalConfig.routes.login} className="text-[#1BC2C2] hover:underline font-semibold">
                Sign in!
              </Link>
            </span>
          </div>
          <div className="max-w-lg flex mx-auto items-center pt-10 align-middle self-center">
            <div></div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Sign up</h2>
              <p className="text-gray-600 font-semibold mb-8">Take the next steps to apply to Cardinal E-School</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                  <Input
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>

                <Select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>

                <Input
                  type="number"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />

                <AnimatePresence>
                  {formData.age && parseInt(formData.age) < 18 ? (
                    <motion.div
                      key="guardianInfo"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Input
                        className="mb-6"
                        placeholder="Guardian's Name"
                        value={formData.guardianName}
                        onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      />
                      <Input
                        className="mb-6"
                        type="email"
                        placeholder="Guardian's Email"
                        value={formData.guardianEmail}
                        onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                      />
                      
                      <div className="mb-6">
                      <PhoneInput      
                        country={'us'}
                        value={formData.guardianPhone}
                        onChange={(phone) => setFormData({ ...formData, guardianPhone: phone })}
                      /></div>

                      <Input
                        className="mb-6"
                        placeholder="Guardian's Relationship"
                        value={formData.guardianRelationship}
                        onChange={(e) => setFormData({ ...formData, guardianRelationship: e.target.value })}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="studentInfo"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Input
                        className="mb-6"
                        type="email"
                        placeholder="Student's Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />

                      <div className="mb-6">
                      <PhoneInput
                        country={'us'}
                        value={formData.phone}
                        onChange={(phone) => setFormData({ ...formData, phone: phone })}
                      />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Select
                  value={formData.referralChannel}
                  onChange={(e) => setFormData({ ...formData, referralChannel: e.target.value })}
                >
                  <option value="">How did you hear about us?</option>
                  <option value="social">Social Media</option>
                  <option value="friend">Friend/Family</option>
                  <option value="search">Search Engine</option>
                  <option value="other">Other</option>
                </Select>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className="absolute -inset-y-2 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeClosed /> : <Eye />}
                  </button>
                </div>
                <div className="mt-2 flex">
                  <div className="mt-2 flex space-x-1">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div
                        key={index}
                        className={`h-2 rounded w-8 ${
                          index <= passwordStrength
                            ? passwordStrength <= 1
                              ? 'bg-red-500'
                              : passwordStrength <= 2
                              ? 'bg-yellow-500'
                              : passwordStrength <= 3
                              ? 'bg-blue-500'
                              : passwordStrength <= 4
                              ? 'bg-green-500'
                              : 'bg-teal-500'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  </div>

                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Enter password again"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-1 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeClosed /> : <Eye />}
                  </button>
                </div>

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
    </div>
  )
}

