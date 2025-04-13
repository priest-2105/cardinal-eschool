"use client"

import { TableCell, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { useRouter } from "next/navigation"

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
  semester: string // Added semester property
}

interface CourseTableRowProps {
  course: Course
  onClick: () => void
}

export function CourseTableRow({ course, onClick }: CourseTableRowProps) {
  const router = useRouter()
  const schedule = course.schedule

  const handleDesktopClick = () => {
    router.push(`/student/course/${course.id}`)
  }

  return (
    <TableRow
      className="hover:bg-gray-50 cursor-pointer"
      onClick={window.innerWidth >= 1024 ? handleDesktopClick : onClick}
    >
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
      <TableCell className="hidden sm:table-cell">{course.name}</TableCell>
      <TableCell className="hidden sm:table-cell">
        {schedule.days.map((day, index) => (
          <div key={`${course.id}-${day}`}>
            {`${day} at ${schedule.time[index]}`}
          </div>
        ))}
      </TableCell>
      <TableCell>{course.code}</TableCell>
    </TableRow>
  )
}
