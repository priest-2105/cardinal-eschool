"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { getTransactionDetails } from "@/lib/api/student/payment/transactiondetails";
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/student/ui/alert";

export default function TransactionDetails() {
  const params = useParams();
  const transactionRef = params.transactionref as string;
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authState = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!authState?.token) return;

      try {
        const response = await getTransactionDetails(authState.token, transactionRef);
        setTransactionDetails(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch transaction details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [transactionRef, authState?.token]);

  if (loading) {
    return <div className="text-center py-12">Loading transaction details...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="danger">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Transaction Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid gap-4">
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Transaction Reference:</span>
            <span>{transactionRef}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Status:</span>
            <span className={`${
              transactionDetails?.status === "success" 
                ? "text-green-600" 
                : "text-red-600"
            }`}>
              {transactionDetails?.status}
            </span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Message:</span>
            <span>{transactionDetails?.message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
