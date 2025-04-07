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
  BookOpen,
  Users,
  Star,
  Clock,
  Phone,
  LucideBarChart4,
  X,
} from "lucide-react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { getTutorDetails, updateUserStatus } from "@/lib/api/admin/api"
import { formatDate } from "@/utils/dateformat"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface Tutor {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  dateJoined: string
  lastLogin: string
  status: "Active" | "Suspended" | "Inactive"
  avatar?: string
  bio?: string
  totalStudents?: number
  totalClasses?: number
  averageRating?: number
  classesThisWeek?: number
  experience?: number
  specializations?: string[]
  assignedClasses?: Array<{
    id: string
    name: string
    schedule: string
    students: number
  }>
}


export function TutorDetails({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()
  const tutorId = decodeURIComponent(id)
  const [tutorDetails, setTutorDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null)
  const token = useSelector((state: RootState) => state.auth?.token)
  const [statusToUpdate, setStatusToUpdate] = useState<"active" | "suspended" | "banned" | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Function to fetch tutor details
  const fetchTutorDetails = async () => {
    setLoading(true)
    try {
      if (!token) throw new Error("Authentication token is missing")
      const data = await getTutorDetails(token, tutorId)
      setTutorDetails(data)
    } catch (error: unknown) { // changed from any to unknown
      console.error("Failed to fetch tutor details:", error instanceof Error ? error.message : "Unknown error")
      setAlert({ type: "danger", message: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

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
      await updateUserStatus(token, tutorId, { status: statusToUpdate })

      // Refetch tutor details to get the updated data
      await fetchTutorDetails()

      // Show success alert
      setAlert({ type: "success", message: `Status updated to ${statusToUpdate} successfully!` })

      // Close the modal
      closeModal()
    } catch (error: unknown) { // changed from any to unknown
      console.error("Failed to update status:", error instanceof Error ? error.message : "Unknown error")
      setAlert({ type: "danger", message: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setIsUpdating(false)
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

  // Initial fetch of tutor details
  useEffect(() => {
    fetchTutorDetails()
  }, [token, tutorId, fetchTutorDetails])

  const handleBack = () => {
    router.push("/admin/tutors")
  }

  if (loading && !tutorDetails) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading tutor details...</p>
      </div>
    )
  }

  if (!tutorDetails) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No tutor details found</p>
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
          Back to Tutor List
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tutor Info Sidebar */}
        <Card className="md:col-span-1 p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage
                src={tutorDetails?.dp_url || "/assets/img/dashboard/admin/Ellipse2036.png"}
                alt={tutorDetails?.name}
              />
            </Avatar>
            <h2 className="text-2xl font-bold mb-2">{tutorDetails?.user?.name}</h2>
            <Badge
              variant={tutorDetails?.user?.account_status === "active" ? "default" : "destructive"}
              className="mb-4 text-white"
            >
              {tutorDetails?.user?.account_status[0].toUpperCase()}
              {tutorDetails?.user?.account_status.slice(1)}
            </Badge>

            <div className="w-full space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </span>
                <span className="text-sm font-medium">{tutorDetails?.user?.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Phone className="mr-2 h-4 w-4" />
                  Phone
                </span>
                <span className="text-sm font-medium">{tutorDetails?.phone_number}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Qualification
                </span>
                <span className="text-sm font-medium">{tutorDetails?.qualification}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Joined
                </span>
                <span className="text-sm font-medium">{formatDate(tutorDetails?.created_at)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  Last Login
                </span>
                <span className="text-sm font-medium"> {formatDate(tutorDetails?.user?.last_login)}</span>
              </div>
            </div>

            <div className="w-full mt-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Manage Tutor
                    <MoreHorizontal className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] bg-white py-2 ">
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
                    Suspend Tutor
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="border-2 border-white hover:border-[#1BC2C2] cursor-pointer border-b"
                    onClick={() => openModal("banned")}
                  >
                    Ban Tutor
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
                onClick={() => setActiveTab("classes")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "classes"
                    ? "border-b-2 border-[#1BC2C2] text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Classes
              </button>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tutor Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <Users className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Total Students</span>
                      <span className="text-2xl font-bold">{tutor?.tutor_overview?.total_students}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <BookOpen className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Total Classes</span>
                      <span className="text-2xl font-bold">{tutor?.tutor_overview?.total_classes}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <Star className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Reports Created</span>
                      <span className="text-2xl font-bold">{tutor?.tutor_overview?.total_reports}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <LucideBarChart4 className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Classes This Week</span>
                      <span className="text-2xl font-bold">{tutor?.tutor_overview?.classes_this_week}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>{/* <CardTitle>Tutor Overview</CardTitle> */}</CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                      <p>{tutorDetails?.address || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">State</h3>
                      <p>{tutorDetails?.state || "N/A"} </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Country</h3>
                      <p>{tutorDetails?.country || "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "classes" && (
            <Card>
              <CardHeader>
                <CardTitle>Assigned Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tutor.assignedClasses?.map((cls) => (
                    <div key={cls.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{cls.name}</h3>
                        <Badge variant="outline">{cls.id}</Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{cls.schedule}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{cls.students} students</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden transform transition-all">
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

