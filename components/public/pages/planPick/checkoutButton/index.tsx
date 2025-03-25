"use client";

import { useState } from "react";
import { makePayment } from "@/lib/api/student/payment/makepayment";
import { useAppSelector } from "@/lib/hooks";
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/student/ui/alert";

interface CheckoutButtonProps {
  subscriptionPlanId: string;
  quantity: number;
  couponCode?: string;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ subscriptionPlanId, quantity, couponCode }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const authState = useAppSelector((state) => state.auth);

  const handleCheckout = async () => {
    if (!authState?.token) {
      setAlert({ type: "error", message: "User is not authenticated." });
      return;
    }

    setIsProcessing(true);

    try {
      const response = await makePayment(authState?.token, {
        subscription_plan_id: subscriptionPlanId,
        quantity,
        coupon_code: couponCode || "",
      });

      console.log("Payment initiated successfully:", response);
      setAlert({ type: "success", message: "Payment initiated successfully!" });
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      setAlert({ type: "error", message: "Failed to initiate payment. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative">
      {alert && (
        <div className="absolute top-4 right-4 z-[9999] bg-white">
          <Alert variant={alert.type === "success" ? "default" : "danger"} onClose={() => setAlert(null)}>
            <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}
      <button
        onClick={handleCheckout}
        className="bg-[#1BC2C2] text-white py-2 px-4 rounded-lg hover:bg-[#17a2a2] transition"
        disabled={isProcessing}
      >cfvfdgsg
        {isProcessing ? "Processing..." : "Checkout"}
      </button>
    </div>
  );
};

export default CheckoutButton;
