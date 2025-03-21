"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { fetchStudentsAssessment } from "@/lib/api/student/profile/fetchStudentAssessment";
import { updateAssessment } from "@/lib/api/student/profile/updateAssessment";
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/student/ui/alert";
import AssessmentForm, { type FormData } from "@/components/public/pages/assessment/asessmentForm";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";


export default function AssessmentPage() {
  const router = useRouter();
  const token: string | null = useSelector((state: RootState) => state.auth?.token);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"default" | "danger">("default");
  const [initialData, setInitialData] = useState<FormData | null>(null);

  useEffect(() => {
    const loadAssessment = async () => {
      if (!token) return;

      try {
        const response = await fetchStudentsAssessment(token);
        setInitialData(response.data.Assessment);
      } catch (error) {
        console.error("Failed to fetch assessment:", error);
        setAlertMessage("Failed to load assessment. Please try again.");
        setAlertVariant("danger");
      }
    };

    loadAssessment();
  }, [token]);

  const handleSubmit = async (formData: FormData) => {
    console.log("FormData received from AssessmentForm:", formData);

    if (!token) return;

    try {
      const payload = {
        subscription_plan_id: formData.plan_id,
        edu_level: formData.education_level,
        subjects_interested_in: formData.subjects_interested_in,
        tests_interested_in: formData.tests_interested_in,
        learning_expectations: formData.learning_expectations,
        learning_difficulties: formData.learning_difficulties,
        learning_difficulty_description: formData.learning_difficulty_description,
        specific_goals: formData.specific_goals,
      };

      console.log("Payload being sent to backend:", payload);

      const response = await updateAssessment(token, payload);
      console.log("API Response:", response);

      setAlertMessage(response.message || "Assessment updated successfully!");
      setAlertVariant("default");
      router.push("/student");
    } catch (error: any) {
      console.error("Failed to update assessment:", error);

      // Handle API error response
      if (error.message) {
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.message) {
            setAlertMessage(errorData.message);
          } else {
            setAlertMessage("Failed to update assessment. Please try again.");
          }
        } catch {
          setAlertMessage("Failed to update assessment. Please try again.");
        }
      } else {
        setAlertMessage("Failed to update assessment. Please try again.");
      }

      setAlertVariant("danger");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {alertMessage && (
        <Alert variant={alertVariant} className="fixed top-4 right-4" onClose={() => setAlertMessage(null)}>
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

        {/* Right Column */}
        <div className="w-full lg:w-1/2 lg:ml-auto px-4 sm:px-6 lg:px-8 py-12 overflow-y-auto">
          <button
            onClick={() => router.push("/login")}
            className="text-[#1BC2C2] hover:underline mb-4 flex items-center"
          >
            <ArrowLeft className="mr-2" />
            Back to Login
          </button>
          <h2 className="text-3xl font-bold mb-2">Assessment Form</h2>
          <p className="text-gray-600 mb-8">Help us understand your learning needs better</p>
          <AssessmentForm onSubmit={handleSubmit} initialData={initialData} />
        </div>
      </div>
    </div>
  );
}

