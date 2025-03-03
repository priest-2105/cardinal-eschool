"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/dashboard/tutor/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Users, BookOpen, Menu, X, BarChart, FileText, Edit } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import ResourcesList from "../../resources/resourcesList"
import CourseDescription from "../courseDescription"
import ReportsList from "../../report/reportList"
import AssessmentsList from "../../assessment/assessmentList"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/dashboard/tutor/ui/avatar"
import StudentList from "../../student/studentList"
import { EditCourseInfoModal } from "../editCourseInfo/index"
import { EditClassScheduleModal } from "../editClassSchedule/index"
import { EditCourseNameModal } from "../editCourseNameModal/index"

type Tab = "description" | "resources" | "reports" | "assessments" | "students"

interface Schedule {
  day: string
  fromTime: string
  toTime: string
}

interface CourseInfo {
  code: string
  department: string
  semester: string
}

interface CourseDetailsComponentProps {
  courseName?: string
}

const SAMPLE_SCHEDULES: Schedule[] = [
  { day: "Monday", fromTime: "10:00", toTime: "11:30" },
  { day: "Wednesday", fromTime: "14:00", toTime: "15:30" },
]

export default function CourseDetailsComponent({ courseName = "Advanced Physics" }: CourseDetailsComponentProps) {
  const [activeTab, setActiveTab] = useState<Tab>("description")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [schedules, setSchedules] = useState<Schedule[]>(SAMPLE_SCHEDULES)
  const [courseInfo, setCourseInfo] = useState<CourseInfo>({
    code: "PHY301",
    department: "Physics",
    semester: "Fall 2023",
  })
  const [isEditCourseInfoModalOpen, setIsEditCourseInfoModalOpen] = useState(false)
  const [isEditClassScheduleModalOpen, setIsEditClassScheduleModalOpen] = useState(false)
  const [isEditCourseNameModalOpen, setIsEditCourseNameModalOpen] = useState(false)
  const [currentCourseName, setCurrentCourseName] = useState(courseName)
  const [joinClassLink, setJoinClassLink] = useState("https://example.com/join-class")
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
        <h1 className="text-lg md:text-xl font-semibold text-[#1BC2C2]">Course Details: {currentCourseName}</h1>
        <Button variant="ghost" size="icon" className="rounded-full ml-auto lg:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Course Name and Join Class */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{currentCourseName}</h2>
        <div className="flex items-center gap-2">
          <Button className="bg-[#1BC2C2] hover:bg-[#1bc2c2bd] text-white">Join Class</Button>
          <Button variant="outline" size="icon" onClick={() => setIsEditCourseNameModalOpen(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
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
            {activeTab === "description" && <CourseDescription />}
            {activeTab === "resources" && <ResourcesList />}
            {activeTab === "reports" && <ReportsList />}
            {activeTab === "assessments" && <AssessmentsList />}
            {activeTab === "students" && <StudentList />}
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
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Course Information</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsEditCourseInfoModalOpen(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 md:h-16 md:w-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{courseInfo.code}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">Course Code: {courseInfo.code}</h4>
                  <p className="text-sm text-gray-500">Department: {courseInfo.department}</p>
                  <p className="text-sm text-gray-500">Semester: {courseInfo.semester}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class Statistics */}
          <Card className="p-4 bg-gray-50">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Class Statistics</h3>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Users className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Enrolled Students</p>
                  <p className="font-medium">25</p>
                </div>
                <div className="space-y-2">
                  <Clock className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Hours Taught</p>
                  <p className="font-medium">36 / 48</p>
                </div>
                <div className="space-y-2">
                  <BarChart className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Avg. Performance</p>
                  <p className="font-medium">78%</p>
                </div>
                <div className="space-y-2">
                  <BookOpen className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Assignments</p>
                  <p className="font-medium">8 / 12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class Schedule */}
          <Card className="p-4 bg-gray-50">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Class Schedule</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsEditClassScheduleModalOpen(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {schedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#1BC2C2]" />
                      <span className="font-medium">{schedule.day}</span>
                    </div>
                    <span className="text-gray-600">
                      {schedule.fromTime} - {schedule.toTime}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modals */}
      <EditCourseInfoModal
        isOpen={isEditCourseInfoModalOpen}
        onClose={() => setIsEditCourseInfoModalOpen(false)}
        courseInfo={courseInfo}
        onSave={(newCourseInfo) => {
          setCourseInfo(newCourseInfo)
          setIsEditCourseInfoModalOpen(false)
        }}
      />

      <EditClassScheduleModal
        isOpen={isEditClassScheduleModalOpen}
        onClose={() => setIsEditClassScheduleModalOpen(false)}
        schedules={schedules}
        onSave={(newSchedules) => {
          setSchedules(newSchedules)
          setIsEditClassScheduleModalOpen(false)
        }}
      />

      <EditCourseNameModal
        isOpen={isEditCourseNameModalOpen}
        onClose={() => setIsEditCourseNameModalOpen(false)}
        courseName={currentCourseName}
        joinClassLink={joinClassLink}
        onSave={(newCourseName, newJoinClassLink) => {
          setCurrentCourseName(newCourseName)
          setJoinClassLink(newJoinClassLink)
          setIsEditCourseNameModalOpen(false)
        }}
      />
    </div>
  )
}

