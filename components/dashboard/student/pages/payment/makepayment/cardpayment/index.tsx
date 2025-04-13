"use client"

import { useState, useEffect } from "react"
import { useAppSelector } from "@/lib/hooks"
import { CheckCircle2 } from "lucide-react"
import PlanList from "@/components/dashboard/student/pages/payment/planPick/planList/index";
import ChosenPlanDetails from "@/components/dashboard/student/pages/payment/planPick/planDetails/index";
import { fetchStudentsAssessment } from "@/lib/api/student/profile/fetchStudentAssessment";
import { getPlans } from "@/lib/api/student/profile/fetchsingleplan";
import { updateAssessment } from "@/lib/api/student/profile/updateAssessment";
import { X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CardPaymentSkeleton from "@/components/dashboard/student/pages/payment/skeleton/cardpaymentskeleton";



interface Plan {
  sub_id: string
  id: number;
  title: string;
  price: string;
  duration: string;
  features: string[];
}

const StudentCardPayment = () => {
  const subscription = useAppSelector((state) => state?.auth?.subscription)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [chosenPlan, setChosenPlan] = useState<Plan | null>(null);
  const [userProfile, setUserProfile] = useState<{ firstname: string; lastname: string; email: string } | null>(null);
  const authState = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAssessmentAndPlan = async () => {
      setIsLoading(true);
      if (authState?.token) {
        try {
          const assessmentResponse = await fetchStudentsAssessment(authState?.token);
          const assessment = assessmentResponse.data.Assessment;

          setUserProfile({
            firstname: authState?.user?.name.split(" ")[0] || "",
            lastname: authState?.user?.name.split(" ")[1] || "",
            email: authState?.user?.email || "",
          });

          if (assessment.plan_id) {
            const planResponse = await getPlans(authState?.token, assessment.plan_id);
            const planData = planResponse.data.subscription_plan;

            setChosenPlan({
              sub_id: planData.sub_id || "", // Ensure sub_id is included
              title: planData.name,
              price: `$${planData.price}`,
              duration: "/ Month",
              features: ["Details of the plan will be displayed here."],
              id: planData.id,
            });
          }
        } catch (error) {
          console.error("Failed to fetch assessment or plan:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAssessmentAndPlan();
  }, [authState?.token, authState?.user]);

  const handlePlanSelect = async (plan: Plan) => {
    setIsLoading(true);
    try {
      if (authState?.token) {
        // Fetch existing assessment data first
        const assessmentResponse = await fetchStudentsAssessment(authState.token);
        const assessmentData = assessmentResponse.data.Assessment;

        // Log the assessment data to inspect its structure
        console.log("Existing assessment data:", assessmentData);

        // Update the assessment data with the new plan ID and preserve other fields
        const updatedAssessment = {
          subscription_plan_id: plan.id,
          edu_level: assessmentData.education_level,
          subjects_interested_in: assessmentData.subjects_interested_in,
          tests_interested_in: assessmentData.tests_interested_in,
          learning_expectations: assessmentData.learning_expectations,
          learning_difficulties: assessmentData.learning_difficulties,
          learning_difficulty_description: assessmentData.learning_difficulty_description,
          specific_goals: assessmentData.specific_goals,
          other_subjects: assessmentData.other_subjects,
        };

        // Log the updated assessment data before sending it
        console.log("Updated assessment data:", updatedAssessment);

        // Update assessment with new plan ID
        await updateAssessment(authState.token, updatedAssessment);
        setChosenPlan(plan);
      }
    } catch (error: unknown) {
      console.error("Failed to update assessment with new plan:", error);
      setAlert({
        type: "error",
        message: "Failed to update assessment. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeselectPlan = () => {
    setChosenPlan(null);
  };
 
 

  return (
    <div className="p-4 relative">
      {isLoading ? (
        <CardPaymentSkeleton />
      ) : (
        <>
          {alert && (
            <Alert
              variant={alert.type === "success" ? "default" : "danger"}
              className="absolute top-4 right-4 z-[9999] bg-white"
              onClose={() => setAlert(null)}
            >
              <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}
          {!subscription?.isActive ? (
            <>
              <div>
                {isLoading ? (
                  <div>Loading...</div>
                ) : !chosenPlan ? (
                  <PlanList onPlanSelect={handlePlanSelect} />
                ) : (
                  <div>
                    <button
                      onClick={handleDeselectPlan}
                      className="absolute top-4 right-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition"
                    >
                      <X size={20} />
                    </button>
                    <ChosenPlanDetails plan={chosenPlan} userProfile={userProfile} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col lg:flex-row bg-white justify-between rounded-lg p-4 sm:p-6 space-y-6 lg:space-y-0 lg:space-x-6">
              <div className="flex-1 p-4 sm:p-6 w-full lg:w-1/2 max-w-screen-sm">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Active Subscription</h2>
                <div className="bg-[#E6FFFC] p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <CheckCircle2 className="h-6 w-6 text-[#1BC2C2] mr-2" />
                    <h3 className="text-lg font-semibold">
                      {subscription.plan[0].toUpperCase()}
                      {subscription.plan.slice(1)} Plan
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Subscription Status</p>
                      <p className="font-semibold text-[#1BC2C2]">Active</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expires On</p>
                      <p className="font-semibold">
                        {new Date(subscription.expiresAt).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Payment Details */}
              <div className="space-y-4 bg-gray-100 p-4 sm:p-6 w-full lg:w-1/2 max-w-screen-sm">
                {/* YouTube Video Section */}
                <div className="relative group">
                  <img
                    src="/assets/img/dashboard/student/studentdashboardmakepayment/Rectangle1548.png"
                    alt="Payment Instruction"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-12 h-12 sm:w-16 sm:h-16 text-white"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.887 3.2a1 1 0 0 1 1.13-.09l7 4a1 1 0 0 1 0 1.78l-7 4A1 1 0 0 1 4 11.999V4a1 1 0 0 1 .887-.8z" />
                    </svg>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="bg-transparent w-full px-4 sm:px-10 flex items-center p-4">
                  <div className="bg-[#E6FFFC] -mt-16 sm:-mt-28 z-10 w-full px-4 sm:px-10 max-sm:block sm:flex items-center p-4 rounded-lg shadow-md">
                    {/* <img
                      src="/assets/img/dashboard/student/studentdashboardmakepayment/Rectangle 1550.png"
                      alt="Payment Instruction"
                      className="w-24 sm:w-32 h-auto rounded-lg shadow-md"
                    /> */}
                    <div className="px-3">
                      <h3 className="text-base sm:text-lg font-semibold">
                        {subscription.plan[0].toUpperCase()}
                        {subscription.plan.slice(1)} Plan
                      </h3>
                      <p className="text-xl sm:text-2xl font-bold text-teal-600">$60/month</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle2 color="#11C700" />
                    <h3 className="text-base sm:text-lg ms-2 font-bold">Payment & Invoice</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">
                    We&apos;ll worry about all the transactions and payment. You can sit back and relax while you get ready
                    to take your classes. Check Your E-mail for your payment receipt.
                  </p>
                </div>

                <div className="p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle2 color="#11C700" />
                    <h3 className="text-base sm:text-lg ms-2 font-bold">Updates & Benefits</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">
                    You&apos;ll be provided with updates from time to time and have access to perks and benefits in basic
                    plan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default StudentCardPayment


