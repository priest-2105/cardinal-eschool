"use client"

import { TableCell, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"

interface Course {
  class_id: number
  name: string
  code: string
  no_of_students: number
  schedule: string   
  tutor: {
    name: string
    dp_url: string
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

  // Parse the schedule string into an object
  const schedule = JSON.parse(course.schedule)

  return (
    <TableRow className="hover:bg-gray-50 cursor-pointer " onClick={handleCourseDetails}>
      <TableCell className="flex items-center space-x-2">
        <img
          src={course.tutor.dp_url}
          alt={course.tutor.name}
          className="w-8 h-8 rounded-full"
        />
        <span>{course.tutor.name}</span>
      </TableCell>
      <TableCell>{course.name}</TableCell>
      <TableCell>{course.code}</TableCell>
      <TableCell>{course.no_of_students}</TableCell>
      <TableCell>
        {schedule.days.map((day, index) => (
          <div key={`${course.class_id}-${day}`}>
            {`${day} at ${schedule.time[index]}`}
          </div>
        ))}
      </TableCell>
    </TableRow>
  )
}
