"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowLeft, Mail, Calendar, BookOpen, Activity } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Tutor {
  id: string
  name: string
  email: string
  subject: string
  dateJoined: string
  status: "Active" | "Suspended" | "Inactive"
  avatar?: string
  bio?: string
  totalStudents?: number
  averageRating?: number
}

const SAMPLE_TUTOR: Tutor = {
  id: "TUT001",
  name: "John Doe",
  email: "john.doe@example.com",
  subject: "Mathematics",
  dateJoined: "2023-09-01",
  status: "Active",
  avatar: "https://i.pravatar.cc/150?img=68",
  bio: "Experienced mathematics tutor with a passion for making complex concepts easy to understand.",
  totalStudents: 45,
  averageRating: 4.8,
}

export function TutorDetails() {
  const [tutor, setTutor] = useState<Tutor>(SAMPLE_TUTOR)
  const router = useRouter()

  const handleStatusChange = (newStatus: "Active" | "Suspended" | "Inactive") => {
    setTutor({ ...tutor, status: newStatus })
    // In a real application, you would also send this update to your backend
  }

  const handleBack = () => {
    router.push("/admin/tutors")
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tutor List
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStatusChange("Active")}>Set as Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("Suspended")}>Suspend Account</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("Inactive")}>Set as Inactive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tutor Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:w-1/3">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src={tutor.avatar} alt={tutor.name} />
                <AvatarFallback>
                  {tutor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold mb-2">{tutor.name}</h2>
              <Badge variant={tutor.status === "Active" ? "default" : "destructive"}>{tutor.status}</Badge>
            </div>
            <div className="md:w-2/3 space-y-4">
              <div>
                <Label className="font-semibold">Tutor ID</Label>
                <p>{tutor.id}</p>
              </div>
              <div>
                <Label className="font-semibold flex items-center">
                  <Mail className="mr-2 h-4 w-4" /> Email
                </Label>
                <p>{tutor.email}</p>
              </div>
              <div>
                <Label className="font-semibold flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" /> Subject
                </Label>
                <p>{tutor.subject}</p>
              </div>
              <div>
                <Label className="font-semibold flex items-center">
                  <Calendar className="mr-2 h-4 w-4" /> Date Joined
                </Label>
                <p>{tutor.dateJoined}</p>
              </div>
              <div>
                <Label className="font-semibold">Bio</Label>
                <p>{tutor.bio}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <Label className="font-semibold flex items-center">
                    <Activity className="mr-2 h-4 w-4" /> Total Students
                  </Label>
                  <p>{tutor.totalStudents}</p>
                </div>
                <div>
                  <Label className="font-semibold">Average Rating</Label>
                  <p>{tutor.averageRating} / 5</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

