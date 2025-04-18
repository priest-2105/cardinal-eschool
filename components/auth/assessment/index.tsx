"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { fetchStudentsAssessment } from "@/lib/api/student/profile/fetchStudentAssessment"
import { updateAssessment } from "@/lib/api/student/profile/updateAssessment"
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/student/ui/alert"
import AssessmentForm, { type FormData } from "@/components/public/pages/assessment/asessmentForm/index"
import Image from "next/image"

export default function AssessmentPageComponent() {
  const router = useRouter()
  const token: string | null | undefined = useSelector((state: RootState) => state.auth?.token)
  const [isLoading, setIsLoading] = useState(true); 

  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [alertVariant, setAlertVariant] = useState<"default" | "danger">("default")
  const [initialData, setInitialData] = useState<FormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    // console.log("FormData received from AssessmentForm:", formData);
    
    if (!token) {
      setAlertMessage("No authentication token found");
      setAlertVariant("danger");
      setIsSubmitting(false);
      return;
    }

    try {
      // Log the plan_id to verify it's being passed correctly
      // console.log("Plan ID being submitted:", formData.plan_id);
      
      const payload = {
        subscription_plan_id: formData.plan_id,
        edu_level: formData.education_level,
        subjects_interested_in: formData.subjects_interested_in || [],
        tests_interested_in: formData.tests_interested_in || [],
        learning_expectations: formData.learning_expectations,
        learning_difficulties: formData.learning_difficulties,
        learning_difficulty_description: formData.learning_difficulty_description,
        specific_goals: formData.specific_goals,
      };

      // console.log("Sending payload:", payload);
      const response = await updateAssessment(token, payload);
      // console.log("Update successful:", response);

      setAlertMessage("Assessment updated successfully!");
      setAlertVariant("default");
      
      // Fix routing path
      setTimeout(() => {
        router.push("/planpick");
      }, 1000);
    } catch (error: unknown) { // replaced explicit any with unknown
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      // Set alert or handle error accordingly
      setAlertMessage(errorMessage);
      setAlertVariant("danger");
    } finally {
      setIsSubmitting(false)
    }
  };

  useEffect(() => {
    const loadAssessment = async () => {
      if (!token) {
    
        router.push('/login');
        return;
      }

      try {
        const response = await fetchStudentsAssessment(token);
        setInitialData(response.data.Assessment);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Failed to fetch assessment:", errorMessage);
        setAlertMessage("Failed to load assessment. Please try again.");
        setAlertVariant("danger");
        if (errorMessage === 'Unauthorized') {
          
          router.push('/login');
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessment();
  }, [token, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {alertMessage && (
        <Alert
          variant={alertVariant}
          className="fixed top-4 right-4 z-50 bg-white"
          onClose={() => setAlertMessage(null)}
        >
          <AlertTitle>{alertVariant === "default" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
      <div className="flex min-h-screen">
        {/* Left Column - Hidden on mobile and tablet */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#E9FFFF] flex-col items-center justify-center p-8 fixed h-full">
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
          </div>
        </div>

        <div className="w-full lg:w-1/2 lg:ml-auto flex flex-col justify-center min-h-screen px-4 sm:px-6 lg:px-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto w-full">
            <h2 className="text-3xl font-bold mb-2">Assessment Form</h2>
            <p className="text-gray-600 mb-8">Help us understand your learning needs better</p>
            <AssessmentForm onSubmit={handleSubmit} initialData={initialData} isSubmitting={isSubmitting} />
          </div>
        </div>
      </div>
    </>
  )
}

