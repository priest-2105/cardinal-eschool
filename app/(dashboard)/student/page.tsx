"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/student/ui/card"
import { Button } from "@/components/dashboard/student/ui/button"
import { Calendar } from "@/components/dashboard/student/ui/calender"
import { Progress } from "@/components/dashboard/student/ui/progress"
import { Avatar } from "@/components/dashboard/student/ui/avatar"
import { ChevronRight } from 'lucide-react'
import { useState, useEffect } from "react"
import StudentEventCalendar from "@/components/dashboard/student/pages/home/eventCalender"
import Announcements from "@/components/dashboard/student/pages/home/announcements"
import Assignments from "@/components/dashboard/student/pages/home/assignments"
import UpcomingClasses from "@/components/dashboard/student/pages/upcomingClasses"

const announcements = [
  { title: "Father's day", date: "16-06-2024" },
  { title: "Mother's day", date: "12-05-2024" },
  { title: "Christmas day", date: "25-12-2024" },
  { title: "Graduation day", date: "30-07-2024" },
]

const assignments = [
  {
    subject: "Physics Class 1",
    assignments: 3,
    deadline: "18th Nov, 2024 ; 8:00PM",
  },
  {
    subject: "Computer Science",
    assignments: 3,
    deadline: "18th Nov, 2024 ; 8:00PM",
  },
]

const topCourses = [
  {
    title: "Physics Class 1",
    chapter: 5,
    totalClasses: 10,
    progress: 70,
    score: 80,
    status: "In Progress",
  },
  {
    title: "Physics Class 2",
    chapter: 5,
    totalClasses: 10,
    progress: 70,
    score: 80,
    status: "In Progress",
  },
  {
    title: "Mathematics",
    chapter: 5,
    totalClasses: 10,
    progress: 100,
    score: 90,
    status: "Completed",
  },
  {
    title: "English Language",
    chapter: 5,
    totalClasses: 10,
    progress: 70,
    score: 80,
    status: "In Progress",
  },
]

const upcomingClasses = [
  {
    title: "Computer Operating System - Class 2",
    subject: "Computer Science",
    instructor: "Alexandra Ovelyan",
    avatar: "/placeholder.svg",
  },
  {
    title: "Polymer - Class 1",
    subject: "Chemistry",
    instructor: "Daniella Hannah",
    avatar: "/placeholder.svg",
  },
  {
    title: "Further Mathematics1",
    subject: "F.Maths",
    instructor: "Amir David",
    avatar: "/placeholder.svg",
  },
]

export default function StudentDashboard() {
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
    <div className={`transition-all ease-in-out max-sm:w-[74%] p-4 duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
     
        <div className="">
         <StudentEventCalendar/>
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

