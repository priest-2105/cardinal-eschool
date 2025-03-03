"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/dashboard/admin/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Users, BookOpen, Menu, X, BarChart, Edit } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import ResourcesList from "../../resources/resourcesList"
import CourseDescription from "../courseDescription"
import ReportsList from "../../report/reportList"
import AssessmentsList from "../../assessment/assessmentList"
import StudentList from "../../student/studentList"
import { EditCourseModal } from "../editCourseModal/index"
import { AssignStudentModal } from "../assignStudentModal/index"

type Tab = "description" | "resources" | "reports" | "assessments" | "students"

interface Course {
  id: string
  name: string
  description: string
  tutor: string
  schedule: string
  status: string
  noOfStudent: number
  dateAdded: string
}

interface CourseDetailsComponentProps {
  courseName: string
}

export default function CourseDetailsComponent({ courseName = "Advanced Physics" }: CourseDetailsComponentProps) {
  const [activeTab, setActiveTab] = useState<Tab>("description")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAssignStudentModalOpen, setIsAssignStudentModalOpen] = useState(false)
  const route = useRouter()

  const tabs = [
    { label: "Description", value: "description", icon: BookOpen },
    { label: "Resources", value: "resources", icon: BarChart },
    { label: "Reports", value: "reports", icon: Clock },
    { label: "Assessments", value: "assessments", icon: Users },
    { label: "Students", value: "students", icon: Users },
  ]

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
  }

  const handleback = () => {
    route.back()
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleEditCourse = (updatedCourse: Course) => {
    // In a real application, you would send this update to your backend
    console.log("Updating course:", updatedCourse)
    setIsEditModalOpen(false)
  }

  const handleAssignStudent = (studentEmail: string) => {
    // In a real application, you would send this to your backend
    console.log("Assigning student:", studentEmail)
    setIsAssignStudentModalOpen(false)
  }

  return (
    <div className="w-full max-sm:w-[90%] overflow-hidden max-sm:py-5 pb-5 min-h-full relative">
      {/* Back Button and Title */}
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={handleback}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg md:text-xl font-semibold text-[#1BC2C2]">Course Details: {courseName}</h1>
        <Button variant="ghost" size="icon" className="rounded-full ml-auto" onClick={() => setIsEditModalOpen(true)}>
          <Edit className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full lg:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? "default" : "ghost"}
            onClick={() => handleTabChange(tab.value)}
            className="flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "description" && <CourseDescription />}
      {activeTab === "resources" && <ResourcesList />}
      {activeTab === "reports" && <ReportsList />}
      {activeTab === "assessments" && <AssessmentsList />}
      {activeTab === "students" && <StudentList />}

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

        {/* Sidebar Content */}
        <Card>
          <CardContent>{/* Add more sidebar content here */}</CardContent>
        </Card>

        {/* Add Student Button */}
        <Button
          className="w-full bg-[#1BC2C2] hover:bg-[#15A3A3] text-white"
          onClick={() => setIsAssignStudentModalOpen(true)}
        >
          Assign Student
        </Button>
      </div>

      <EditCourseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditCourse}
        course={{
          id: "1",
          name: courseName,
          description: "Sample description",
          tutor: "John Doe",
          schedule: "Monday 10:00 AM - 11:30 AM",
          status: "Active",
          noOfStudent: 25,
          dateAdded: "2023-09-01",
        }}
      />

      <AssignStudentModal
        isOpen={isAssignStudentModalOpen}
        onClose={() => setIsAssignStudentModalOpen(false)}
        onSubmit={handleAssignStudent}
      />
    </div>
  )
}

