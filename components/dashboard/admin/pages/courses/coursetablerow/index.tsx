"use client"

import { Avatar, AvatarFallback } from "@/components/dashboard/admin/ui/avatar"
import { TableCell, TableRow } from "@/components/dashboard/admin/ui/table"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import cardinalConfig from "@/config"

interface CourseTableRowProps {
  course: {
    id: number;
    name: string;
    code: string;
    schedule: {
      days: string[];
      time: string[];
    };
    tutor_id: string;
    tutor_name: string;
    status: string;
    progress_percentage: number;
    created_at: string;
    updated_at: string;
  }
}

export function CourseTableRow({ course }: CourseTableRowProps) {
  const router = useRouter()

  const handleViewDetails = (courseId: number) => {
    // Use the configuration from cardinalConfig if it exists, otherwise use a direct path
    const route = cardinalConfig?.routes?.dashboard?.admin?.courseDetails?.(courseId.toString()) || 
                  `/admin/course/${courseId}`;
    router.push(route);
  }

  return (
    <TableRow
      className="hover:bg-slate-100 cursor-pointer text-sm md:text-base"
      onClick={() => handleViewDetails(course.id)}
    >
      <TableCell className="w-[20%] font-medium">{course.name}</TableCell>
      <TableCell className="w-[10%] font-medium">{course.tutor_name}</TableCell>
      <TableCell className="w-[15%] hidden md:table-cell">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 md:h-8 md:w-8">
            <AvatarFallback>{course.progress_percentage}</AvatarFallback>
          </Avatar>
        </div>
      </TableCell>
      <TableCell className="w-[25%] hidden lg:table-cell lg:flex">
        {course.schedule?.days?.map((day, index) => (
          <div
            key={index}
            className="flex items-center justify-between w-fit p-2 bg-white mr-1 rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 mr-1 rounded-full bg-[#1BC2C2]" />
              <span className="font-medium text-[13px]">{day}</span>
            </div>
            <span className="text-gray-600 text-[13px]">{course.schedule.time[index]}</span>
          </div>
        ))}
      </TableCell>
      <TableCell className="w-[10%]">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            course.status === "scheduled" && "bg-yellow-100 text-yellow-800",
            course.status === "active" && "bg-green-100 text-green-800",
            course.status === "completed" && "bg-gray-100 text-gray-800"
          )}
        >
          {course.status}
        </span>
      </TableCell>
      <TableCell className="w-[15%] hidden xl:table-cell">
        {new Date(course.created_at).toLocaleDateString()}
      </TableCell>
    </TableRow>
  )
}

