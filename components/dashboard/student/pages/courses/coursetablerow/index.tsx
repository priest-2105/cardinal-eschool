import { Course } from '../types'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/dashboard/student/ui/avatar"
import { Button } from "@/components/dashboard/student/ui/button"
import { TableCell, TableRow } from "@/components/dashboard/student/ui/table"
import { MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface CourseTableRowProps {
  course: Course;
}

export function CourseTableRow({ course }: CourseTableRowProps) {

  const route = useRouter();

  const handleCourseDetails = () => {
     route.push('/student/course/1')
  }

  return (
    <TableRow  className='hover:bg-slate-100 cursor-pointer' onClick={handleCourseDetails}>
      <TableCell className="font-medium">{course.name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={course.tutor.avatar} />
            <AvatarFallback>{course.tutor.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{course.tutor.name}</span>
            <span className="text-xs text-muted-foreground">
              {course.tutor.email}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>{course.schedule}</TableCell>
      <TableCell>
        <span className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          course.status === "Upcoming" && "bg-yellow-100 text-yellow-800",
          course.status === "Active" && "bg-green-100 text-green-800",
          course.status === "Completed" && "bg-gray-100 text-gray-800"
        )}>
          {course.status}
        </span>
      </TableCell>
      <TableCell>{course.dateAdded}</TableCell>
      <TableCell>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

