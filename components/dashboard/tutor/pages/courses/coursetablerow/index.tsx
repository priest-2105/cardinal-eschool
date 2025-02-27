import type { Course } from "../types"
import { Avatar, AvatarFallback } from "@/components/dashboard/tutor/ui/avatar" 
import { TableCell, TableRow } from "@/components/dashboard/tutor/ui/table"
// import { MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import cardinalConfig from "@/config"

interface CourseTableRowProps {
  course: Course
}

export function CourseTableRow({ course }: CourseTableRowProps) {
  const route = useRouter()

  const handleCourseDetails = () => {
    route.push(cardinalConfig.routes.dashboard.tutor.courseDetails("123"))
  }

  return (
    <TableRow className="hover:bg-slate-100 cursor-pointer text-sm md:text-base" onClick={handleCourseDetails}>
      <TableCell className="font-medium">{course.name}</TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 md:h-8 md:w-8">
            <AvatarFallback>{course.noOfStudent}</AvatarFallback>
          </Avatar>
          {/* <div className="flex flex-col">
            <span className="text-xs md:text-sm font-medium">{course.noOfStudent}</span>
            <span className="text-xs text-muted-foreground hidden lg:inline">{course.noOfStudent}</span>
          </div> */}
        </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell">{course.schedule}</TableCell>
      <TableCell>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            course.status === "Upcoming" && "bg-yellow-100 text-yellow-800",
            course.status === "Active" && "bg-green-100 text-green-800",
            course.status === "Completed" && "bg-gray-100 text-gray-800",
          )}
        >
          {course.status}
        </span>
      </TableCell>
      <TableCell className="hidden xl:table-cell">{course.dateAdded}</TableCell>
      {/* <TableCell>
        <Button variant="ghost" size="icon" className="h-6 w-6 md:h-8 md:w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </TableCell> */}
    </TableRow>
  )
}

