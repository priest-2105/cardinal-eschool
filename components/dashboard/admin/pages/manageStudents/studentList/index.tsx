"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  grade: number
  course: string
  dateJoined: string
  status: "Active" | "Suspended" | "Inactive"
}

const SAMPLE_STUDENTS: Student[] = [
  {
    id: "STU001",
    name: "John Doe",
    email: "john.doe@example.com",
    grade: 1,
    course: "Mathematics",
    dateJoined: "2023-09-01",
    status: "Active",
  },
  {
    id: "STU002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    grade: 12,
    course: "Physics",
    dateJoined: "2023-08-15",
    status: "Active",
  },
  {
    id: "STU003",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    grade: 3,
    course: "Chemistry",
    dateJoined: "2023-09-10",
    status: "Suspended",
  }, 
]

export function StudentList() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [students, _setStudents] = useState<Student[]>(SAMPLE_STUDENTS)
  const [searchQuery, setSearchQuery] = useState("")
  const [gradeFilter, setGradeFilter] = useState(1)
  const [courseFilter, setCourseFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const router = useRouter()

  const filterStudents = () => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesGrade = gradeFilter === 1 || student.grade === gradeFilter
      const matchesCourse = courseFilter === "all" || student.course === courseFilter

      let matchesDate = true
      if (dateFilter !== "all") {
        const joinDate = new Date(student.dateJoined)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - joinDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (dateFilter === "last30") {
          matchesDate = diffDays <= 30
        } else if (dateFilter === "last90") {
          matchesDate = diffDays <= 90
        } else if (dateFilter === "last365") {
          matchesDate = diffDays <= 365
        }
      }

      return matchesSearch && matchesGrade && matchesCourse && matchesDate
    })
  }

  const handleRowClick = () => {
    router.push(`/admin/student`)
  }

  const filteredStudents = filterStudents()

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">Manage Students</h2>
          <p className="text-sm text-muted-foreground">View and manage student accounts</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Grades</SelectItem>
                <SelectItem value="1">Grade 1</SelectItem>
                <SelectItem value="2">Grade 2</SelectItem>
                <SelectItem value="3">Grade 3</SelectItem>
                <SelectItem value="4">Grade 4</SelectItem>
                <SelectItem value="5">Grade 5</SelectItem>
                <SelectItem value="6">Grade 6</SelectItem>
                <SelectItem value="7">Grade 7</SelectItem>
                <SelectItem value="8">Grade 8</SelectItem>
                <SelectItem value="9">Grade 9</SelectItem>
                <SelectItem value="10">Grade 10</SelectItem>
              </SelectContent>
            </Select>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                {/* Add more courses as needed */}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Date Joined" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="last30">Last 30 Days</SelectItem>
                <SelectItem value="last90">Last 90 Days</SelectItem>
                <SelectItem value="last365">Last 365 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[15%]">Student ID</TableHead>
                  <TableHead className="w-[20%]">Name</TableHead>
                  <TableHead className="w-[20%]">Email</TableHead>
                  <TableHead className="w-[10%]">Grade</TableHead>
                  <TableHead className="w-[15%]">Course</TableHead>
                  <TableHead className="w-[10%]">Date Joined</TableHead>
                  <TableHead className="w-[10%]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow
                    key={student.id}
                    onClick={() => handleRowClick(student.id)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <TableCell className="font-medium">{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>{student.dateJoined}</TableCell>
                    <TableCell>
                      <Button variant={student.status === "Active" ? "default" : "danger"} size="sm">
                        {student.status}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

