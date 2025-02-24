import type { Course } from "../types"
import { CourseTableRow } from "../coursetablerow/index"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/dashboard/tutor/ui/table"

interface CourseTableProps {
  courses: Course[]
}

export function CourseTable({ courses }: CourseTableProps) {
  return (
    <div className="relative max-sm:h-[calc(85vh-200px)] sm:h-[calc(90vh-200px)] scroll-smooth custom-scrollbar">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3 md:w-1/4">Class</TableHead>
            <TableHead className="hidden md:table-cell">Tutor Assigned</TableHead>
            <TableHead className="hidden lg:table-cell">Schedule</TableHead>
            <TableHead className="w-1/3 md:w-1/4">Status</TableHead>
            <TableHead className="hidden xl:table-cell">Date Added</TableHead>
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

