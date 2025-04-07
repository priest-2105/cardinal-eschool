"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CourseDescriptionModal } from "../courseDescriptionModal"

interface CourseDescriptionProps {
  coursdetails: {
    name: string;
    code: string;
    description: string;
    schedule: {
      days: string[];
      time: string[];
    };
    meeting_link: string;
    students_assigned: {
      id: string;
      name: string;
      dp_url: string | null;
    }[];
    resources_assigned: unknown[];
  }
}

export default function CourseDescription({ coursdetails }: CourseDescriptionProps) {
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false)
  const [isILOModalOpen, setIsILOModalOpen] = useState(false)

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-semibold">{coursdetails.name}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-slate-200">
              {coursdetails.code}
            </Badge>
          </div>
        </div>
        
          <a  className="bg-[#1BC2C2] py-2 px-4 rounded-full hover:bg-[#1bc2c2bd] text-white w-full sm:w-auto" href={coursdetails.meeting_link} target="_blank" rel="noopener noreferrer">
            Join Class
          </a>
      </div>

      {/* Course Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Course Description</label>
        <div className="bg-gray-50 border-gray-200 rounded-md p-4">
          <p className="text-sm text-gray-700">{truncateText(coursdetails.description, 150)}</p>
          <Button
            variant="link"
            onClick={() => setIsDescriptionModalOpen(true)}
            className="mt-2 p-0 h-auto text-[#1BC2C2]"
          >
            See more
          </Button>
        </div>
      </div>

 
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Prerequisites</label>
          <div className="bg-gray-50 border-gray-200 rounded-md p-4">
            <p className="text-sm text-gray-700">Completion of Grade 5 Science or equivalent</p>
          </div>
        </div>


      {/* Course Description Modal */}
      <CourseDescriptionModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        title="Course Description"
        description={coursdetails.description}
      />

      {/* Learning Outcomes Modal */}
      <CourseDescriptionModal
        isOpen={isILOModalOpen}
        onClose={() => setIsILOModalOpen(false)}
        title="Learning Outcomes"
        description={truncateText(coursdetails.description, 150)}
      />
    </div>
  )
}