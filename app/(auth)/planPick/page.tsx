"use client"

import { useState } from "react"
import PlanList from "@/components/public/pages/planPick/planList"
import ChosenPlanDetails from "@/components/public/pages/planPick/planDetails"

export default function PlanPick() {
  const [chosenPlan, setChosenPlan] = useState(null)

  const handlePlanSelect = (plan: any) => {
    setChosenPlan(plan)
  }

  return (
    <div>
      {!chosenPlan ? (
        <PlanList onPlanSelect={handlePlanSelect} />
      ) : (
        <ChosenPlanDetails plan={chosenPlan} />
      )}
    </div>
  )
}

