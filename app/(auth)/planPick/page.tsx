"use client"

import { useState } from "react"
import PlanList from "@/components/public/pages/planPick/planList"
import ChosenPlanDetails from "@/components/public/pages/planPick/planDetails"

interface Plan {
  title: string;
  price: string;
  duration: string;
  features: string[];
}

export default function PlanPick() {
  const [chosenPlan, setChosenPlan] = useState<Plan | null>(null)

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

