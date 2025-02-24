"use client"

import PaymentLayout from "@/components/dashboard/student/pages/payment/layout"
import TransactionList from "@/components/dashboard/student/pages/payment/transactionList"
import { useState, useEffect } from "react"

export default function StudentPaymentHistory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

  return (
    <div className={`transition-all ease-in-out bg-white border border-gray-200 rounded-lg p-2 duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
      <PaymentLayout>
        <TransactionList />
      </PaymentLayout>
    </div>
  )
}


