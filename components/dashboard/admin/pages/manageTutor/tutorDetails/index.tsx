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
  BookOpen,
  Activity,
  Users,
  Star,
  Clock,
  Phone,
  User,
  Briefcase,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

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

export function TutorDetails() {
  const [tutor, setTutor] = useState<Tutor>(SAMPLE_TUTOR)
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  const handleStatusChange = (newStatus: "Active" | "Suspended" | "Inactive") => {
    setTutor({ ...tutor, status: newStatus })
    // In a real application, you would also send this update to your backend
  }

  const handleBack = () => {
    router.push("/admin/tutors")
  }

  return (
    <div className="container mx-auto p-6">
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
              <AvatarImage src={tutor.avatar} alt={tutor.name} />
              <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mb-2">{tutor.name}</h2>
            <Badge variant={tutor.status === "Active" ? "default" : "destructive"} className="mb-4">
              {tutor.status}
            </Badge>

            <div className="w-full space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  Tutor ID
                </span>
                <span className="text-sm font-medium">{tutor.id}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </span>
                <span className="text-sm font-medium">{tutor.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Phone className="mr-2 h-4 w-4" />
                  Phone
                </span>
                <span className="text-sm font-medium">{tutor.phone}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Subject
                </span>
                <span className="text-sm font-medium">{tutor.subject}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Joined
                </span>
                <span className="text-sm font-medium">{tutor.dateJoined}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  Last Login
                </span>
                <span className="text-sm font-medium">{format(new Date(tutor.lastLogin), "MMM d, h:mm a")}</span>
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
                  <DropdownMenuItem className="border-2 border-white hover:border-[#1BC2C2] cursor-pointer border-b" onClick={() => handleStatusChange("Active")}>Set as Active</DropdownMenuItem>
                  <DropdownMenuItem className="border-2  border-white hover:border-[#1BC2C2] cursor-pointer border-b" onClick={() => handleStatusChange("Suspended")}>Suspend Tutor</DropdownMenuItem>
                  <DropdownMenuItem className="border-2  border-white hover:border-[#1BC2C2] cursor-pointer border-b" onClick={() => handleStatusChange("Inactive")}>Set as Inactive</DropdownMenuItem>
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
                      <span className="text-sm text-muted-foreground">Average Rating</span>
                      <span className="text-2xl font-bold">{tutor.averageRating}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <Activity className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Classes This Week</span>
                      <span className="text-2xl font-bold">{tutor.classesThisWeek}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Bio</h3>
                    <p className="text-muted-foreground">{tutor.bio}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Professional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          <Briefcase className="inline-block mr-2 h-4 w-4" />
                          Years of Experience
                        </h4>
                        <p>{tutor.experience} years</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          <BookOpen className="inline-block mr-2 h-4 w-4" />
                          Specializations
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {tutor.specializations?.map((spec, index) => (
                            <Badge key={index} variant="secondary">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
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
    </div>
  )
}

