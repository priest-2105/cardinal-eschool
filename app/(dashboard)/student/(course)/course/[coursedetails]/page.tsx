"use client"

import CourseDetailsComponent from "@/components/dashboard/student/pages/courses/coursedetails"
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
  
    // <div className={`transition-all w-[80%] ease-in-out max-sm:h-fit overflow-hidden py-4 bg-white border border-gray-200 rounded-lg px-4
    <div className={`transition-all ease-in-out max-xs:w-[90%] p-4  bg-white border border-gray-200 rounded-lg px-4
    duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
    <CourseDetailsComponent/>
    </div>
  )
}