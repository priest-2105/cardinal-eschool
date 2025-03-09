"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/drodown"
import { MoreHorizontal, ArrowLeft, Mail, Calendar, GraduationCap, Clock, BookOpen } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/dashboard/student/ui/ta"
import { format } from "date-fns"

interface Student {
  id: string
  name: string
  email: string
  grade: string
  course: string
  dateJoined: string
  lastLogin: string
  status: "Active" | "Suspended" | "Inactive"
  avatar?: string
  totalCourses?: number
  averageGrade?: string
  attendance?: number
}

const SAMPLE_STUDENT: Student = {
  id: "STU001",
  name: "John Doe",
  email: "john.doe@example.com",
  grade: "A",
  course: "Mathematics",
  dateJoined: "2023-09-01",
  lastLogin: "2024-03-09T10:30:00",
  status: "Active",
  avatar: "https://i.pravatar.cc/150?img=12",
  totalCourses: 5,
  averageGrade: "A-",
  attendance: 95,
}

export function StudentDetails() {
  const [student, setStudent] = useState<Student>(SAMPLE_STUDENT)
  const router = useRouter()

  const handleStatusChange = (newStatus: "Active" | "Suspended" | "Inactive") => {
    setStudent({ ...student, status: newStatus })
    // In a real application, you would also send this update to your backend
  }

  const handleBack = () => {
    router.push("/admin/students")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Student List
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student Info Sidebar */}
        <Card className="md:col-span-1 p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mb-2">{student.name}</h2>
            <Badge variant={student.status === "Active" ? "default" : "destructive"} className="mb-4">
              {student.status}
            </Badge>

            <div className="w-full space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </span>
                <span className="text-sm font-medium">{student.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Grade
                </span>
                <span className="text-sm font-medium">{student.grade}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Course
                </span>
                <span className="text-sm font-medium">{student.course}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Joined
                </span>
                <span className="text-sm font-medium">{student.dateJoined}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  Last Login
                </span>
                <span className="text-sm font-medium">{format(new Date(student.lastLogin), "MMM d, h:mm a")}</span>
              </div>
            </div>

            <div className="w-full mt-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Manage Student
                    <MoreHorizontal className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem onClick={() => handleStatusChange("Active")}>Set as Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("Suspended")}>Suspend Student</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("Inactive")}>Set as Inactive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>

        {/* Main Content Area */}
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">
                Overview
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex-1">
                Reports
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex-1">
                Attendance
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex-1">
                Courses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Total Courses</span>
                      <span className="text-2xl font-bold">{student.totalCourses}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Average Grade</span>
                      <span className="text-2xl font-bold">{student.averageGrade}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Attendance</span>
                      <span className="text-2xl font-bold">{student.attendance}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardContent className="p-6">
                  {/* Add ReportsList component here */}
                  <p>Student reports will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance">
              <Card>
                <CardContent className="p-6">
                  {/* Add AttendanceList component here */}
                  <p>Student attendance records will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses">
              <Card>
                <CardContent className="p-6">
                  {/* Add CoursesList component here */}
                  <p>Enrolled courses will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

