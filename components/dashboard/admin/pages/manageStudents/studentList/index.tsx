"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { getStudentList } from "@/lib/api/admin/managestudent/getstudentlist"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/admin/ui/alert"
import { Badge } from "@/components/ui/badge"

interface Student {
  id: string
  name: string
  email: string
  grade: number
  student_codec: string
  course: string
  dateJoined: string
  status: "Active" | "Suspended" | "Inactive"
  has_subscription: boolean
  edu_level: string | null
  subscription_plan: string | null
}

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [gradeFilter, setGradeFilter] = useState("0")
  const [courseFilter, setCourseFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [subscriptionFilter, setSubscriptionFilter] = useState<"all" | "subscribed" | "unsubscribed">("all")
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null)
  const token = useSelector((state: RootState) => state.auth?.token)
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      try {
        if (!token) throw new Error("Authentication token is missing")

        const hasSubscription =
          subscriptionFilter === "subscribed" ? true : subscriptionFilter === "unsubscribed" ? false : undefined

        const data = await getStudentList(token, hasSubscription, currentPage);
        setStudents(data.students);
        setTotalPages(data.pagination.last_page);
      } catch (error: any) {
        console.error("Failed to fetch students:", error.message)
        setAlert({ type: "danger", message: error.message })
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [token, subscriptionFilter, currentPage])

  const filterStudents = () => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesGrade = gradeFilter === "0" || student.grade === parseInt(gradeFilter)
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

  const filteredStudents = filterStudents()

  return (
    <div className="flex flex-col h-full">
      {alert && (
        <div className="fixed top-5 right-5 z-50">
          <Alert variant={alert.type} onClose={() => setAlert(null)}>
            <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">Manage Students</h2>
          <p className="text-sm text-muted-foreground">View and manage student accounts</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <Select value={gradeFilter} onValueChange={(value) => setGradeFilter(value)}>
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
            <Select value={subscriptionFilter} onValueChange={(value) => setSubscriptionFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Subscription Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="subscribed">Subscribed</SelectItem>
                <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
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
        {loading ? (
          <div className="text-center py-12 border rounded-lg">
          <p className="text-gray-500">Loading</p>
        </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
              <p className="text-gray-500">No Students Found</p>
            </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%]">Name</TableHead>
                    <TableHead className="w-[20%]">Email</TableHead>
                    <TableHead className="w-[15%]">Grade</TableHead>
                    <TableHead className="w-[15%]">Plan</TableHead>
                    <TableHead className="w-[10%]">Subscription</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="cursor-pointer hover:bg-gray-100" onClick={() => router.push(`/admin/student/${student.student_codec}`)}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell className="font-medium">{student.edu_level}</TableCell>
                      <TableCell className="font-medium">{student.subscription_plan}</TableCell>
                      <TableCell> 
                      <Badge variant={student.has_subscription ? "default" : "warning"}>
                      {student.has_subscription ? "Subscribed" : "Unsubscribed"}
                         </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
       <div className="flex justify-end items-center gap-4 py-4">
        <Select value={String(currentPage)} onValueChange={(value) => setCurrentPage(parseInt(value))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={`Page ${currentPage} of ${totalPages}`} />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <SelectItem key={page} value={String(page)}>
                Page {page}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}