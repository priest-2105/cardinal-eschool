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
import type { LucideIcon } from "lucide-react" 

type Tab = {
  id: "description" | "resources" | "reports" | "assessments" | "students"
  label: string
  icon: LucideIcon
}

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
      start_date: string | null
      end_date: string | null
      status: string
      progress_percentage: number
      days_remaining: number | null
    }
    tutor: {
      id: string
      name: string
      email: string
    }
    students: {
      id: string
      name: string
      email: string
    }[]
    assignments: {
      total: number
      turned_in: number
      pending: number
      overdue: number
      percentage_turned_in: number
    }
    reports: {
      total: number
    }
    resources: {
      total: number
      details: {
        id: number
        name: string
        file_path: string
      }[]
    }
  }
}

export default function CourseDetailsComponent({ courseDetails }: CourseDetailsComponentProps) {
  const [activeTab, setActiveTab] = useState<Tab["id"]>("description")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const route = useRouter()

  const tabs: Tab[] = [
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
        <Button 
          variant="outline" 
          className="ml-auto mr-4"
          onClick={() => route.push(`/admin/course/edit/${courseDetails.class.id}`)}
        >
          <Edit className="mr-2 h-5 w-5" />
          Edit Course
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full lg:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b mb-4 md:mb-6 overflow-x-auto">
        <div className="flex space-x-4 md:space-x-8 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
              <CourseDescription 
                coursedetails={{
                  ...courseDetails.class,
                  students_assigned: courseDetails.students.map(student => ({
                    id: student.id,
                    name: student.name,
                    dp_url: null,
                  })),
                  resources_assigned: courseDetails.resources.details.map(resource => resource.name),
                }} 
              />
            )}
            {activeTab === "resources" && (
              <ResourcesList resources={courseDetails.resources} />
            )}
            {activeTab === "reports" && (
              <ReportsList 
                classId={courseDetails.class.id.toString()}
                courseDetails={{
                  students: courseDetails.students,
                }}
              />
            )}
            {activeTab === "assessments" && (
              <AssessmentsList 
                classId={courseDetails.class.id.toString()}
                stats={courseDetails.assignments} // Remove or update `AssessmentListProps` to include `stats`
              />
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
                  </div>
                </div>
                <div className="space-y-2">
                  <FileText className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Resources</p>
                  <div>
                    <p className="font-medium">{courseDetails.resources.total}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <BarChart className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Reports</p>
                  <div>
                    <p className="font-medium">{courseDetails.reports.total}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <BookOpen className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Assessments</p>
                  <div>
                    <p className="font-medium">{courseDetails.assignments.total}</p>
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

