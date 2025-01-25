"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/dashboard/student/ui/button"

interface Transaction {
  date: string
  status: string
  package: string
  amount: string
  grade: string
}

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { date: "2025/11/23", status: "Success", package: "Premium Plan", amount: "$120", grade: "A" },
  { date: "2025/10/15", status: "Pending", package: "Basic Plan", amount: "$60", grade: "B" },
  { date: "2025/09/10", status: "Failed", package: "Standard Plan", amount: "$90", grade: "C" },
  { date: "2025/08/05", status: "Success", package: "Group Sessions", amount: "$40", grade: "A" },
]

export default function TransactionDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [transaction, setTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    const status = searchParams.get("status")
    const foundTransaction = SAMPLE_TRANSACTIONS.find(t => t.status === status)
    setTransaction(foundTransaction || null)
  }, [searchParams])

  if (!transaction) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Transaction Details</h2>
      <div className="space-y-4">
        <div>
          <strong>Date:</strong> {transaction.date}
        </div>
        <div>
          <strong>Status:</strong> {transaction.status}
        </div>
        <div>
          <strong>Package:</strong> {transaction.package}
        </div>
        <div>
          <strong>Amount:</strong> {transaction.amount}
        </div>
        <div>
          <strong>Grade:</strong> {transaction.grade}
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">
        Back
      </Button>
    </div>
  )
}
