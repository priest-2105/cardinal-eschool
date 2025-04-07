"use client"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CourseTableRow } from "../coursetablerow"

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

interface CourseTableProps {
  courses: Course[]
}

export function CourseTable({ courses }: CourseTableProps) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Name</TableHead>
            <TableHead>Course Code</TableHead>
            <TableHead>No. of Students</TableHead>
            <TableHead>Schedule</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <CourseTableRow key={course.class_id} course={course} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

