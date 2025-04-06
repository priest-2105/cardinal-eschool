"use client"

import PendingReportsList from "@/components/dashboard/admin/pages/pendingReports"
import { useState, useEffect } from "react"

export default function PendingReportsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false)
    } else {
      setIsSidebarOpen(true)
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const updatePendingReportsCount = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <div className={`transition-all ease-in-out duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
      <PendingReportsList updatePendingReportsCount={updatePendingReportsCount} />
    </div>
  )
}
