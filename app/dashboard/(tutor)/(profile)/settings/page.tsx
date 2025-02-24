"use client"

import ProfileLayout from "@/components/dashboard/student/profile/layout/profileLayout"; 
import StudentSettings from "@/components/dashboard/student/profile/settings";
import { useEffect, useState } from "react"

export default function StudentSettingsPage() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <>
      <div className={`transition-all ease-in-out duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <ProfileLayout>
        <StudentSettings/>
        </ProfileLayout>
      </div>
    </>
  )
}

