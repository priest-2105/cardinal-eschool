"use client"



import { StudentDetails } from "@/components/dashboard/admin/pages/manageStudents/studentDetails"
import { useParams } from "next/navigation";
import { useState, useEffect } from "react"


export default function StudentDetailsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const params = useParams()
    const id = decodeURIComponent(params?.studentdetail?.toString() || "");
    


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
    <div className={`transition-all ease-in-out bg-white border border-gray-200 rounded-lg p-2 duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <StudentDetails id={id}/>
    </div>
  )
}

