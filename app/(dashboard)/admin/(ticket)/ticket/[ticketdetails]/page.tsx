"use client"

import TicketDetailsComponent from "@/components/dashboard/admin/pages/tickets/ticketdetails"
import TicketDetailsLayout from "@/components/dashboard/admin/pages/tickets/ticketdetailslayout"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function TicketDetailsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const params = useParams()
  const ticketId = decodeURIComponent(params?.ticketdetails?.toString() || "");  
  

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
      <TicketDetailsLayout>
        <TicketDetailsComponent ticketId={ticketId} />
      </TicketDetailsLayout>
    </div>
  )
}

