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
    <div className={`transition-all ease-in-out duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <StudentEventCalendar/>

        <Announcements />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Top Courses ({topCourses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topCourses.map((course, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium">{course.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Chapter {course.chapter}</span>
                        <span>•</span>
                        <span>{course.totalClasses} Classes</span>
                      </div>
                      <Progress value={course.progress} className="mt-2" />
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{course.score}%</div>
                      <div className="text-sm text-gray-500">{course.status}</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {assignments.map((assignment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{assignment.subject}</h3>
                        <Button variant="outline" size="sm">Upload</Button>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>{assignment.assignments} assignments</span>
                        <span>•</span>
                        <span className="text-red-500">Submit before {assignment.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Upcoming Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingClasses.map((class_, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Avatar src={class_.avatar} alt={class_.instructor} fallback={class_.instructor[0]} />
                      <div className="flex-1">
                        <h3 className="font-medium">{class_.title}</h3>
                        <p className="text-sm text-gray-500">{class_.subject}</p>
                        <p className="text-sm text-gray-500">by {class_.instructor}</p>
                      </div>
                      <Button>Join</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

