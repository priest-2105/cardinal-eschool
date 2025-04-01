"use client"


import UpcomingClasses from "@/components/dashboard/tutor/pages/home/upcomingClasses" 
import { useEffect, useState } from "react"
import { getTutorDashboard } from "@/lib/api/tutor/home/dashboard"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Alert } from "@/components/ui/alert"
import { DashboardSkeleton } from "@/components/dashboard/tutor/pages/skeletons/dashboardSkeleton"
import { AnnouncementMarquee } from "@/components/dashboard/tutor/announcementMarquee"
import { DashboardStats } from "@/components/dashboard/tutor/pages/home/dashboardStats"
import Assessments from "@/components/dashboard/tutor/pages/home/assessments"
import PendingReportsList from "@/components/dashboard/tutor/pages/home/pendingreports"


export default function TutorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const token = useSelector((state: RootState) => state.auth?.token)

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) return
      
      setLoading(true)
      try {
        const response = await getTutorDashboard(token)
        setDashboardData(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [token])

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

  if (loading) {
    return (
      <div className={`transition-all ease-in-out p-2 duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <DashboardSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`transition-all ease-in-out p-2 duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <Alert variant="danger">{error}</Alert>
      </div>
    )
  }

  return (
    <div className={`transition-all ease-in-out p-2 duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
      <AnnouncementMarquee announcements={dashboardData.announcements} />
      
      <div className="space-y-6 p-6 bg-white rounded-lg border">
        <DashboardStats overview={dashboardData.overview} />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2">
            <UpcomingClasses upcomingClasses={dashboardData.upcoming_classes} />
          </div>
          <div className="space-y-6">
            <Assessments assignments={dashboardData.active_assignments} />
            <PendingReportsList reports={dashboardData.pending_reports} />
          </div>
        </div>
      </div>
    </div>
  )
}

