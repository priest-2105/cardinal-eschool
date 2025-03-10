"use client"



import EditCouponPage from "@/components/dashboard/admin/pages/manageCoupons/editCoupon"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function EditCoupon() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const params = useParams()
  const id = params?.id as string

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
    <div className={`transition-all ease-in-out max-xs:w-[74%] p-4 duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
      <EditCouponPage id={id} />
    </div>
  )
}

