"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import CheckoutButton from "@/components/public/pages/planPick/checkoutButton"
import { X } from 'lucide-react'

const ChosenPlanDetails: React.FC<{ plan: any, onDeselect: () => void }> = ({ plan, onDeselect }) => {
  const userDetails = JSON.parse(localStorage.getItem("signupData") || "{}")
  const [months, setMonths] = useState(1)
  const [coupon, setCoupon] = useState("")
  const router = useRouter()

  const handleCheckout = () => {
    // Handle checkout logic
    console.log("Checkout with plan:", plan)
    console.log("User details:", userDetails)
    router.push("/dashboard/student")
  }

  const calculatePrice = () => {
    let price = parseFloat(plan.price.replace("$", "")) * months
    if (coupon === "SAVE10") {
      price *= 0.9
    }
    return price.toFixed(2)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
      >
        <button onClick={onDeselect} className="absolute top-10 right-10">
          <X size={40} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Chosen Plan Details</h2>
        <p className="text-xl font-semibold mb-2">{plan.title}</p>
        <p className="text-lg mb-2">{plan.price} {plan.duration}</p>
        <ul className="list-disc pl-5 mb-4">
          {plan.features.map((feature: string, index: number) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <h3 className="text-xl font-bold mb-2">User Details</h3>
        <p className="mb-2"><strong>Name:</strong> {userDetails.firstName} {userDetails.lastName}</p>
        <p className="mb-2"><strong>Email:</strong> {userDetails.email}</p>
        <p className="mb-2"><strong>Phone:</strong> {userDetails.phone}</p>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-lg flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Months</label>
          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(parseInt(e.target.value))}
            className="w-20 px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1BC2C2] focus:border-transparent"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="w-40 px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1BC2C2] focus:border-transparent"
          />
        </div>
        <div className="text-right">
          <p className="text-lg font-bold mb-2">Total Price: ${calculatePrice()}</p>
          <CheckoutButton onClick={handleCheckout} />
        </div>
      </div>
    </div>
  )
}

export default ChosenPlanDetails
