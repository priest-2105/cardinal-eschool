import type { Course } from "../types"
import { CourseTableRow } from "../coursetablerow/index"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/dashboard/student/ui/table"

interface CourseTableProps {
  courses: Course[]
}

export function CourseTable({ courses }: CourseTableProps) {
  return (
    <div className="relative h-[calc(90vh-200px)] scroll-smooth custom-scrollbar">
      {" "} 
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
      </Table>
      <div className="overflow-y-auto h-full scroll-smooth custom-scrollbar">
        <Table>
          <TableBody>
            {courses.map((course) => (
              <CourseTableRow key={course.id} course={course} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

