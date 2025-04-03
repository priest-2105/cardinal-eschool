"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAppSelector } from "@/lib/hooks"
import { getTransactionDetails } from "@/lib/api/student/payment/transactiondetails"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

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

export default function TransactionDetailsPage() {
  const params = useParams()
  const token = useAppSelector((state) => state.auth.token)
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!token || !params.transactionRef) return

      try {
        setLoading(true)
        const response = await getTransactionDetails(token, params.transactionRef as string)
        setTransaction(response.data)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch transaction details")
      } finally {
        setLoading(false)
      }
    }

    fetchTransactionDetails()
  }, [token, params.transactionRef])

  if (loading) {
    return (
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
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-gray-500">No transaction details found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transaction Details</h1>
        <Badge
          className={`
            ${transaction.status.toLowerCase() === "successful" && "bg-[#1BC2C2] text-white"}
            ${transaction.status.toLowerCase() === "pending" && "bg-yellow-100 text-yellow-800"} 
            ${transaction.status.toLowerCase() === "failed" && "bg-red-100 text-red-800"}
          `}
        >
          {transaction.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Transaction Reference</p>
              <p className="font-medium">{transaction.transaction_ref}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium">${transaction.amount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="font-medium">{transaction.subscription_plan_name}</p>
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
                <Badge variant={transaction.payment_details.is_subscription_active ? "default" : "secondary"}>
                  {transaction.payment_details.is_subscription_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expires At</p>
                <p className="font-medium">{transaction.payment_details.subscription_expires_at}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
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
        </CardContent>
      </Card>
    </div>
  )
} 