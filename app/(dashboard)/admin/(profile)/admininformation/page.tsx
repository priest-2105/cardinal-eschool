"use client"

import ProfileLayout from "@/components/dashboard/admin/profile/layout/profileLayout"; 
import PersonalInformation from "@/components/dashboard/admin/profile/admin/PersonalInformation";
import { useEffect, useState } from "react"

export default function AdminProfile() {

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
        <PersonalInformation/>
        </ProfileLayout>
      </div>
    </>
  )
}

