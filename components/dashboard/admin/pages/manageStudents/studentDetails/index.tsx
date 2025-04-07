"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"
import {
  MoreHorizontal,
  ArrowLeft,
  Mail,
  Calendar,
  GraduationCap,
  Clock,
  BookOpen,
  Award,
  Phone,
  User,
  X,
} from "lucide-react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/admin/ui/alert"
import ReportsList from "../reportList"
import TransactionList from "../studentTransactionList"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { getStudentDetails, updateUserStatus } from "@/lib/api/admin/api"
import { formatDate } from "@/utils/dateformat"

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
  const [activeTab, setActiveTab] = useState("profileinfo")
  const [statusToUpdate, setStatusToUpdate] = useState<"active" | "suspended" | "banned" | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Function to calculate age
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const month = today.getMonth() - birthDate.getMonth()
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const studentAge = studentDetails?.dob ? calculateAge(studentDetails.dob) : null

  const openModal = (status: "active" | "suspended" | "banned") => {
    setStatusToUpdate(status)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    // Use a small delay to ensure smooth animation before resetting the status
    setTimeout(() => {
      setStatusToUpdate(null)
    }, 300)
  }

  const confirmStatusUpdate = async () => {
    if (!statusToUpdate || !token) return

    setIsUpdating(true)

    try {
      await updateUserStatus(token, studentId, { status: statusToUpdate })

      // Refetch student details to get the updated data
      await fetchStudentDetails()

      // Show success alert
      setAlert({ type: "success", message: `Status updated to ${statusToUpdate} successfully!` })

      // Close the modal
      closeModal()
    } catch (error: unknown) {
      console.error("Failed to update status:", error instanceof Error ? error.message : "Unknown error")
      setAlert({ type: "danger", message: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setIsUpdating(false)
    }
  }

  // Function to fetch student details
  const fetchStudentDetails = async () => {
    setLoading(true)
    try {
      if (!token) throw new Error("Authentication token is missing")
      const data = await getStudentDetails(token, studentId)
      setStudentDetails(data)
      console.log(data);
      
    } catch (error: unknown) {
      console.error("Failed to fetch student details:", error instanceof Error ? error.message : "Unknown error")
      console.log("student id ", studentId)
      setAlert({ type: "danger", message: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null)
      }, 3000) // Close alert after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [alert])

  // Add event listener to handle ESC key press to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        closeModal()
      }
    }

    window.addEventListener("keydown", handleEscKey)

    return () => {
      window.removeEventListener("keydown", handleEscKey)
    }
  }, [isModalOpen])

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isModalOpen])

  // Initial fetch of student details
  useEffect(() => {
    fetchStudentDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, studentId, fetchStudentDetails])

  const handleBack = () => {
    router.push("/admin/students")
  }

  if (loading && !studentDetails) {
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
    <div className="container mx-auto p-6">
      {alert && (
        <div className="fixed bg-white top-5 right-5 z-50">
          <Alert variant={alert.type} onClose={() => setAlert(null)}>
            <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}
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
              <AvatarImage
                src={studentDetails?.dp_url || "/assets/img/dashboard/admin/Ellipse2036.png"}
                alt={studentDetails?.name}
              />
            </Avatar>
            {/* <h2 className="text-2xl font-bold mb-2">{studentDetails?.name}</h2> */}
            <Badge
              variant={studentDetails?.user?.account_status === "active" ? "default" : "destructive"}
              className="mb-4"
            >
              {studentDetails?.user?.account_status[0].toUpperCase()}
              {studentDetails?.user?.account_status.slice(1)}
            </Badge>

            <div className="w-full space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  Name
                </span>
                <span className="text-sm font-medium">
                  {studentDetails?.user?.name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </span>
                <span className="text-sm font-medium">{studentDetails?.user?.email}</span>
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
                <span className="text-sm font-medium">
                  {" "}
                  {studentDetails?.assessment?.tests_interested_in?.join(", ") || "N/A"}
                </span>
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
                <span className="text-sm font-medium">{formatDate(studentDetails?.user?.last_login)}</span>
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
                <DropdownMenuContent align="end" className="w-[200px] bg-white py-2">
                  <DropdownMenuItem
                    className="border-2 border-white hover:border-[#1BC2C2] cursor-pointer border-b"
                    onClick={() => openModal("active")}
                  >
                    Set as Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="border-2 border-white hover:border-[#1BC2C2] cursor-pointer border-b"
                    onClick={() => openModal("suspended")}
                  >
                    Suspend Student
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="border-2 border-white hover:border-[#1BC2C2] cursor-pointer border-b"
                    onClick={() => openModal("banned")}
                  >
                    Ban Student
                  </DropdownMenuItem>
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
              {studentAge !== null && studentAge < 16 && studentDetails?.guardian && (
                <Card>
                  <CardHeader>
                    <CardTitle>Guardian Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
                        <p>{studentDetails?.guardian?.name || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                        <p>{studentDetails?.guardian?.email || "N/A"} </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
                        <p>{studentDetails?.guardian?.phone || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Gender</h3>
                        <p> {studentDetails?.guardian?.gender || "N/A"}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Country</h3>
                        <p>{studentDetails?.guardian?.country || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">State</h3>
                        <p>{studentDetails?.guardian?.state || "N/A"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
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
                    <p> {studentDetails?.assessment?.tests_interested_in?.join(", ") || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Learning Difficulties </h3>
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
                  </div>
                )}
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
                      <span className="text-2xl font-bold">{studentDetails?.academic_info?.total_classes}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <Award className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Assigned Assignment </span>
                      <span className="text-2xl font-bold">{studentDetails?.academic_info?.assigned_assignments}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <Calendar className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Submission Rate</span>
                      <span className="text-2xl font-bold">{studentDetails?.academic_info?.submission_rate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="my-3">
                <CardHeader>
                  <CardTitle>Current Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studentDetails?.classes?.map((cls) => (
                      <div key={cls.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{cls.name}</h3>
                          <Badge variant="outline">{cls.code}</Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            {/* <Calendar className="h-4 w-4 mr-2 text-muted-foreground" /> */}
                            {/* <span>{cls.schedule}</span> */}
                            {cls.schedule.days.map((day, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white mr-1 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 mr-1 rounded-full bg-[#1BC2C2]" />
                                  <span className="font-medium text-[13px]">{day}</span>
                                </div>
                                <span className="text-gray-600  text-[13px]">{cls.schedule.time[index]}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-end ml-auto">
                            {/* <Users className="h-4 w-4 mr-2 text-muted-foreground" /> */}
                            <span>{cls.students.length} students</span>
                          </div>
                        </div>
                      </div>
                    ))}
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
                <TransactionList transactions={studentDetails?.payments} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeModal}></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Update Status</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to set the status to &quot;{statusToUpdate}&quot;?
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t">
              <Button
                onClick={closeModal}
                variant="outline"
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmStatusUpdate}
                variant="default"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

