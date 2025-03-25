"use client";

import { useState } from "react";
import { makePayment } from "@/lib/api/student/payment/makepayment";
import { useAppSelector } from "@/lib/hooks";

interface CheckoutButtonProps {
  subscriptionPlanId: string;
  quantity: number;
  couponCode?: string;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ subscriptionPlanId, quantity, couponCode }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const authState = useAppSelector((state) => state.auth);

  const handleCheckout = async () => {
    if (!authState.token) {
      console.error("User is not authenticated.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await makePayment(authState.token, {
        subscription_plan_id: subscriptionPlanId,
        quantity,
        coupon_code: couponCode || "",
      });

      console.log("Payment initiated successfully:", response);
      // Handle success (e.g., redirect to payment gateway or show success message)
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      // Handle error (e.g., show error message)
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-[#1BC2C2] text-white py-2 px-4 rounded-lg hover:bg-[#17a2a2] transition"
      disabled={isProcessing}
    >
      {isProcessing ? "Processing..." : "Checkout"}
    </button>
  );
};

export default CheckoutButton;
