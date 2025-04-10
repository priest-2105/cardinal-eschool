"use client"

import { TableCell, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Course {
  id: number
  name: string
  code: string
  progress_percentage: string
  no_of_students: number
  schedule: {
    days: string[]
    time: string[]
  }
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
    router.push(`/student/course/${course.id}`)
  }

  // Use the schedule object directly
  const schedule = course.schedule;

  return (
    <TableRow className="hover:bg-gray-50 cursor-pointer" onClick={handleCourseDetails}>
      <TableCell className="flex items-center space-x-2">
        <Image
          src={course.tutor.dp_url}
          alt={course.tutor.name}
          className="w-8 h-8 rounded-full"
          width={32}
          height={32}
        />
        <span>{course.tutor.name}</span>
      </TableCell>
      <TableCell>{course.name}</TableCell>
      <TableCell>{course.code}</TableCell>
      <TableCell>{course.progress_percentage}%</TableCell>
      <TableCell>
        {schedule.days.map((day, index) => (
          <div key={`${course.id}-${day}`}>
            {`${day} at ${schedule.time[index]}`}
          </div>
        ))}
      </TableCell>
    </TableRow>
  )
}
