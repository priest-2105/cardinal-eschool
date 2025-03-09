"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/drodown"
import {
  MoreHorizontal,
  ArrowLeft,
  Mail,
  Calendar,
  GraduationCap,
  Clock,
  BookOpen,
  Award,
  User,
  Phone,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Progress } from "@/components/ui/progress"
import ReportsList from "../reportList"

interface Student {
  id: string
  name: string
  email: string
  phone: string
  address: string
  dateOfBirth: string
  grade: string
  program: string
  dateJoined: string
  lastLogin: string
  status: "Active" | "Suspended" | "Inactive"
  avatar?: string
  totalCourses?: number
  averageGrade?: string
  attendance?: number
  examScores?: {
    sat?: {
      reading: number
      math: number
      total: number
    }
    ielts?: {
      listening: number
      reading: number
      writing: number
      speaking: number
      overall: number
    }
  }
  currentCourses?: Array<{
    id: string
    name: string
    progress: number
  }>
}

const SAMPLE_STUDENT: Student = {
  id: "STU001",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, Anytown, USA",
  dateOfBirth: "2000-05-15",
  grade: "A",
  program: "Advanced Mathematics",
  dateJoined: "2023-09-01",
  lastLogin: "2024-03-09T10:30:00",
  status: "Active",
  avatar: "https://i.pravatar.cc/150?img=12",
  totalCourses: 5,
  averageGrade: "A-",
  attendance: 95,
  examScores: {
    sat: {
      reading: 680,
      math: 720,
      total: 1400,
    },
    ielts: {
      listening: 8.5,
      reading: 8.0,
      writing: 7.5,
      speaking: 8.0,
      overall: 8.0,
    },
  },
  currentCourses: [
    { id: "C001", name: "Advanced Calculus", progress: 75 },
    { id: "C002", name: "Physics 101", progress: 60 },
    { id: "C003", name: "English Literature", progress: 90 },
  ],
}

export function StudentDetails() {
  const [student, setStudent] = useState<Student>(SAMPLE_STUDENT)
  const [activeTab, setActiveTab] = useState("overview")
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
                  <User className="mr-2 h-4 w-4" />
                  Student ID
                </span>
                <span className="text-sm font-medium">{student.id}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </span>
                <span className="text-sm font-medium">{student.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Phone className="mr-2 h-4 w-4" />
                  Phone
                </span>
                <span className="text-sm font-medium">{student.phone}</span>
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
                  Program
                </span>
                <span className="text-sm font-medium">{student.program}</span>
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
          <div className="mb-6">
            <div className="flex space-x-2 border-b">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "overview"
                    ? "border-b-2 border-[#1BC2C2] text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("academic")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "academic"
                    ? "border-b-2 border-[#1BC2C2] text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Academic
              </button>
              <button
                onClick={() => setActiveTab("exams")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "exams"
                    ? "border-b-2 border-[#1BC2C2] text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Exam Scores
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "reports"
                    ? "border-b-2 border-[#1BC2C2] text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Reports
              </button>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <BookOpen className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Total Courses</span>
                      <span className="text-2xl font-bold">{student.totalCourses}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <Award className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Average Grade</span>
                      <span className="text-2xl font-bold">{student.averageGrade}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <Calendar className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Attendance</span>
                      <span className="text-2xl font-bold">{student.attendance}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {student.currentCourses?.map((course) => (
                      <div key={course.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{course.name}</span>
                          <span className="text-sm">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Date of Birth</h3>
                      <p>{format(new Date(student.dateOfBirth), "MMMM d, yyyy")}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                      <p>{student.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "academic" && (
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Program Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Current Program</h4>
                        <p>{student.program}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Current Grade</h4>
                        <p>{student.grade}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Course History</h3>
                    <p className="text-muted-foreground">Course history will be displayed here</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Academic Achievements</h3>
                    <p className="text-muted-foreground">Academic achievements will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "exams" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SAT Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  {student.examScores?.sat ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-muted-foreground">Reading</span>
                        <span className="text-2xl font-bold">{student.examScores.sat.reading}</span>
                        <span className="text-xs text-muted-foreground">out of 800</span>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-muted-foreground">Math</span>
                        <span className="text-2xl font-bold">{student.examScores.sat.math}</span>
                        <span className="text-xs text-muted-foreground">out of 800</span>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span className="text-2xl font-bold">{student.examScores.sat.total}</span>
                        <span className="text-xs text-muted-foreground">out of 1600</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No SAT scores available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>IELTS Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  {student.examScores?.ielts ? (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-muted-foreground">Listening</span>
                        <span className="text-2xl font-bold">{student.examScores.ielts.listening}</span>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-muted-foreground">Reading</span>
                        <span className="text-2xl font-bold">{student.examScores.ielts.reading}</span>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-muted-foreground">Writing</span>
                        <span className="text-2xl font-bold">{student.examScores.ielts.writing}</span>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-muted-foreground">Speaking</span>
                        <span className="text-2xl font-bold">{student.examScores.ielts.speaking}</span>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-muted-foreground">Overall</span>
                        <span className="text-2xl font-bold">{student.examScores.ielts.overall}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No IELTS scores available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Other Exams</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Other exam scores will be displayed here</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "reports" && (
            <Card>
              <CardHeader>
                <CardTitle>Student Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <ReportsList/>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

