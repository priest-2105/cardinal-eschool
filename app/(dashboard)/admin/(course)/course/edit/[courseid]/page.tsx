"use client"

import EditCoursePage from "@/components/dashboard/admin/pages/courses/editcoursecomponent"
import { useState, useEffect } from "react"


export default function EditCourse() {
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
    <div className={`transition-all ease-in-out bg-white border border-gray-200 rounded-lg p-4 duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
    <EditCoursePage />
    </div>
  )
}

