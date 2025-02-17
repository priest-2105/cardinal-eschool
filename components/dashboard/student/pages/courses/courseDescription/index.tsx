"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CourseDescriptionModal } from "../courseDescriptionModal"

interface Schedule {
  day: string
  time: string
}

interface CourseDescriptionProps {
  studentName?: string
}

const COURSE_DESCRIPTION = `This comprehensive Basic Science course is designed for Grade 6 students, covering fundamental concepts in physics, chemistry, and biology. The course emphasizes hands-on experiments and practical applications.

Key Topics:
• Introduction to Scientific Method
• Matter and Energy
• Living Systems and Ecosystems
• Earth and Space Science
• Basic Laboratory Skills

Students will participate in weekly laboratory sessions and group discussions to reinforce their understanding of scientific concepts.`

const LEARNING_OUTCOMES = `Upon completion, students will be able to:
• Apply scientific method to solve problems
• Understand basic principles of matter and energy
• Conduct simple scientific experiments
• Explain fundamental concepts in biology, chemistry, and physics
• Develop critical thinking and analytical skills`

export default function CourseDescription({ }: CourseDescriptionProps) {
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
          <h2 className="text-xl sm:text-2xl font-semibold">Basic Science</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-slate-200">
              Science
            </Badge>
            <Badge variant="secondary" className="bg-slate-200">
              Grade 6
            </Badge>
          </div>
        </div>
        <Button className="bg-[#1BC2C2] hover:bg-[#1bc2c2bd] text-white w-full sm:w-auto">Join Class</Button>
      </div>

      {/* Course Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Course Description</label>
        <div className="bg-gray-50 border-gray-200 rounded-md p-4">
          <p className="text-sm text-gray-700">{truncateText(COURSE_DESCRIPTION, 150)}</p>
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

      {/* Learning Outcomes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Learning Outcomes</label>
        <div className="bg-gray-50 border-gray-200 rounded-md p-4">
          <p className="text-sm text-gray-700">{truncateText(LEARNING_OUTCOMES, 150)}</p>
          <Button variant="link" onClick={() => setIsILOModalOpen(true)} className="mt-2 p-0 h-auto text-[#1BC2C2]">
            See more
          </Button>
        </div>
      </div>

      {/* Course Description Modal */}
      <CourseDescriptionModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        title="Course Description"
        description={COURSE_DESCRIPTION}
      />

      {/* Learning Outcomes Modal */}
      <CourseDescriptionModal
        isOpen={isILOModalOpen}
        onClose={() => setIsILOModalOpen(false)}
        title="Learning Outcomes"
        description={LEARNING_OUTCOMES}
      />
    </div>
  )
}

