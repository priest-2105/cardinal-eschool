"use client"

import { TableCell, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"

interface Course {
  class_id: number
  name: string
  code: string
  no_of_students: number
  schedule: {
    days: string[]
    time: string[]
  }
}

interface CourseTableRowProps {
  course: Course
}

export function CourseTableRow({ course }: CourseTableRowProps) {

  const router = useRouter()

  const handleCourseDetails = () => {
    router.push(`/student/course/${course.class_id}`)
  }

  return (
    <TableRow className="hover:bg-gray-50 cursor-pointer " onClick={handleCourseDetails}>
      <TableCell>{course.name}</TableCell>
      <TableCell>{course.code}</TableCell>
      <TableCell>{course.no_of_students}</TableCell>
      <TableCell>
        {course.schedule.days.map((day, index) => (
          <div key={`${course.class_id}-${day}`}>
            {`${day} at ${course.schedule.time[index]}`}
          </div>
        ))}
      </TableCell>
    </TableRow>
  )
}

