"use client"


import CreateCoursePage from "@/components/dashboard/admin/pages/courses/createcourse"
import { useState, useEffect } from "react"


export default function CreateCourse() {
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
    <CreateCoursePage/>
    </div>
  )
}

