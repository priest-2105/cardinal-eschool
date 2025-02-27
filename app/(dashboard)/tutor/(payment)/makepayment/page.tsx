"use client"

import PaymentLayout from "@/components/dashboard/tutor/pages/payment/layout"
import TutorCardPayment from "@/components/dashboard/tutor/pages/payment/makepayment/cardpayment"
// import TutorTransferPayment from "@/components/dashboard/tutor/pages/payment/makepayment/transferpayment"
import { useState, useEffect } from "react"


export default function TutorMakePayment() {
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
    <div className={`transition-all ease-in-out duration-300 bg-white border border-gray-200 rounded-lg p-2 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
       <PaymentLayout>
        {/* <TutorTransferPayment/> */}
        <TutorCardPayment/>
       </PaymentLayout>
    </div>
  )
}

