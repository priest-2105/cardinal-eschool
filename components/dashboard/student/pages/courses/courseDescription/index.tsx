"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/dashboard/student/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Clock, Users, GraduationCap, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import ResourcesList from "../../resources/resourcesList"


type Tab = "description" | "resources" | "reports" | "assessments"

interface Schedule {
  day: string
  time: string
}

interface CourseDescriptionProps {
  studentName?: string
}

const SAMPLE_SCHEDULES: Schedule[] = [
  { day: "Monday", time: "10:00 AM - 11:30 AM" },
  { day: "Wednesday", time: "2:00 PM - 3:30 PM" },
  { day: "Friday", time: "11:00 AM - 12:30 PM" },
]

export default function CourseDescription({ studentName = "Temilade" }: CourseDescriptionProps) {
  const [activeTab, setActiveTab] = useState<Tab>("description")
  const route = useRouter()

  const tabs = [
    { id: "description", label: "Class Description" },
    { id: "resources", label: "Resources" },
    { id: "reports", label: "Reports" },
    { id: "assessments", label: "Assessments" },
  ]

  const handleback = () => {
    route.back()
  }

  return (
       <div className="space-y-8">
                {/* Course Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold">Basic Science</h2>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Science</Badge>
                      <Badge variant="secondary">Grade 6</Badge>
                    </div>
                  </div>
                  <Button className="bg-[#1BC2C2] hover:bg-[#1bc2c2bd] text-white">Join Class</Button>
                </div>

                {/* Course Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Course Description</label>
                  <Textarea
                    readOnly
                    className="bg-gray-50 border-gray-200 min-h-[150px]"
                    value={`This comprehensive Basic Science course is designed for Grade 6 students, covering fundamental concepts in physics, chemistry, and biology. The course emphasizes hands-on experiments and practical applications.

                    Key Topics:
                    • Introduction to Scientific Method
                    • Matter and Energy
                    • Living Systems and Ecosystems
                    • Earth and Space Science
                    • Basic Laboratory Skills

                    Students will participate in weekly laboratory sessions and group discussions to reinforce their understanding of scientific concepts.`}
                  />
                </div>

                {/* Class Schedule */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">Class Schedule</label>
                  <div className="space-y-2">
                    {SAMPLE_SCHEDULES.map((schedule, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#1BC2C2]" />
                          <span className="font-medium">{schedule.day}</span>
                        </div>
                        <span className="text-gray-600">{schedule.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Outcomes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Learning Outcomes</label>
                  <Textarea
                    readOnly
                    className="bg-gray-50 border-gray-200"
                    value={`Upon completion, students will be able to:
                    • Apply scientific method to solve problems
                    • Understand basic principles of matter and energy
                    • Conduct simple scientific experiments
                    • Explain fundamental concepts in biology, chemistry, and physics
                    • Develop critical thinking and analytical skills`}
                  />
                </div>
              </div>
  )
}

