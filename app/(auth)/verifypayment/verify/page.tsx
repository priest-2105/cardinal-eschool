"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { verifyPayment } from "@/lib/api/student/payment/verifypayment";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";

const VerifyPaymentPage = () => {
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const searchParams = useSearchParams();
  const router = useRouter();
  const authState = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    const txRef = searchParams.get("tx_ref");
    const transactionId = searchParams.get("transaction_id");
    router.prefetch("/student");

    // Guard clause ensuring all required values are present
    if (!authState?.token || !txRef || !transactionId) {
      console.error("Missing token or transaction references");
      setStatus("failed");
      return;
    }

    // Declare local constants to satisfy TypeScript's type checks
    const token = authState.token;
    const validTxRef = txRef;
    const validTransactionId = transactionId;

    const verify = async () => {
      try {
        const response = await verifyPayment(token, validTxRef, validTransactionId);
        if (response.status === "success") {
          setStatus("success");
          // Redirect immediately after setting status to success
        } else {
          setStatus("failed");
        }
      } catch { // removed unused variable _error
        setStatus("failed");
      } finally {
        // Redirect after a delay, regardless of success or failure
        setTimeout(() => {
          router.push("/student");
        }, 3000);
      }
    };

    verify();
  }, [searchParams, authState?.token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center"
      >
        {status === "loading" ? (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-[#1BC2C2]" size={40} />
            <p className="mt-4">Verifying Payment...</p>
          </div>
        ) : status === "success" ? (
          <div className="flex flex-col items-center text-green-600">
            <Check size={40} />
            <p className="mt-4 text-lg font-bold">Congratulations! Your payment was successful.</p>
            <p>Redirecting to dashboard...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-red-600">
            <p className="mt-4 text-lg font-bold">Payment verification failed.</p>
            <p>Please try again or contact support.</p>
            <Link href="login" prefetch={true}>Back to Login</Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyPaymentPage;
