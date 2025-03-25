"use client"

import { useState, useEffect } from "react"
import PlanList from "@/components/public/pages/planPick/planList"
import ChosenPlanDetails from "@/components/public/pages/planPick/planDetails"
import { fetchStudentsAssessment } from "@/lib/api/student/profile/fetchStudentAssessment"
import { useAppSelector } from "@/lib/hooks"

interface Plan {
  title: string;
  price: string;
  duration: string;
  features: string[];
}

export default function PlanPick() {
  const [chosenPlan, setChosenPlan] = useState<Plan | null>(null)
  const authState = useAppSelector((state) => state.auth) // Assuming auth state contains the token

  useEffect(() => {
    const fetchAssessment = async () => {
      if (authState.token) {
        try {
          const response = await fetchStudentsAssessment(authState.token)
          console.log("User Assessment:", response.data.Assessment)
        } catch (error) {
          console.error("Failed to fetch assessment:", error)
        }
      }
    }

    fetchAssessment()
  }, [authState.token])

  const handlePlanSelect = (plan: Plan) => {
    setChosenPlan(plan)
  }

  const handleDeselectPlan = () => {
    setChosenPlan(null)
  }

  return (
    <div>
      {!chosenPlan ? (
        <PlanList onPlanSelect={handlePlanSelect} />
      ) : (
        <>
          <ChosenPlanDetails plan={chosenPlan} onDeselect={handleDeselectPlan} />
          {/* <CheckoutButton /> */}
        </>
      )}
    </div>
  )
}

