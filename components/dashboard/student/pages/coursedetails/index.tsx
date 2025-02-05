"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

type Tab = "description" | "resources" | "reports" | "assessments"

interface CourseDetailsProps {
  studentName?: string
}

export default function CourseDetails({ studentName = "Temilade" }: CourseDetailsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("description")

  const tabs = [
    { id: "description", label: "Class Description" },
    { id: "resources", label: "Resources" },
    { id: "reports", label: "Reports" },
    { id: "assessments", label: "Assessments" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button and Title */}
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-[#1BC2C2]">Class Details</h1>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "pb-2 text-sm font-medium transition-colors relative",
                  activeTab === tab.id
                    ? "text-[#1BC2C2] border-b-2 border-[#1BC2C2]"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <Card className="border-none shadow-none">
          <CardContent className="space-y-6">
            {activeTab === "description" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Course</label>
                  <Input value="Basic Science" readOnly className="bg-gray-50 border-gray-200" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Class Schedule</label>
                  <Input value="24, May 2025 (12:00PM W.A.T)" readOnly className="bg-gray-50 border-gray-200" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Grade</label>
                  <Input value="Grade 6" readOnly className="bg-gray-50 border-gray-200" />
                </div>

                <Button className="w-full bg-[#1BC2C2] hover:bg-teal-600 text-white font-medium py-6">
                  Join Class
                </Button>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="text-center py-8 text-gray-500">Resources content will be displayed here</div>
            )}

            {activeTab === "reports" && (
              <div className="text-center py-8 text-gray-500">Reports content will be displayed here</div>
            )}

            {activeTab === "assessments" && (
              <div className="text-center py-8 text-gray-500">Assessments content will be displayed here</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

