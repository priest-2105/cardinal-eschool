"use client"

import { TableCell, TableRow } from "@/components/ui/table"

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

interface CourseTableRowProps {
  course: Course;
  onRowClick?: (course: Course) => void;
}

export function CourseTableRow({ course, onRowClick }: CourseTableRowProps) {
  const handleRowClick = () => {
    if (onRowClick) {
      onRowClick(course);
    }
  };

  return (
    <TableRow className="hover:bg-gray-50 cursor-pointer" onClick={handleRowClick}>
      <TableCell>{course.name}</TableCell>
      <TableCell>{course.code}</TableCell>
      <TableCell>{course.no_of_students}</TableCell>
      <TableCell>
        {course.schedule.days.map((day, index) => (
          <div key={`${course.id}-${day}`}>
            {`${day} at ${course.schedule.time[index]}`}
          </div>
        ))}
      </TableCell>
    </TableRow>
  )
}

