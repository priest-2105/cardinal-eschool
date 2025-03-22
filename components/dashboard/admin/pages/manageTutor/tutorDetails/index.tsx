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
  User,
  Briefcase,
  LucideBarChart4,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { getTutorDetails, updateUserStatus } from "@/lib/api/admin/api"
import { formatDate } from "@/utils/dateformat"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"

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

const SAMPLE_TUTOR: Tutor = {
  id: "TUT001",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 987-6543",
  subject: "Mathematics",
  dateJoined: "2023-09-01",
  lastLogin: "2024-03-09T10:30:00",
  status: "Active",
  avatar: "https://i.pravatar.cc/150?img=68",
  bio: "Experienced mathematics tutor with a passion for making complex concepts easy to understand.",
  totalStudents: 45,
  totalClasses: 12,
  averageRating: 4.8,
  classesThisWeek: 5,
  experience: 7,
  specializations: ["Calculus", "Algebra", "Statistics"],
  assignedClasses: [
    { id: "C001", name: "Advanced Calculus", schedule: "Mon, Wed 10:00-11:30", students: 15 },
    { id: "C002", name: "Algebra 101", schedule: "Tue, Thu 14:00-15:30", students: 20 },
    { id: "C003", name: "Statistics for Beginners", schedule: "Fri 13:00-15:00", students: 10 },
  ],
}

export function TutorDetails({ id }: { id: string }) {
  const [tutor, setTutor] = useState<Tutor>(SAMPLE_TUTOR)
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()
  const tutorId = decodeURIComponent(id)
  const [tutorDetails, setTutorDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null)
  const token = useSelector((state: RootState) => state.auth?.token)  
  const [statusToUpdate, setStatusToUpdate] = useState<"active" | "suspended" | "banned" | null>(null);

  const confirmStatusUpdate = async () => {
    if (!statusToUpdate || !token) return;

    setLoading(true);
    setAlert(null);
    try {
      await updateUserStatus(token, tutorId, { status: statusToUpdate });
      setTutorDetails({ ...tutorDetails, status: statusToUpdate });
      setAlert({ type: "success", message: `Status updated to ${statusToUpdate} successfully!` });
    } catch (error: any) {
      console.error("Failed to update status:", error.message);
      setAlert({ type: "danger", message: error.message });
    } finally {
      setLoading(false);
      setStatusToUpdate(null);
    }
  };

  useEffect(() => {
    const fetchTutorDetails = async () => {
      setLoading(true)
      try {
        if (!token) throw new Error("Authentication token is missing")
        const data = await getTutorDetails(token, tutorId)
        setTutorDetails(data)
      } catch (error: any) {
        console.error("Failed to fetch tutor details:", error.message)
        console.log("tutor id ", tutorId)

        setAlert({ type: "danger", message: error.message })
      } finally {
        setLoading(false)
      }
    }

    fetchTutorDetails()
  }, [token, tutorId])

  const handleBack = () => {
    router.push("/admin/tutors")
  }

  if (loading) {
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
        <div className="fixed top-5 right-5 z-50">
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
              <AvatarImage src={tutorDetails?.dp_url || "/assets/img/dashboard/admin/Ellipse2036.png"} alt={tutorDetails?.name} />
              {/* <AvatarFallback>{tutorDetails?.name.charAt(0)}</AvatarFallback> */}
            </Avatar>
            <h2 className="text-2xl font-bold mb-2">{tutorDetails?.first_name} {" "} {tutorDetails?.last_name}</h2>
            <Badge variant={tutorDetails?.status === "Active" ? "default" : "destructive"} className="mb-4">
              {tutorDetails?.status}
            </Badge>

            <div className="w-full space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  Tutor ID
                </span>
                <span className="text-sm font-medium">{tutorDetails?.id}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </span>
                <span className="text-sm font-medium">{tutorDetails?.email}</span>
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
                <span className="text-sm font-medium"> {formatDate(tutorDetails?.last_login)}</span>
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
                  <DropdownMenuItem className="border-2 border-white hover:border-[#1BC2C2] cursor-pointer border-b" onClick={() => setStatusToUpdate("active")}>Set as Active</DropdownMenuItem>
                  <DropdownMenuItem className="border-2  border-white hover:border-[#1BC2C2] cursor-pointer border-b" onClick={() => setStatusToUpdate("suspended")}>Suspend Tutor</DropdownMenuItem>
                  <DropdownMenuItem className="border-2  border-white hover:border-[#1BC2C2] cursor-pointer border-b" onClick={() => setStatusToUpdate("banned")}>Ban Tutor</DropdownMenuItem>
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
                      <span className="text-2xl font-bold">{tutor.totalStudents}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <BookOpen className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Total Classes</span>
                      <span className="text-2xl font-bold">{tutor.totalClasses}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <Star className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Reports Created</span>
                      <span className="text-2xl font-bold">{tutor.averageRating}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <LucideBarChart4 className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Classes This Week</span>
                      <span className="text-2xl font-bold">{tutor.classesThisWeek}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  {/* <CardTitle>Tutor Overview</CardTitle> */}
                </CardHeader>
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

      <AlertDialog open={!!statusToUpdate} onOpenChange={(open) => !open && setStatusToUpdate(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Update Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to set the status to "{statusToUpdate}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusUpdate} className="bg-[#1BC2C2] text-white hover:bg-[#1bc2c2e5]">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

