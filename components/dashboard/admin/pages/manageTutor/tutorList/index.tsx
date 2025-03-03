"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import { AddTutorModal } from "./AddTutorModal"

interface Tutor {
  id: string
  name: string
  email: string
  subject: string
  dateJoined: string
  status: "Active" | "Suspended" | "Inactive"
}

const SAMPLE_TUTORS: Tutor[] = [
  {
    id: "TUT001",
    name: "John Doe",
    email: "john.doe@example.com",
    subject: "Mathematics",
    dateJoined: "2023-09-01",
    status: "Active",
  },
  {
    id: "TUT002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    subject: "Physics",
    dateJoined: "2023-08-15",
    status: "Active",
  },
  {
    id: "TUT003",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    subject: "Chemistry",
    dateJoined: "2023-09-10",
    status: "Suspended",
  },
]

export function TutorList() {
  const [tutors, setTutors] = useState<Tutor[]>(SAMPLE_TUTORS)
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [isAddTutorModalOpen, setIsAddTutorModalOpen] = useState(false)
  const router = useRouter()

  const filterTutors = () => {
    return tutors.filter((tutor) => {
      const matchesSearch =
        tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesSubject = subjectFilter === "all" || tutor.subject === subjectFilter

      let matchesDate = true
      if (dateFilter !== "all") {
        const joinDate = new Date(tutor.dateJoined)
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

      return matchesSearch && matchesSubject && matchesDate
    })
  }

  const handleRowClick = (tutorId: string) => {
    router.push(`/admin/tutor/${tutorId}`)
  }

  const handleAddTutor = (newTutor: Omit<Tutor, "id">) => {
    const id = `TUT${(tutors.length + 1).toString().padStart(3, "0")}`
    setTutors([...tutors, { ...newTutor, id }])
    setIsAddTutorModalOpen(false)
  }

  const filteredTutors = filterTutors()

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">Manage Tutors</h2>
          <Button onClick={() => setIsAddTutorModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Tutor
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                {/* Add more subjects as needed */}
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
              placeholder="Search tutors..."
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
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[16.67%]">Tutor ID</TableHead>
                    <TableHead className="w-[16.67%]">Name</TableHead>
                    <TableHead className="w-[16.67%]">Email</TableHead>
                    <TableHead className="w-[16.67%]">Subject</TableHead>
                    <TableHead className="w-[16.67%]">Date Joined</TableHead>
                    <TableHead className="w-[16.67%]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTutors.map((tutor) => (
                    <TableRow
                      key={tutor.id}
                      onClick={() => handleRowClick(tutor.id)}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <TableCell className="w-[16.67%]">{tutor.id}</TableCell>
                      <TableCell className="w-[16.67%]">{tutor.name}</TableCell>
                      <TableCell className="w-[16.67%]">{tutor.email}</TableCell>
                      <TableCell className="w-[16.67%]">{tutor.subject}</TableCell>
                      <TableCell className="w-[16.67%]">{tutor.dateJoined}</TableCell>
                      <TableCell className="w-[16.67%]">
                        <Button variant={tutor.status === "Active" ? "default" : "destructive"} size="sm">
                          {tutor.status}
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

      <AddTutorModal
        isOpen={isAddTutorModalOpen}
        onClose={() => setIsAddTutorModalOpen(false)}
        onAddTutor={handleAddTutor}
      />
    </div>
  )
}

