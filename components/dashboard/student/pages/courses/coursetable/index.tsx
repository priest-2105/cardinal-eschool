"use client"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CourseTableRow } from "../coursetablerow"

interface Course {
  id: number;
  name: string;
  progress_percentage: string;
  code: string;
  no_of_students: number;
  schedule: {
    days: string[];
    time: string[];
  };
  tutor: {
    name: string;
    dp_url: string;
  };
  semester: string; // Added semester property
}

interface CourseTableProps {
  courses: Course[]
  onRowClick: (course: Course) => void
}

export function CourseTable({ courses, onRowClick }: CourseTableProps) {
  return (
    <div className="relative overflow-x-auto sm:rounded-lg h-[62vh]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tutor</TableHead>
            <TableHead className="hidden sm:table-cell">Course Name</TableHead>
            <TableHead className="hidden sm:table-cell">Schedule</TableHead>
            <TableHead className="">Course Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <CourseTableRow key={course.id} course={course} onClick={() => onRowClick(course)} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
