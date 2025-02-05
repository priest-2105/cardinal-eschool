"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/student/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload } from "lucide-react"

interface Assignment {
  id: string
  subject: string
  subjectTag: string
  assignmentCount: number
  deadline: string
}

const ASSIGNMENTS: Assignment[] = [
  {
    id: "1",
    subject: "Physics Class 1",
    subjectTag: "Physics",
    assignmentCount: 3,
    deadline: "18th Nov, 2024 ; 8:00PM",
  },
  {
    id: "2",
    subject: "Computer Science",
    subjectTag: "Data P.",
    assignmentCount: 3,
    deadline: "18th Nov, 2024 ; 8:00PM",
  },
]

export default function Assignments() {
  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Assignment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ASSIGNMENTS.map((assignment) => (
          <div key={assignment.id} className="flex flex-col space-y-4 p-4 rounded-lg border bg-white">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{assignment.subject}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-500 rounded">{assignment.subjectTag}</span>
                    <span className="text-sm text-gray-500">• {assignment.assignmentCount} assignments</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-red-500 font-medium">Submit before {assignment.deadline}</p>

              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" className="text-blue-500 hover:text-blue-600">
                  View
                </Button>
                <Button size="sm" className="bg-[#1BC2C2] hover:bg-teal-600 text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

