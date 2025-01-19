'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreVertical } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface Course {
  id: number
  name: string
  tutor: {
    name: string
    email: string
    avatar: string
  }
  schedule: string
  status: string
  dateAdded: string
}

interface CourseTableProps {
  courses: Course[]
}

export function CourseTable({ courses }: CourseTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Class</TableHead>
          <TableHead>Tutor Assigned</TableHead>
          <TableHead>Schedule</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date Added</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course.id}>
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
        ))}
      </TableBody>
    </Table>
  )
}

