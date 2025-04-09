"use client";

import PlanPickComponent from "@/components/auth/planpick";
import { useEffect } from "react";
import { checkSubscriptionStatus } from "@/lib/api/student/payment/subscriptionstatus";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from 'next/navigation';

export default function PlanPick() {
  const authState = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (authState?.token) {
        try {
          const subscriptionStatus = await checkSubscriptionStatus(authState.token);
          if (subscriptionStatus.status === "success") {
            router.push("/student");
          }
        } catch (error) {
          console.error("Error checking subscription status:", error);
        }
      }
    };

    checkAndRedirect();
  }, [authState?.token, router]);

  return (
    <div>
      <PlanPickComponent />
    </div>
  );
}

