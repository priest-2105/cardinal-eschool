"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/drodown"
import { MoreHorizontal, ArrowLeft } from "lucide-react"

interface Tutor {
  id: string
  name: string
  email: string
  subject: string
  dateJoined: string
  status: "Active" | "Suspended" | "Inactive"
  // Add more fields as needed
}

const SAMPLE_TUTOR: Tutor = {
  id: "TUT001",
  name: "John Doe",
  email: "john.doe@example.com",
  subject: "Mathematics",
  dateJoined: "2023-09-01",
  status: "Active",
  // Add more sample data as needed
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Tutor ID</Label>
              <p>{tutor.id}</p>
            </div>
            <div>
              <Label className="font-semibold">Name</Label>
              <p>{tutor.name}</p>
            </div>
            <div>
              <Label className="font-semibold">Email</Label>
              <p>{tutor.email}</p>
            </div>
            <div>
              <Label className="font-semibold">Subject</Label>
              <p>{tutor.subject}</p>
            </div>
            <div>
              <Label className="font-semibold">Date Joined</Label>
              <p>{tutor.dateJoined}</p>
            </div>
            <div>
              <Label className="font-semibold">Status</Label>
              <p>{tutor.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  )
}

