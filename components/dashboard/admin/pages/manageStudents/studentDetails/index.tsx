"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/drodown"
import { MoreHorizontal, ArrowLeft } from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  grade: string
  course: string
  dateJoined: string
  status: "Active" | "Suspended" | "Inactive" 
}

const SAMPLE_STUDENT: Student = {
  id: "STU001",
  name: "John Doe",
  email: "john.doe@example.com",
  grade: "A",
  course: "Mathematics",
  dateJoined: "2023-09-01",
  status: "Active",
  // Add more sample data as needed
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
    <div className="max-w-4xl p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Student List
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
          <CardTitle>Student Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Student ID</Label>
              <p>{student.id}</p>
            </div>
            <div>
              <Label className="font-semibold">Name</Label>
              <p>{student.name}</p>
            </div>
            <div>
              <Label className="font-semibold">Email</Label>
              <p>{student.email}</p>
            </div>
            <div>
              <Label className="font-semibold">Grade</Label>
              <p>{student.grade}</p>
            </div>
            <div>
              <Label className="font-semibold">Course</Label>
              <p>{student.course}</p>
            </div>
            <div>
              <Label className="font-semibold">Date Joined</Label>
              <p>{student.dateJoined}</p>
            </div>
            <div>
              <Label className="font-semibold">Status</Label>
              <p>{student.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

