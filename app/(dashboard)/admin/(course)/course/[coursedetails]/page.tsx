"use client"

import CourseDetailsComponent from "@/components/dashboard/admin/pages/courses/coursedetails"
import { useState, useEffect } from "react"


export default function CourseDetails() {
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
    <div className={`transition-all w-[85%] ease-in-out max-sm:h-[calc(80vh-50px)] overflow-hidden py-4 bg-white border border-gray-200 rounded-lg p-4 duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
    <CourseDetailsComponent/>
    </div>
  )
}