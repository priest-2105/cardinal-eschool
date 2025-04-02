"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/dashboard/tutor/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, BookOpen, Menu, X, BarChart, FileText, Edit } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import ResourcesList from "../../resources/resourcesList"
import CourseDescription from "../courseDescription"
import ReportsList from "../../report/reportList"
import AssessmentsList from "../../assessment/assessmentList"
import { Avatar, AvatarFallback } from "@/components/dashboard/tutor/ui/avatar"
import StudentList from "../../student/studentList"

type Tab = "description" | "resources" | "reports" | "assessments" | "students"

interface CourseDetailsComponentProps {
  courseDetails: {
    class: {
      id: number
      name: string
      code: string
      description: string
      schedule: {
        days: string[]
        time: string[]
      }
      meeting_link: string
      learning_outcome: string
      prerequisite: string
      department: string
      semester: string
    }
    students: {
      id: string
      name: string
      email: string
    }[]
    students_new?: number
    assignments: {
      total: number
      turned_in: number
      pending: number
      overdue: number
      percentage_turned_in: number
      assignments_new?: number
    }
    reports: {
      total: number
      reports_new?: number
    }
    resources: {
      total: number
      details: {
        id: number
        name: string
        file_path: string
      }[]
      resources_new?: number
    }
  }
}

export default function CourseDetailsComponent({ courseDetails }: CourseDetailsComponentProps) {
  const [activeTab, setActiveTab] = useState<Tab>("description")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const route = useRouter()

  const tabs = [
    { id: "description", label: "Description", icon: BookOpen },
    { id: "resources", label: "Resources", icon: FileText },
    { id: "reports", label: "Reports", icon: BarChart },
    { id: "assessments", label: "Assessments", icon: FileText },
    { id: "students", label: "Students", icon: Users },
  ]

  const handleback = () => {
    route.back()
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
    window.dispatchEvent(new CustomEvent("sidebarToggle", { detail: { isOpen: !isSidebarOpen } }))
  }

  return (
    <div className="w-full max-sm:w-[90%] overflow-hidden max-sm:py-5 pb-5 min-h-full relative">
      {/* Back Button and Title */}
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={handleback}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg md:text-xl font-semibold text-[#1BC2C2]">
          Course Details: {courseDetails.class.name}
        </h1>
        <Button variant="ghost" size="icon" className="rounded-full ml-auto lg:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b mb-4 md:mb-6 overflow-x-auto">
        <div className="flex space-x-4 md:space-x-8 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "pb-2 text-sm font-medium transition-colors relative whitespace-nowrap flex items-center gap-2",
                activeTab === tab.id
                  ? "text-[#1BC2C2] border-b-2 border-[#1BC2C2]"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
        <Card className="border-none shadow-none flex-grow order-2 lg:order-1 pb-3">
          <CardContent className="h-[calc(100vh-200px)] p-0">
            {activeTab === "description" && (
              <CourseDescription courseData={courseDetails.class} />
            )}
            {activeTab === "resources" && (
              <ResourcesList resources={courseDetails.resources} />
            )}
            {activeTab === "reports" && (
              <ReportsList 
                students={courseDetails.students} 
                stats={courseDetails.reports} 
                classId={courseDetails.class.id}
              />
            )}
            {activeTab === "assessments" && (
              <AssessmentsList classId={courseDetails.class.id} stats={courseDetails.assignments} />
            )}
            {activeTab === "students" && (
              <StudentList students={courseDetails.students} />
            )}
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
            <X className="h-5 w-5" />
          </Button>

          {/* Course Info */}
          <Card className="p-4 bg-gray-50">
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{courseDetails.class.code}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">Course Code: {courseDetails.class.code}</h4>
                  <p className="text-sm text-gray-500">Department: {courseDetails.class.department}</p>
                  <p className="text-sm text-gray-500">Semester: {courseDetails.class.semester}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class Statistics */}
          <Card className="p-4 bg-gray-50">
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Users className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Enrolled Students</p>
                  <div>
                    <p className="font-medium">{courseDetails.students.length}</p>
                    <p className="text-xs text-gray-500">
                      {courseDetails.students_new || 0} new this month
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <FileText className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Resources</p>
                  <div>
                    <p className="font-medium">{courseDetails.resources.total}</p>
                    <p className="text-xs text-gray-500">
                      {courseDetails.resources_new || 0} new this month
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <BarChart className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Reports</p>
                  <div>
                    <p className="font-medium">{courseDetails.reports.total}</p>
                    <p className="text-xs text-gray-500">
                      {courseDetails.reports_new || 0} new this month
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <BookOpen className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Assessments</p>
                  <div>
                    <p className="font-medium">{courseDetails.assignments.total}</p>
                    <p className="text-xs text-gray-500">
                      {courseDetails.assignments_new || 0} new this month
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class Schedule */}
          <Card className="p-4 bg-gray-50">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {courseDetails.class.schedule.days.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#1BC2C2]" />
                      <span className="font-medium">{day}</span>
                    </div>
                    <span className="text-gray-600">{courseDetails.class.schedule.time[index]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

