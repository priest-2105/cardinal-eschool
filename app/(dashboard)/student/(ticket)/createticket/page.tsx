"use client"

import CreateTicketForm from "@/components/dashboard/student/pages/tickets/createticket"
import TicketLayout from "@/components/dashboard/student/pages/tickets/layout"
import { useState, useEffect } from "react"


export default function CreateTicketPage() {
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
    <div className={`transition-all ease-in-out duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <TicketLayout>
            <CreateTicketForm/>
        </TicketLayout>
    </div>
  )
}

