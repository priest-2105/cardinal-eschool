"use client";

import { useState, useEffect } from "react";
import PlanList from "@/components/public/pages/planPick/planList";
import ChosenPlanDetails from "@/components/public/pages/planPick/planDetails";
import { fetchStudentsAssessment } from "@/lib/api/student/profile/fetchStudentAssessment";
import { getPlans } from "@/lib/api/student/profile/fetchsingleplan";
import { useAppSelector } from "@/lib/hooks";
import { updateAssessment } from "@/lib/api/student/profile/updateAssessment";
import { X } from "lucide-react";


interface Plan {
  id: number;
  title: string;
  price: string;
  duration: string;
  features: string[];
}

export default function PlanPickComponent() {
  const [chosenPlan, setChosenPlan] = useState<Plan | null>(null);
  const [userProfile, setUserProfile] = useState<{ firstname: string; lastname: string; email: string } | null>(null);
  const authState = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

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
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setAlert({ type: "error", message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeselectPlan = () => {
    setChosenPlan(null);
  };

  return (
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
  );
}

