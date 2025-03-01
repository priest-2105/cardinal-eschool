"use client"


import TicketLayout from "@/components/dashboard/admin/pages/tickets/layout"
import ReplyTicketForm from "@/components/dashboard/admin/pages/tickets/replyticket"
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
        <ReplyTicketForm />
      </TicketLayout>
    </div>
  )
}

