"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/dashboard/student/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Users, GraduationCap, BookOpen, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ResourcesList from "../../resources/resourcesList"
import CourseDescription from "../courseDescription"
import ReportsList from "../../report/reportList"
import AssessmentsList from "../../assessment/assessmentList"

type Tab = "description" | "resources" | "reports" | "assessments"

interface Schedule {
  day: string
  time: string
}

interface CourseDetailsComponentProps {
  studentName?: string
}

const SAMPLE_SCHEDULES: Schedule[] = [
  { day: "Monday", time: "10:00 AM - 11:30 AM" },
  { day: "Wednesday", time: "2:00 PM - 3:30 PM" },
]

export default function CourseDetailsComponent({ studentName = "Temilade" }: CourseDetailsComponentProps) {
  const [activeTab, setActiveTab] = useState<Tab>("description")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const route = useRouter()

  const tabs = [
    { id: "description", label: "Description" },
    { id: "resources", label: "Resources" },
    { id: "reports", label: "Reports" },
    { id: "assessments", label: "Assessments" },
  ]

  const handleback = () => {
    route.back()
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
    // Dispatch a custom event to notify the layout about sidebar state change
    window.dispatchEvent(new CustomEvent("sidebarToggle", { detail: { isOpen: !isSidebarOpen } }))
  }

  return (
    <div className="w-full overflow-hidden max-sm:py-5 min-h-full p-4 md:p-6 relative">
      {/* Back Button and Title */}
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={handleback}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg md:text-xl font-semibold text-[#1BC2C2]">Class Details</h1>
        <Button variant="ghost" size="icon" className="rounded-full ml-auto lg:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b mb-4 md:mb-6 overflow-x-auto">
        <div className="flex space-x-4 md:space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "pb-2 text-sm font-medium transition-colors relative whitespace-nowrap",
                activeTab === tab.id
                  ? "text-[#1BC2C2] border-b-2 border-[#1BC2C2]"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
        <Card className="border-none shadow-none flex-grow order-2 lg:order-1">
          <CardContent className="h-[calc(100vh-200px)] p-0">
            {activeTab === "description" && <CourseDescription />}
            {activeTab === "resources" && <ResourcesList />}
            {activeTab === "reports" && <ReportsList />}
            {activeTab === "assessments" && <AssessmentsList />}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div
          className={cn(
            "w-full lg:w-1/3 space-y-4 md:space-y-8 order-1 lg:order-2",
            "fixed inset-y-0 right-0 z-50 bg-white p-4 overflow-y-auto transition-transform duration-300 ease-in-out transform",
            "lg:relative lg:inset-auto lg:transform-none lg:transition-none",
            isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
          )}
        >
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 lg:hidden" onClick={toggleSidebar}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Instructor Info */}
          <Card className="p-4 bg-gray-50">
            <CardContent className="space-y-4">
              <h3 className="font-semibold text-lg">Instructor</h3>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 md:h-16 md:w-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">Dr. John Doe</h4>
                  <p className="text-sm text-gray-500">Senior Science Instructor</p>
                  <p className="text-sm text-gray-500">Ph.D. in Physical Sciences</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Stats */}
          <Card className="p-4 bg-gray-50">
            <CardContent className="space-y-4">
              <h3 className="font-semibold text-lg">Course Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Clock className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">12 Weeks</p>
                </div>
                <div className="space-y-2">
                  <Users className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Class Size</p>
                  <p className="font-medium">25 Students</p>
                </div>
                <div className="space-y-2">
                  <GraduationCap className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Level</p>
                  <p className="font-medium">Intermediate</p>
                </div>
                <div className="space-y-2">
                  <BookOpen className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Lessons</p>
                  <p className="font-medium">24 Topics</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Class Schedule</label>
            <div className="space-y-2">
              {SAMPLE_SCHEDULES.map((schedule, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#1BC2C2]" />
                    <span className="font-medium">{schedule.day}</span>
                  </div>
                  <span className="text-gray-600">{schedule.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

