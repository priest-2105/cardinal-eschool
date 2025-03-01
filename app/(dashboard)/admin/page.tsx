"use client"


import { useState, useEffect } from "react"
import Announcements from "@/components/dashboard/admin/pages/home/announcements"
import Assignments from "@/components/dashboard/admin/pages/home/assignments"
import UpcomingClasses from "@/components/dashboard/admin/pages/home/upcomingClasses"



export default function AdminDashboard() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
     
        <div className="">
        <UpcomingClasses/>
      </div>

        <div className="">
        <Announcements />
        <Assignments/>
        </div>
      </div>
    </div>
  )
}

