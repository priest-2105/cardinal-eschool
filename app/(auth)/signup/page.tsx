"use client"

import type React from "react"
import Link from "next/link"
import { Youtube } from "lucide-react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import XIcon from "@/public/assets/icons/x-dark.png"
import TiktokIcon from "@/public/assets/icons/tiktok-dark.png"
import WhatsappIcon from "@/public/assets/icons/whatsapp-dark.png"
import cardinalConfig from "@/config"
import { useState} from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/dashboard/student/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Alert, AlertDescription, AlertTitle } from "@/components/dashboard/admin/ui/alert";
import { Signup } from "@/lib/api/student/auth/signnup";
import Image from "next/image";

interface FormErrors {
  [key: string]: string;
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
    guardianRelationship: "",
    referralChannel: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"default" | "danger">("default");

  const router = useRouter();

  const validateForm = () => {
    const newErrors: FormErrors = {};
    const age = formData.dateOfBirth ? new Date().getFullYear() - formData.dateOfBirth.getFullYear() : 0;

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (age < 16) {
      if (!formData.guardianName) newErrors.guardianName = "Guardian's name is required";
      if (!formData.guardianEmail) newErrors.guardianEmail = "Guardian's email is required";
      if (!formData.guardianPhone) newErrors.guardianPhone = "Guardian's phone is required";
    } else {
      if (!formData.email) newErrors.email = "Email is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setAlertMessage("Please correct the highlighted fields.");
      setAlertVariant("danger");
      return;
    }

    setIsSubmitting(true);
    setAlertMessage(null);

    const age = formData.dateOfBirth ? new Date().getFullYear() - formData.dateOfBirth.getFullYear() : 0;

    const payload = {
      firstname: formData.firstName,
      lastname: formData.lastName,
      email: age >= 16 ? formData.email : formData.guardianEmail, 
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      gender: formData.gender,
      dob: formData.dateOfBirth?.toISOString().split("T")[0],
      channel: formData.referralChannel,
      guardian_name: age < 16 ? formData.guardianName : null,
      guardian_email: age < 16 ? formData.guardianEmail : null,
      guardian_phone: age < 16 ? formData.guardianPhone : null,
    };

    try {
      const response = await Signup(payload);
      setAlertMessage(response.message || "Signup successful!");
      setAlertVariant("default");
      router.push("/login");
    } catch (error) {
      console.error("Signup error:", error);
      setAlertMessage("Signup failed. Please try again.");
      setAlertVariant("danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
        {alertMessage && (
        <Alert variant={alertVariant} className="fixed right-4 top-8 z-99" onClose={() => setAlertMessage(null)}>
          <AlertTitle>{alertVariant === "default" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
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
        <div className="w-full lg:w-1/2 px-4 sm:px-6 lg:px-1 py-12">
          <div className="text-right mb-8">
            <span className="text-sm text-gray-600 mr-4 z-10 top-10 right-10 h-max">
              Already a Cardinal?{" "}
              <Link href={cardinalConfig.routes.login} className="text-[#1BC2C2] hover:underline font-semibold">
                Sign in!
              </Link>
            </span>
          </div>
          <div className="max-w-xl flex mx-auto items-center pt-10 align-middle self-center">
            <div></div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Sign up</h2>
              <p className="text-gray-600 font-semibold mb-8">Take the next steps to apply to Cardinal E-School</p>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>
              <div>
                <DatePicker
                  selected={formData.dateOfBirth}
                  onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
                  placeholder="Select Date of Birth"
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>
              {/* Guardian or email fields based on age */}
              {formData.dateOfBirth && new Date().getFullYear() - formData.dateOfBirth.getFullYear() < 16 ? (
                <>
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
                      inputClass={errors.guardianPhone ? "border-red-500" : ""}
                    />
                    {errors.guardianPhone && <p className="text-red-500 text-sm mt-1">{errors.guardianPhone}</p>}
                  </div>
                </>
              ) : (
                <div>
                  <Input
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              )}
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}