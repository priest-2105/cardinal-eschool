"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"
import { MoreHorizontal, ArrowLeft, Mail, Calendar, GraduationCap, Clock, BookOpen, Award, Phone, User } from "lucide-react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/admin/ui/alert"
import { Progress } from "@/components/ui/progress"
import ReportsList from "../reportList"
import TransactionList from "../studentTransactionList"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { getStudentDetails, updateUserStatus } from "@/lib/api/admin/api"
import { formatDate } from "@/utils/dateformat"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

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

export function StudentDetails({ id }: { id: string }) {
  const studentId = decodeURIComponent(id)
  const [studentDetails, setStudentDetails] = useState<any>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null)
  const token = useSelector((state: RootState) => state.auth?.token)
  const [student, setStudent] = useState<Student>(SAMPLE_STUDENT)
  const [activeTab, setActiveTab] = useState("profileinfo")
  const [statusToUpdate, setStatusToUpdate] = useState<"active" | "suspended" | "banned" | null>(null)

  const handleStatusChange = (newStatus: "active" | "suspended" | "banned") => {
    setStudent({ ...student, status: newStatus }) 
  }

  const confirmStatusUpdate = async () => {
    if (!statusToUpdate || !token) return;

    setLoading(true);
    setAlert(null);
    try {
      await updateUserStatus(token, studentId, { status: statusToUpdate });
      setStudentDetails({ ...studentDetails, status: statusToUpdate });
      setAlert({ type: "success", message: `Status updated to ${statusToUpdate} successfully!` });
      setStatusToUpdate(null); // Close the modal after success
    } catch (error: any) {
      console.error("Failed to update status:", error.message);
      setAlert({ type: "danger", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStudentDetails = async () => {
      setLoading(true)
      try {
        if (!token) throw new Error("Authentication token is missing")
        const data = await getStudentDetails(token, studentId)
        setStudentDetails(data)
      } catch (error: any) {
        console.error("Failed to fetch student details:", error.message)
        console.log("student id ", studentId)

        setAlert({ type: "danger", message: error.message })
      } finally {
        setLoading(false)
      }
    }

    fetchStudentDetails()
  }, [token, studentId])

  const handleBack = () => {
    router.push("/admin/students")
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading student details...</p>
      </div>
    )
  }

  if (!studentDetails) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No student details found</p>
      </div>
    )
  }

  return (
    <div>
    <div className="container mx-auto p-6">
      {alert && (
        <div className="fixed bg-white top-5 right-5 z-50">
          <Alert variant={alert.type} onClose={() => setAlert(null)}>
            <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}
      <div className="flex items-center justify-between mb-6"></div>
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
              <AvatarImage src={studentDetails?.dp_url || "/assets/img/dashboard/admin/Ellipse2036.png"} alt={studentDetails?.name} />
              {/* <AvatarFallback>{studentDetails?.name[0]}</AvatarFallback> */}
            </Avatar>
            <h2 className="text-2xl font-bold mb-2">{studentDetails?.name}</h2>
            {/* <Badge variant={studentDetails?.status === "Active" ? "default" : "destructive"} className="mb-4">
              {studentDetails?.status}
            </Badge> */}

            <div className="w-full space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                 Name
                </span>
                <span className="text-sm font-medium">{studentDetails?.first_name}{" "} {studentDetails?.last_name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </span>
                <span className="text-sm font-medium">{studentDetails?.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Phone className="mr-2 h-4 w-4" />
                  Phone
                </span>
                <span className="text-sm font-medium">{studentDetails?.phone_number || "N/A"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Grade
                </span>
                <span className="text-sm font-medium">{studentDetails?.edu_level || "N/A"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Program
                </span>
                <span className="text-sm font-medium"> {studentDetails?.assessment?.tests_interested_in?.join(", ") || "N/A"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Joined
                </span>
                <span className="text-sm font-medium">{formatDate(studentDetails?.created_at)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  Last Login
                </span>
                <span className="text-sm font-medium">{formatDate(studentDetails?.last_login)}</span>
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
                  <DropdownMenuItem onClick={() => setStatusToUpdate("active")}>Set as Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusToUpdate("suspended")}>Suspend Student</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusToUpdate("banned")}>Ban Student</DropdownMenuItem>
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
                onClick={() => setActiveTab("profileinfo")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "profileinfo"
                    ? "border-b-2 border-[#1BC2C2] text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("assessment")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "assessment"
                    ? "border-b-2 border-[#1BC2C2] text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Assessment
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
                onClick={() => setActiveTab("reports")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "reports"
                    ? "border-b-2 border-[#1BC2C2] text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "payments"
                    ? "border-b-2 border-[#1BC2C2] text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Payment
              </button>
            </div>
          </div>

          {activeTab === "profileinfo" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Date of Birth</h3>
                      <p>{studentDetails?.dob}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone Number</h3>
                      <p>{studentDetails?.phone_number}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Education Level</h3>
                      <p>{studentDetails?.edu_level}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Country</h3>
                      <p>{studentDetails?.country}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">State</h3>
                      <p>{studentDetails?.state}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Employment status</h3>
                      <p>{studentDetails?.employment_status}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                      <p>{studentDetails?.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {studentDetails?.guardian && (
              <Card>
                <CardHeader>
                  <CardTitle>Guardian Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Guardian Name</h3>
                      <p>{studentDetails?.guardian?.name || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Guardian Email</h3>
                      <p>{studentDetails?.guardian?.email || "N/A"} </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Guardian Phone</h3>
                      <p>{studentDetails?.guardian?.phone || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Guardian Gender</h3>
                      <p> {studentDetails?.guardian?.gender || "N/A"}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Guardian Country</h3>
                      <p>{studentDetails?.guardian?.country || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Guardian State</h3>
                      <p>{studentDetails?.guardian?.state || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Guardian Address</h3>
                      <p>{studentDetails?.guardian?.address || "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
          )}
            </div>
          )}

          {activeTab === "assessment" && (
            <Card>
              <CardHeader>
                <CardTitle>Assessment Information</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Education Level</h3>
                      <p> {studentDetails?.assessment?.edu_level || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Subjects Interested In:</h3>
                      <p>{studentDetails?.assessment?.subjects_interested_in?.join(", ") || "N/A"} </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Tests Interested In</h3>
                      <p>  {studentDetails?.assessment?.tests_interested_in?.join(", ") || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Learning Difficulties  </h3>
                      <p>{studentDetails?.assessment?.learning_difficulties ? "Yes" : "No"}</p>
                    </div>
        
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Specific Goals </h3>
                      <p> {studentDetails?.assessment?.specific_goals || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1"> Learning Expectations</h3>
                      <p> {studentDetails?.assessment?.learning_expectations || "N/A"}</p>
                    </div>

                  {studentDetails?.assessment?.learning_difficulty_description && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Difficulty Description:</h3>
                      <p>{studentDetails?.assessment?.learning_difficulty_description || "N/A"}</p>
                    </div>)}
              </CardContent>
            </Card>
          )}

          {activeTab === "academic" && (
            <>
              <Card className="my-3">
                <CardHeader>
                  <CardTitle>Current Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <BookOpen className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Total Courses</span>
                      <span className="text-2xl font-bold">{studentDetails?.totalCourses}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <Award className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Assigned Assignment </span>
                      <span className="text-2xl font-bold">{studentDetails?.averageGrade}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <Calendar className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Attendance</span>
                      <span className="text-2xl font-bold">{studentDetails?.attendance}%</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {studentDetails?.currentCourses?.map((course) => (
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
              <Card className="my-3">
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
                          <p>{studentDetails?.program}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Current Grade</h4>
                          <p>{studentDetails?.grade}</p>
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
            </>
          )}

          {activeTab === "reports" && (
            <Card className="py-5">
              <CardContent>
                <ReportsList />
              </CardContent>
            </Card>
          )}
          {activeTab === "payments" && (
            <Card className="py-5">
              <CardContent>
                <TransactionList />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AlertDialog open={!!statusToUpdate} onOpenChange={(open) => !open && setStatusToUpdate(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Update Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to set the status to "{statusToUpdate}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusUpdate}
              className="bg-[#1BC2C2] text-white hover:bg-[#1bc2c2e5]"
              disabled={loading}
            >
              {loading ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

