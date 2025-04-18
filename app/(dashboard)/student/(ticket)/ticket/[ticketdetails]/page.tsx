"use client"

import TicketDetailsComponent from "@/components/dashboard/student/pages/tickets/ticketdetails"
import TicketDetailsLayout from "@/components/dashboard/student/pages/tickets/ticketdetailslayout"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function TicketDetailsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Extract the ticket codec from the URL
  const ticketCodec = pathname.split("/").pop() || ""

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
        <TicketDetailsComponent ticketCodec={ticketCodec} />
      </TicketDetailsLayout>
    </div>
  )
}

