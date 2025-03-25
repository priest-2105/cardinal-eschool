"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CheckoutButton from "@/components/public/pages/planPick/checkoutButton";
import { X, Check } from "lucide-react";

interface Plan {
  title: string;
  price: string;
  duration: string;
  features: string[];
}

interface UserProfile {
  firstname: string;
  lastname: string;
  email: string;
}

const ChosenPlanDetails: React.FC<{ plan: Plan; userProfile: UserProfile | null; onDeselect: () => void }> = ({
  plan,
  userProfile,
  onDeselect,
}) => {
  const [months, setMonths] = useState(1);
  const [coupon, setCoupon] = useState("");
  const router = useRouter();

  const handleCheckout = () => {
    console.log("Checkout with plan:", plan);
    console.log("User profile:", userProfile);
    router.push("/student");
  };

  const calculatePrice = () => {
    let price = Number.parseFloat(plan.price.replace("$", "")) * months;
    if (coupon === "SAVE10") {
      price *= 0.9;
    }
    return price.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row ">
          <div className="md:w-1/2 p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <button onClick={onDeselect} className="absolute top-1 right-1 text-white hover:text-gray-200">
              <X size={34} color="#000" />
            </button>
            <h2 className="text-3xl font-bold mb-4">{plan.title}</h2>
            <p className="text-2xl font-semibold mb-2">
              {plan.price} <span className="text-sm">{plan.duration}</span>
            </p>
            <ul className="space-y-2">
              {plan.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-center">
                  <Check size={16} className="mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2 p-6">
            <h3 className="text-xl font-bold mb-4">User Details</h3>
            {userProfile ? (
              <div className="space-y-2 mb-6">
                <p>
                  <strong>Name:</strong> {userProfile.firstname} {userProfile.lastname}
                </p>
                <p>
                  <strong>Email:</strong> {userProfile.email}
                </p>
              </div>
            ) : (
              <p>Loading user details...</p>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Months</label>
                <input
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(Number.parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1BC2C2] outline-none focus:border-transparent"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1BC2C2] outline-none focus:border-transparent"
                  placeholder="Enter coupon code"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-6 flex items-center justify-between">
          <div className="text-2xl font-bold">Total: ${calculatePrice()}</div>
          <CheckoutButton onClick={handleCheckout} />
        </div>
      </motion.div>
    </div>
  );
};

export default ChosenPlanDetails;

