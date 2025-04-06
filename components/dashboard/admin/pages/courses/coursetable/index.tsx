import type { Course } from "../types"
import { CourseTableRow } from "../coursetablerow/index"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/dashboard/admin/ui/table"

interface CourseTableProps {
  courses: Course[]
}

export function CourseTable({ courses }: CourseTableProps) {
  return (
    <div className="relative max-sm:h-[calc(85vh-200px)] sm:h-[calc(90vh-200px)] scroll-smooth custom-scrollbar">
      <div className="overflow-hidden border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">Course</TableHead>
              <TableHead className="w-[10%]">Tutor</TableHead>
              <TableHead className="w-[15%] hidden md:table-cell">No of Students</TableHead>
              <TableHead className="w-[25%] hidden lg:table-cell">Schedule</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[15%] hidden xl:table-cell">Date Added</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <div className="overflow-y-auto h-full max-h-[calc(90vh-250px)] scroll-smooth custom-scrollbar">
          <Table>
            <TableBody>
              {courses.map((course) => (
                <CourseTableRow key={course.id} course={course} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

