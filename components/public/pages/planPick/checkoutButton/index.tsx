"use client";

import { useState } from "react";
import { makePayment } from "@/lib/api/student/payment/makepayment";
import { useAppSelector } from "@/lib/hooks";
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/student/ui/alert";
import { useRouter } from "next/navigation";

interface CheckoutButtonProps {
  subscriptionPlanId: string;
  quantity: number;
  couponCode?: string;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ subscriptionPlanId, quantity, couponCode }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const authState = useAppSelector((state) => state.auth);
  const router = useRouter()

  const handleCheckout = async () => {
    if (!authState?.token) {
      router.push("/login")    
      return;
    }

    if (!subscriptionPlanId || subscriptionPlanId === "" || quantity <= 0) {
      setAlert({ type: "error", message: "Invalid subscription plan or quantity." });
      return;
    }

    setIsProcessing(true);

    try {
      const response = await makePayment(authState?.token, {
        subscription_plan_id: subscriptionPlanId,
        quantity,
        coupon_code: couponCode || "",
      });

      if (response.data?.payment_link) {
        // Redirect to the Flutterwave checkout page
        window.location.href = response.data.payment_link;
      } else {
        setAlert({ type: "error", message: "Payment link not received" });
      }
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      setAlert({ type: "error", message: "Failed to initiate payment. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="">
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
      >
        {isProcessing ? "Processing..." : "Checkout"}
      </button>
    </div>
  );
};

export default CheckoutButton;