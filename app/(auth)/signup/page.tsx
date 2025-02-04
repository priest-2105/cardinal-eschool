"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
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

interface FormErrors {
  [key: string]: string
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: null as Date | null,
    email: "",
    phone: "",
    guardianName: "",
    guardianEmail: "",
    guardianPhone: "", 
    referralChannel: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [errors, setErrors] = useState<FormErrors>({})

  const router = useRouter()

  useEffect(() => {
    const savedData = sessionStorage.getItem("signupData")
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      if (parsedData.dateOfBirth) {
        parsedData.dateOfBirth = new Date(parsedData.dateOfBirth)
      }
      setFormData(parsedData)
    }
  }, [])

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"

    const isUnder18 = formData.dateOfBirth && new Date().getFullYear() - formData.dateOfBirth.getFullYear() < 18

    if (isUnder18) {
      if (!formData.guardianName.trim()) newErrors.guardianName = "Guardian's name is required"
      if (!formData.guardianEmail.trim()) newErrors.guardianEmail = "Guardian's email is required"
      if (!formData.guardianPhone) newErrors.guardianPhone = "Guardian's phone is required"
      if (formData.guardianPhone && formData.guardianPhone.length < 10)
        newErrors.guardianPhone = "Guardian's phone number should be at least 10 digits" 
    } else {
      if (!formData.email.trim()) newErrors.email = "Email is required"
      if (!formData.phone) newErrors.phone = "Phone number is required"
      if (formData.phone && formData.phone.length < 10) newErrors.phone = "Phone number should be at least 10 digits"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
    if (formData.guardianEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guardianEmail))
      newErrors.guardianEmail = "Invalid guardian email format"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"

    if (passwordStrength < 3) newErrors.password = "Password is too weak. Please use a stronger password."

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
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

    setPasswordStrength(strength)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      sessionStorage.setItem("signupData", JSON.stringify(formData))
      router.push("/assessment")
    } else {
      setPopupMessage("Please correct the highlighted fields.")
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
                  alt="whatsapp icon"
                  width={24}
                  height={24}
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
                  width={24}
                  height={24}
                />{" "}
              </a>
              <a
                className="flex items-center space-x-2 hover:opacity-75 mx-2"
                target="_blank"
                href={`${cardinalConfig.socialInfo.youtube}`}
                rel="noreferrer"
              >
                {" "}
                <Youtube size={24} />{" "}
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
                  alt="X-icon"
                  width={24}
                  height={24}
                />{" "}
              </a>
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
                  <div>
                    <Input
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Input
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                  </div>
                  <div>
                    <DatePicker
                      selected={formData.dateOfBirth}
                      onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
                      placeholder="Select Date of Birth (MM/DD/YYYY)"
                      error={!!errors.dateOfBirth}
                      className="sm:w-[15.5rem] w-full outline-none"
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                  </div>
                </div>

                <AnimatePresence>
                  {formData.dateOfBirth && new Date().getFullYear() - formData.dateOfBirth.getFullYear() < 18 && (
                    <motion.div
                      key="guardianInfo"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="space-y-4">
                        <div>
                          <Input
                            placeholder="Guardian's Name"
                            value={formData.guardianName}
                            onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                            className={errors.guardianName ? "border-red-500" : ""}
                          />
                          {errors.guardianName && <p className="text-red-500 text-sm mt-1">{errors.guardianName}</p>}
                        </div>
                        <div>
                          <Input
                            type="email"
                            placeholder="Guardian's Email"
                            value={formData.guardianEmail}
                            onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                            className={errors.guardianEmail ? "border-red-500" : ""}
                          />
                          {errors.guardianEmail && <p className="text-red-500 text-sm mt-1">{errors.guardianEmail}</p>}
                        </div>
                        <div>
                          <PhoneInput
                            country={"us"}
                            value={formData.guardianPhone}
                            onChange={(phone) => setFormData({ ...formData, guardianPhone: phone })}
                            containerClass={errors.guardianPhone ? "border-red-500" : ""}
                          />
                          {errors.guardianPhone && <p className="text-red-500 text-sm mt-1">{errors.guardianPhone}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {formData.dateOfBirth && new Date().getFullYear() - formData.dateOfBirth.getFullYear() >= 18 && (
                    <motion.div
                      key="studentInfo"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="space-y-4">
                        <div>
                          <Input
                            type="email"
                            placeholder="Student's Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={errors.email ? "border-red-500" : ""}
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                          <PhoneInput
                            country={"us"}
                            value={formData.phone}
                            onChange={(phone) => setFormData({ ...formData, phone: phone })}
                            containerClass={errors.phone ? "border-red-500" : ""}
                          />
                          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Select
                  value={formData.referralChannel}
                  onValueChange={(value) => setFormData({ ...formData, referralChannel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How did you hear about us?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="friend">Friend/Family</SelectItem>
                    <SelectItem value="search">Search Engine</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div className="mt-2 flex space-x-1">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div
                      key={index}
                      className={`h-2 rounded w-8 ${
                        index <= passwordStrength
                          ? passwordStrength <= 1
                            ? "bg-red-500"
                            : passwordStrength <= 2
                              ? "bg-yellow-500"
                              : passwordStrength <= 3
                                ? "bg-blue-500"
                                : passwordStrength <= 4
                                  ? "bg-green-500"
                                  : "bg-teal-500"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Enter password again"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
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

                <div className="flex justify-between">
                  <Button className="w-full" type="submit" size="lg">
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

