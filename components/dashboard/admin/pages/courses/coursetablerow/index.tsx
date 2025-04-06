"use client"

import type { Course } from "../types"
import { Avatar, AvatarFallback } from "@/components/dashboard/admin/ui/avatar"
import { TableCell, TableRow } from "@/components/dashboard/admin/ui/table"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import cardinalConfig from "@/config"

interface CourseTableRowProps {
  course: Course
}

export function CourseTableRow({ course }: CourseTableRowProps) {
  const router = useRouter()

  const handleViewDetails = (courseId: string | number) => {
    router.push(cardinalConfig.routes.dashboard.admin.courseDetails(courseId.toString()))
  }

  // Format the schedule if it's an object
  const formatSchedule = (schedule: any): string => {
    if (typeof schedule === "string") return schedule

    if (schedule && schedule.days && schedule.time) {
      return `${schedule.days.join(", ")} ${schedule.time.join(" - ")}`
    }

    return "No schedule"
  }

  // Get the course ID (handle both id and class_id)
  const courseId = course.id || course.class_id

  // Get number of students (handle both naming conventions)
  const studentCount = course.noOfStudent || course.no_of_students || 0

  // Get date added (use created_at if dateAdded is not available)
  const dateAdded = course.dateAdded || (course.created_at ? new Date(course.created_at).toLocaleDateString() : "")

  // Default status to "Active" if not provided
  const status = course.status || "Active"

  return (
    <TableRow
      className="hover:bg-slate-100 cursor-pointer text-sm md:text-base"
      onClick={() => handleViewDetails(courseId)}
    >
      <TableCell className="w-[20%] font-medium">{course.name}</TableCell>
      <TableCell className="w-[10%] font-medium">{course.tutor_name}</TableCell>
      <TableCell className="w-[10%] hidden md:table-cell">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 md:h-8 md:w-8">
            <AvatarFallback>{studentCount}</AvatarFallback>
          </Avatar>
        </div>
      </TableCell>
      <TableCell className="w-[25%] hidden lg:table-cell  lg:flex">
        {course.schedule.days.map((day, index) => (
          <div key={index}
          className="flex items-center justify-between w-fit p-2 bg-white mr-1 rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 mr-1 rounded-full bg-[#1BC2C2]" />
            <span className="font-medium text-[13px]">{day}</span>
          </div>
          <span className="text-gray-600  text-[13px]">{course.schedule.time[index]}</span>
        </div>
      ))}   
      </TableCell>
      <TableCell className="w-[10%]">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            status === "Upcoming" && "bg-yellow-100 text-yellow-800",
            status === "Active" && "bg-green-100 text-green-800",
            status === "Completed" && "bg-gray-100 text-gray-800",
          )}
        >
          {status}
        </span>
      </TableCell>
      <TableCell className="w-[15%] hidden xl:table-cell">{dateAdded}</TableCell>
    </TableRow>
  )
}

