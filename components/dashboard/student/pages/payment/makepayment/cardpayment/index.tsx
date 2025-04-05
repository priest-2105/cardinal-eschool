"use client"

import { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { validateCoupon } from "@/lib/api/student/payment/validatecoupon";
import { makePayment } from "@/lib/api/student/payment/makepayment";
import { getPlans } from "@/lib/api/student/profile/fetchplans";
import { updateAssessment } from "@/lib/api/student/profile/updateAssessment";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Plan {
  sub_id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
  id: number;
}

const StudentCardPayment = () => {
  const subscription = useAppSelector((state) => state.auth.subscription);
  const authState = useAppSelector((state) => state.auth);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [months, setMonths] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState<number | null>(null);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
      sub_id: "3e9f13cb782842fc3a3899e9789c5503jQ==",
      title: "Basic",
      price: "60.00",
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
      sub_id: "9d2b50afa441d037cc25d653dbc0fb80+w==",
      title: "Standard",
      price: "90.00",
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
      sub_id: "91b5e1eae74940cfe8ee5ce7a42d79aevw==",
      title: "Premium",
      price: "120.00",
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
      sub_id: "38783129f7341fca10c5d28f4a50186amg==",
      title: "Session",
      price: "40.00",
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
  ];

  const getPlanFeatures = (planName: string) => {
    const localPlan = pricingPlans.find((p) => p.title === planName);
    return localPlan ? localPlan.features : [];
  };

  const getPlanSubId = (planName: string) => {
    const localPlan = pricingPlans.find((p) => p.title === planName);
    return localPlan ? localPlan.sub_id : "";
  };

  const features = selectedPlan ? getPlanFeatures(selectedPlan.name) : [];

  const originalPrice = selectedPlan ? Number.parseFloat(selectedPlan.price.replace("$", "")) * months : 0;
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

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      if (!authState?.token) {
        router.push("/login");
        return;
      }

      if (!selectedPlan) {
        setError("Please select a plan before proceeding.");
        return;
      }

      const response = await makePayment(authState.token, {
        subscription_plan_id: getPlanSubId(selectedPlan.name),
        quantity: months,
        coupon_code: coupon || "",
      });

      if (response.data?.payment_link) {
        // Update assessment with new plan ID
        await updateAssessment(authState.token, { subscription_plan_id: selectedPlan.id });
        window.location.href = response.data.payment_link;
      } else {
        setError("Payment link not received.");
      }
    } catch (error: any) {
      console.error("Payment failed:", error);
      setError(error.message || "Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPlanList = () => (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl">
      {plans.map((plan) => (
        <motion.div
          key={plan.sub_id}
          className="bg-white rounded-3xl shadow-lg min-w-[250px] p-6 border-2 hover:border-white-2 hover:bg-[#1BC2C2] hover:text-white transition cursor-pointer"
          onClick={() => handlePlanSelect(plan)}
          layout
        >
          <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
          <p className="text-gray-600">${plan.price}/month</p>
        </motion.div>
      ))}
    </div>
  );

  const renderChosenPlan = () => (
    <motion.div
      className="bg-white rounded-3xl shadow-lg p-6 max-w-4xl"
      layout
    >
      <Button variant="outline" onClick={() => setSelectedPlan(null)} className="mb-4">
        Back to Plans
      </Button>
      <h2 className="text-2xl font-bold mb-4">Selected Plan: {selectedPlan?.name}</h2>
       <p className="text-gray-600">Price: ${selectedPlan?.price}/month</p>
      <ul className="list-disc pl-5 mt-2">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Months</label>
        <input
          type="number"
          value={months}
          onChange={(e) => setMonths(Number.parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1BC2C2] outline-none focus:border-transparent"
          min="1"
        />
      </div>
      <div className="mt-4">
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
            {isLoading ? "Apply" : "Apply"}
          </button>
        </div>
        {discount !== null && (
          <p className="text-green-600 mt-2">Coupon applied! {discount}% off</p>
        )}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
      <div className="mt-6">
        <p className="text-xl font-semibold">Total: ${finalPrice !== null ? finalPrice.toFixed(2) : displayPrice.toFixed(2)}</p>
        <button
          onClick={handlePayment}
          className="bg-[#1BC2C2] text-white py-2 px-4 rounded-md hover:bg-[#139797] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Processing Payment..." : "Make Payment"}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="p-4">
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {!subscription?.isActive ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Choose Your Plan</h2>
          {!selectedPlan ? renderPlanList() : renderChosenPlan()}
        </>
      ) : (
        <div className="flex flex-col lg:flex-row bg-white justify-between rounded-lg p-4 sm:p-6 space-y-6 lg:space-y-0 lg:space-x-6">
          <div className="flex-1 p-4 sm:p-6 w-full lg:w-1/2 max-w-screen-sm">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Active Subscription</h2>
            <div className="bg-[#E6FFFC] p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-[#1BC2C2] mr-2" />
                <h3 className="text-lg font-semibold">{subscription.plan[0].toUpperCase()}{subscription.plan.slice(1)} Plan</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Subscription Status</p>
                  <p className="font-semibold text-[#1BC2C2]">Active</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expires On</p>
                  <p className="font-semibold">
                    {new Date(subscription.expiresAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
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
                <img
                  src="/assets/img/dashboard/student/studentdashboardmakepayment/Rectangle 1550.png"
                  alt="Payment Instruction"
                  className="w-24 sm:w-32 h-auto rounded-lg shadow-md"
                />
                <div className="px-3">
                  <h3 className="text-base sm:text-lg font-semibold">{subscription.plan[0].toUpperCase()}{subscription.plan.slice(1)} Plan</h3>
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
                We&apos;ll worry about all the transactions and payment. You can sit back and relax while you get ready to take
                your classes. Check Your E-mail for your payment receipt.
              </p>
            </div>

            <div className="p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle2 color="#11C700" />
                <h3 className="text-base sm:text-lg ms-2 font-bold">Updates & Benefits</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                You&apos;ll be provided with updates from time to time and have access to perks and benefits in basic plan.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCardPayment;

