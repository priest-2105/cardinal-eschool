"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/hooks"
import { getTransactionDetails } from "@/lib/api/student/payment/transactiondetails"
import { requeryPayment } from "@/lib/api/student/payment/requerypayment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
// import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PaymentDetails {
  flutterwave_transaction_id: string;
  is_subscription_active: boolean;
  subscription_expires_at: string;
}

interface TransactionDetail {
  id: number;
  subscription_plan_id: number;
  subscription_plan_name: string;
  amount: string;
  quantity: number;
  discount: string;
  transaction_ref: string;
  status: string;
  coupon_code: string | null;
  created_at: string;
  updated_at: string;
  payment_details: PaymentDetails;
}

export default function AdminTransactionDetailsPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const token = useAppSelector((state) => state.auth?.token)
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isRequerying, setIsRequerying] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  
  // Add logging for URL parameters
  // useEffect(() => {
  //   if (!params?.id) {
  //     console.log('No transaction ID found in URL')
  //     return
  //   }
    
  //   const transactionId = params.id
  //   console.log('URL Parameters:', {
  //     fullUrl: window.location.href,
  //     transactionId: transactionId,
  //     hasToken: !!token
  //   })
  // }, [params, token])

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!params?.id) {
        // console.log('No transaction ID found in URL')
        setError("Transaction ID not found")
        setLoading(false)
        return
      }

      const transactionId = params.id
      // console.log('Transaction ID:', transactionId) 
      // console.log('Token available:', !!token) 

      if (!token || !transactionId) {
        // console.log('Missing required data:', { token: !!token, transactionId }) 
        setError("Transaction ID not found")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // console.log('Fetching transaction details for:', transactionId) 
        
        const response = await getTransactionDetails(token, transactionId)
        // console.log('API Response:', {
          // status: response.status,
          // message: response.message,
          // data: response.data
        // }) 

        if (response.data) {
          // console.log('Transaction Data:', {
          //   id: response.data.id,
          //   ref: response.data.transaction_ref,
          //   status: response.data.status,
          //   amount: response.data.amount
          // }) 
          setTransaction(response.data)
        } else {
          // console.log('No transaction data in response')  
          setError("No transaction data found")
        }
      } catch (error) {
        // console.error('Error details:', {
        //   message: error instanceof Error ? error.message : 'Unknown error',
        //   error: error
        // }) 
        setError(error instanceof Error ? error.message : "Failed to fetch transaction details")
      } finally {
        setLoading(false)
      }
    }

    fetchTransactionDetails()
  }, [token, params])
  

  const handleRequeryPayment = async () => {
    if (!token || !transaction) return;
    setIsRequerying(true);
    try {
      const response = await requeryPayment(token, transaction.transaction_ref);
      if (response?.data?.status) {
        setTransaction((prev) =>
          prev ? { ...prev, status: response.data.status } : prev
        );
      } else {
        console.error("Invalid response data:", response);
        throw new Error("Invalid response data");
      }
    } catch (error) {
      console.error("Error during requery:", error);
      setTransaction((prev) =>
        prev ? { ...prev, status: "successful" } : prev
      ); // Mark as successful on error
    } finally {
      setIsRequerying(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`transition-all ease-in-out bg-white border border-gray-200 rounded-lg p-4 duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`transition-all ease-in-out bg-white border border-gray-200 rounded-lg p-4 duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="text-center py-12 border rounded-lg">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div
        className={`transition-all ease-in-out bg-white border border-gray-200 rounded-lg p-4 duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="text-center py-12 border rounded-lg">
          <p className="text-gray-500">No transaction details found</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`transition-all ease-in-out bg-white border border-gray-200 rounded-lg p-4 duration-300 ${
        isSidebarOpen ? "ml-64" : "ml-20"
      }`}
    >
      <div className="space-y-6">
        <div className="flex max-sm:block items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex-1 max-sm:block flex justify-between items-center">
            <h1 className="text-2xl font-bold">Transaction Details</h1>
            <Badge
              className={`${
                transaction.status.toLowerCase() === "successful" &&
                "bg-green-100 text-green-800"
              } ${
                transaction.status.toLowerCase() === "pending" &&
                "bg-yellow-100 text-yellow-800"
              } ${
                transaction.status.toLowerCase() === "failed" &&
                "bg-red-100 text-red-800"
              }`}
            >
              {transaction.status}
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-medium">#{transaction.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transaction Reference</p>
                <p className="font-medium">{transaction.transaction_ref}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">${transaction.amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subscription Plan</p>
                <p className="font-medium">{transaction.subscription_plan_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Plan ID</p>
                <p className="font-medium">#{transaction.subscription_plan_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="font-medium">{transaction.quantity}</p>
              </div>
              {transaction.discount !== "0.00" && (
                <div>
                  <p className="text-sm text-gray-500">Discount</p>
                  <p className="font-medium">${transaction.discount}</p>
                </div>
              )}
              {transaction.coupon_code && (
                <div>
                  <p className="text-sm text-gray-500">Coupon Code</p>
                  <p className="font-medium">{transaction.coupon_code}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Flutterwave Transaction ID</p>
                  <p className="font-medium">{transaction.payment_details.flutterwave_transaction_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subscription Status</p>
                  <Badge 
                    className={`
                      ${transaction.payment_details.is_subscription_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    `}
                  >
                    {transaction.payment_details.is_subscription_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subscription Expires</p>
                  <p className="font-medium">{transaction.payment_details.subscription_expires_at}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Timestamps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-medium">{transaction.created_at}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">{transaction.updated_at}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Actions</h3>
              <div className="flex items-center gap-4">
                {transaction.status.toLowerCase() === "pending" && (
                  <Button
                    onClick={handleRequeryPayment}
                    disabled={isRequerying}
                    className="flex items-center gap-2"
                  >
                    {isRequerying ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Requerying...
                      </>
                    ) : (
                      "Requery Payment"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

