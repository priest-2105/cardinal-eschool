"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/tutor/ui/alert"
import { getCourseDetails, type CourseDetails } from "@/lib/api/tutor/courses/fetchsinglecourse"
import { Card, CardContent } from "@/components/dashboard/tutor/ui/card"
import { ArrowLeft, Clock, Users, BookOpen, Menu, X, BarChart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import ResourcesList from "../../resources/resourcesList"
import CourseDescription from "../courseDescription"
import ReportsList from "../../report/reportList"
import AssessmentsList from "../../assessment/assessmentList"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/dashboard/tutor/ui/avatar"
import { FileText } from "lucide-react"
import StudentList from "../../student/studentList"

type Tab = "description" | "resources" | "reports" | "assessments" | "students"

interface CourseDetailsComponentProps {
  courseName?: string
}

export default function CourseDetailsComponent() {
  const params = useParams()
  const courseId = params.coursedetails as string
  const [courseDetails, setCourseDetails] = useState<CourseDetails['data']['class'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const token = useSelector((state: RootState) => state.auth?.token)

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

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!token) return

      setLoading(true)
      try {
        const response = await getCourseDetails(token, courseId)
        setCourseDetails(response.data.class)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch course details')
      } finally {
        setLoading(false)
      }
    }

    fetchCourseDetails()
  }, [courseId, token])

  if (loading) {
    return <div className="text-center py-12">Loading course details...</div>
  }

  if (error) {
    return (
      <Alert variant="danger">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!courseDetails) {
    return <div className="text-center py-12">No course details found</div>
  }

  return (
    <div className="w-full max-sm:w-[90%] overflow-hidden max-sm:py-5 pb-5 min-h-full relative">
      {/* Back Button and Title */}
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={handleback}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg md:text-xl font-semibold text-[#1BC2C2]">Course Details: {courseDetails?.name}</h1>
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
            {activeTab === "description" && <CourseDescription coursdetails={courseDetails} />}
            {activeTab === "resources" && <ResourcesList classId={courseId} />}
            {activeTab === "reports" && <ReportsList />}
            {activeTab === "assessments" && <AssessmentsList />}
            {activeTab === "students" && <StudentList coursedetails={courseDetails} />}
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
                <Avatar className="h-12 w-12 md:h-16 md:w-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback> {courseDetails?.code}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">Course Code: {courseDetails.code}</h4>
                  <p className="text-sm text-gray-500">Department: {courseDetails?.department}</p>
                  <p className="text-sm text-gray-500">Semester: {courseDetails?.semester}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class Statistics */}
          <Card className="p-4 bg-gray-50">
            <CardContent className="space-y-4">
              <h3 className="font-semibold text-lg">Class Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Users className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Enrolled Students</p>
                  <p className="font-medium">{courseDetails?.students_assigned?.length}</p>
                </div>
                <div className="space-y-2">
                  <Clock className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Resources</p>
                  <p className="font-medium"> {courseDetails?.resources_assigned?.length} </p>
                </div>
                <div className="space-y-2">
                  <BarChart className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Reports</p>
                  <p className="font-medium">78</p>
                </div>
                <div className="space-y-2">
                  <BookOpen className="h-5 w-5 text-[#1BC2C2]" />
                  <p className="text-sm text-gray-500">Assessments</p>
                  <p className="font-medium">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class Schedule */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Class Schedule</label>
            <div className="space-y-2">
              {courseDetails.schedule.days.map((day, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#1BC2C2]" />
                    <span className="font-medium">{day}</span>
                  </div>
                  <span className="text-gray-600">{courseDetails.schedule.time[index]}:00</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}