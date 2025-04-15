"use client"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CourseTableRow } from "../coursetablerow/index"

interface ApiCourse {
  class_id: number;
  name: string;
  code: string;
  no_of_students: number;
  schedule: {
    days: string[];
    time: string[];
  };
  status: string;
  progress_percentage: number;
  days_remaining: number | null;
  start_date: string | null;
  end_date: string | null;
  department: string;
  semester: string;
  meeting_link: string;
  resource_count: number;
}

interface Course extends ApiCourse {
  id: number;
}

interface CourseTableProps {
  courses: Course[];
  onRowClick?: (course: Course) => void;
}

export function CourseTable({ courses, onRowClick }: CourseTableProps) {
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
            <CourseTableRow key={course.id} course={course} onRowClick={onRowClick} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

