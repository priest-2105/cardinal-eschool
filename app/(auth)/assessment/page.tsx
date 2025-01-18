"use client"

import { useRouter } from "next/navigation"
import AssessmentForm from "@/components/public/pages/assessment/asessmentForm"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

interface FormData {
  gender: string;
  educationLevel: string;
  dateOfBirth: string;
  subjects: string[];
  testPrep: string[];
  expectations: string;
  hasLearningDifficulties: string;
  learningDifficultiesDetails: string;
  selectedPlan: string;
  specificGoals: string;
}

export default function AssessmentPage() {
  const router = useRouter()

  const handleSubmit = (formData: FormData) => {
    const signupData = JSON.parse(localStorage.getItem("signupData") || "{}")
    const combinedData = { ...signupData, ...formData }
    localStorage.setItem("signupData", JSON.stringify(combinedData))
    router.push("/planPick")
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Left Column - Hidden on mobile and tablet */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#E9FFFF] flex-col items-center justify-center p-8 fixed h-full">
          <div className="max-w-md">
            <Image
              onDragStart={(event) => event.preventDefault()})
              src="/assets/img/pages/login/6955b465-50b7-4e9f-bdf9-d1e67efa258f-removebg-preview 1.png"
              alt="Learning Illustration"
              width={500}
              height={400}
              priority
            />
            <h1 className="text-3xl font-bold text-center mt-8 mb-4">
              Learn From Highly Skilled Experts & Experienced Tutors
            </h1>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/2 lg:ml-auto px-4 sm:px-6 lg:px-8 py-12 overflow-y-auto">
          <div className="mx-auto">
            <button
              onClick={() => router.push('/signup')}
              className="text-[#1BC2C2]  hover:underline mb-4"
            >  <ArrowLeft/> 
            </button>
            <h2 className="text-3xl font-bold mb-2">Assessment Form</h2>
            <p className="text-gray-600 mb-8">
              Help us understand your learning needs better
            </p>
            <AssessmentForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  )
}

