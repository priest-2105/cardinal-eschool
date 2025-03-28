"use client"


import { useState, useEffect } from "react"
import Announcements from "@/components/dashboard/tutor/pages/home/announcements"
import Assessments from "@/components/dashboard/tutor/pages/home/assessments"
import UpcomingClasses from "@/components/dashboard/tutor/pages/home/upcomingClasses" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  GraduationCap,
  LineChart,
  UserCircle2,
} from "lucide-react"
import PendingReportsList from "@/components/dashboard/tutor/pages/home/pendingreports"


export default function TutorDashboard() {
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
    <div className={`transition-all ease-in-out max-xs:w-[74%] p-4 duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>

      <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses Assigned</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students Assigned</CardTitle>
                <UserCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">64</div>
                <p className="text-xs text-muted-foreground">+2 new this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reports</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+4 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">88%</div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
              </CardContent>
            </Card>
          </div>
          </div>
     
          <div className="grid pt-5 grid-cols-1 md:grid-cols-2 gap-4 items-start">
      
          {/* <div className=""> */}
        <UpcomingClasses/>
         {/* </div> */}

        {/* <div className=""> */}
        <Announcements />
        <Assessments/>

        <PendingReportsList/>
        {/* </div> */}
      </div>
    </div>
  )
}

