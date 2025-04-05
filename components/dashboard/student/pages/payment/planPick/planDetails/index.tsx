"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CheckoutButton from "@/components/dashboard/student/pages/payment/planPick/checkoutButton/index";
import { Check } from "lucide-react";
import { validateCoupon } from "@/lib/api/student/payment/validatecoupon";
import { useAppSelector } from "@/lib/hooks";
import { getPlans } from "@/lib/api/student/profile/fetchplans";

interface Plan {
  id: number;
  title: string;
  price: string;
  duration: string;
  features: string[];
  sub_id: string;
}

interface UserProfile {
  firstname: string;
  lastname: string;
  email: string;
}

const ChosenPlanDetails: React.FC<{ plan: Plan; userProfile: UserProfile | null }> = ({
  plan,
  userProfile,
}) => {
  const [months, setMonths] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState<number | null>(null);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const authState = useAppSelector((state) => state.auth);
  const [plans, setPlans] = useState<Plan[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await getPlans();
        if (response.data?.subscription_plans) {
          setPlans(response.data.subscription_plans);
        }
      } catch (error) {
        console.error('Failed to load plans:', error);
      }
    };
    loadPlans();
  }, []);

  const pricingPlans = [
    {
      id: 1,
      title: "Basic Plan",
      price: "$60",
      duration: "/ Month",
      features: [
        "For students needing occasional guidance",
        "Register 2 school subjects only",
        "1 session per course weekly",
        "Access to private classes and resources",
        "Monthly Progress Report",
        "In-class Activities",
        "Take-home Assessments",
        "Not available for Test Preppers",
      ],
    },
    {
      id: 2,
      title: "Standard Plan",
      price: "$90",
      duration: "/ Month",
      features: [
        "For students requiring regular support",
        "Register 2 school subjects only",
        "2 sessions per course weekly",
        "Monthly Progress Report",
        "In-class Activities",
        "Take-home Assessments",
        "Available for Test Preppers",
      ],
    },
    {
      id: 3,
      title: "Premium Plan",
      price: "$120",
      duration: "/ Month",
      features: [
        "For students needing intensive personalized attention",
        "Register 2 school subjects only",
        "3 sessions per course weekly",
        "Monthly Progress Report",
        "In-class Activities",
        "Take-home Assessments",
        "Available for Test Preppers",
        "Access to exclusive premium content and resources",
      ],
    },
   
    {
      id: 4,
      title: "Group Sessions",
      price: "$40",
      duration: "/ Session",
      features: [
        "For interactive and collaborative learning",
        "1 group session weekly",
        "Monthly Progress Report",
        "In-class Activities",
        "Regular feedback and tracking",
        "Available for Test Preppers",
      ],
    },
    {
      id: 5,
      title: "Custom Plan",
      price: "",
      duration: "Speak to Support",
      features: [
        "For those who need a scalable custom plan",
        "1 group session weekly",
        "Monthly Progress Report",
        "In-class Activities",
        "Regular feedback and tracking",
        "Access to exclusive premium content and resources",
      ],
    },
  ];

  const getPlanFeatures = () => {
    const localPlan = pricingPlans.find((p) => p.title === plan.title);
    return localPlan ? localPlan.features : [];
  };

  const features = getPlanFeatures();

  const originalPrice = Number.parseFloat(plan.price.replace("$", "")) * months;
  const displayPrice = isNaN(originalPrice) ? 0 : originalPrice;

  const applyCoupon = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await validateCoupon(authState?.token, coupon, originalPrice);
      setDiscount(parseFloat(response.data.coupon.discount_percentage));
      setFinalPrice(response.data.coupon.final_amount);
    } catch (error) {
      setError("Invalid coupon or failed to validate");
      setDiscount(null);
      setFinalPrice(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getCorrectSubId = () => {
    const selectedPlan = plans.find((p) => p.name === plan.title);
    return selectedPlan ? selectedPlan.sub_id : "";
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
          <div className="md:w-1/2 p-6 bg-gradient-to-br bg-[#1BC2C2] text-white">
            <h2 className="text-3xl font-bold mb-4">{plan.title}</h2>
            <p className="text-2xl font-semibold mb-2">
              {plan.price} <span className="text-sm">{plan.duration}</span>
            </p>
            <ul className="space-y-2">
              {features.map((feature: string, index: number) => (
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1BC2C2] outline-none focus:border-transparent"
                    placeholder="Enter coupon code"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-[#1BC2C2] text-white px-4 py-2 rounded-md hover:bg-[#139797] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? "Applying..." : "Apply"}
                  </button>
                </div>
                {discount !== null && (
                  <p className="text-green-600 mt-2">Coupon applied! {discount}% off</p>
                )}
                {error && <p className="text-red-600 mt-2">{error}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-6 flex items-center justify-between">
          <div className="text-2xl font-bold">Total: ${finalPrice !== null ? finalPrice.toFixed(2) : displayPrice.toFixed(2)}</div>
          <CheckoutButton
            subscriptionPlanId={getCorrectSubId()}
            quantity={months}
            couponCode={coupon}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ChosenPlanDetails;