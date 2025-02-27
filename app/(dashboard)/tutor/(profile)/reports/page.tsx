"use client"

import GuardianInformation from "@/components/dashboard/tutor/profile/guardianInformation";
import ProfileLayout from "@/components/dashboard/tutor/profile/layout/profileLayout";
import { useEffect, useState } from "react"

export default function TutorReports() {

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
        <GuardianInformation/>
        </ProfileLayout>
      </div>
    </>
  )
}

