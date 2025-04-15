"use client"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CourseTableRow } from "../coursetablerow/index"
import { useRouter } from "next/navigation"

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
  const router = useRouter();

  const handleRowClick = (course: Course) => {
    if (window.innerWidth >= 1024) {
      // Navigate directly to the course page on desktop and large screens
      router.push(`/tutor/course/${course.id}`);
    } else if (onRowClick) {
      // Trigger the modal behavior on smaller screens
      onRowClick(course);
    }
  };

  return (
    <div className="relative overflow-x-auto  sm:rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Name</TableHead>
            <TableHead>Course Code</TableHead>
            <TableHead>No. of Students</TableHead>
            <TableHead className="hidden md:table-cell">Schedule</TableHead>
            <TableHead className="hidden lg:table-cell">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <CourseTableRow key={course.id} course={course} onRowClick={handleRowClick} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

