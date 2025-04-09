"use client"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CourseTableRow } from "../coursetablerow"

interface Course {
  id: number
  name: string
  code: string
  no_of_students: number
  schedule: string
  tutor: {
    name: string
    dp_url: string
  }
}


interface CourseTableProps {
  courses: Course[]
}

export function CourseTable({ courses }: CourseTableProps) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tutor</TableHead>
            <TableHead>Course Name</TableHead>
            <TableHead>Course Code</TableHead>
            <TableHead>Completion</TableHead>
            <TableHead>Schedule</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <CourseTableRow key={course.id} course={course} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
