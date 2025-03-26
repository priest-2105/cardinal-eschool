"use client";

import { useState, useEffect } from "react";
import PlanList from "@/components/public/pages/planPick/planList";
import ChosenPlanDetails from "@/components/public/pages/planPick/planDetails";
import { fetchStudentsAssessment } from "@/lib/api/student/profile/fetchStudentAssessment";
import { getPlans } from "@/lib/api/student/profile/fetchsingleplan";
import { useAppSelector } from "@/lib/hooks";

interface Plan {
  title: string;
  price: string;
  duration: string;
  features: string[];
  sub_id?: string; // Include the subscription ID
}

export default function PlanPick() {
  const [chosenPlan, setChosenPlan] = useState<Plan | null>(null);
  const [userProfile, setUserProfile] = useState<{ firstname: string; lastname: string; email: string } | null>(null);
  const authState = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchAssessmentAndPlan = async () => {
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
              sub_id: planData.sub_id,
            });
          }
        } catch (error) {
          console.error("Failed to fetch assessment or plan:", error);
        }
      }
    };

    fetchAssessmentAndPlan();
  }, [authState?.token, authState?.user]);

  const handlePlanSelect = (plan: Plan) => {
    setChosenPlan(plan);
  };

  const handleDeselectPlan = () => {
    setChosenPlan(null);
  };

  return (
    <div>
      {!chosenPlan ? (
        <PlanList onPlanSelect={handlePlanSelect} />
      ) : (
        <ChosenPlanDetails plan={chosenPlan} userProfile={userProfile} onDeselect={handleDeselectPlan} />
      )}
    </div>
  );
}

