"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, FileText, CheckCircle, Clock, Plus, Edit } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AssessmentModal } from "../assessmentModal/index"
import { CreateAssessmentModal } from "../createassessmentModal/index"
import { EditAssessmentModal } from "../editAssessmentModal/index"
import type { Assessment } from "../types" 

export interface Student {
  id: string
  name: string
  email: string
}

const SAMPLE_STUDENTS: Student[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com" },
  { id: "2", name: "Bob Smith", email: "bob@example.com" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com" },
]

const SAMPLE_ASSESSMENTS: Assessment[] = [
  {
    id: "1",
    topic: "Scientific Method Essay",
    subject: "Basic Science",
    dueDate: new Date(2023, 7, 15),
    status: "pending",
    description:
      "Write a 500-word essay explaining the steps of the scientific method and provide an example of its application.",
    studentIds: ["1"],
  },
  {
    id: "2",
    topic: "Energy Conservation Lab Report",
    subject: "Physics",
    dueDate: new Date(2023, 7, 20),
    status: "submitted",
    description: "Complete the lab report for the energy conservation experiment conducted in class.",
    submittedFile: "energy_conservation_report.pdf",
    studentIds: ["2"],
  },
]

export default function AssessmentsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [assessments, setAssessments] = useState(SAMPLE_ASSESSMENTS)
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [studentFilter, setStudentFilter] = useState("all")
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    filterAssessments(term, statusFilter, dateFilter, studentFilter)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    filterAssessments(searchTerm, value, dateFilter, studentFilter)
  }

  const handleDateFilter = (value: string) => {
    setDateFilter(value)
    filterAssessments(searchTerm, statusFilter, value, studentFilter)
  }

  const handleStudentFilter = (value: string) => {
    setStudentFilter(value)
    filterAssessments(searchTerm, statusFilter, dateFilter, value)
  }

  const filterAssessments = (term: string, status: string, date: string, student: string) => {
    let filteredAssessments = SAMPLE_ASSESSMENTS.filter(
      (assessment) =>
        assessment.topic.toLowerCase().includes(term.toLowerCase()) ||
        assessment.subject.toLowerCase().includes(term.toLowerCase()),
    )

    if (status !== "all") {
      filteredAssessments = filteredAssessments.filter((assessment) => assessment.status === status)
    }

    if (student !== "all") {
      filteredAssessments = filteredAssessments.filter((assessment) => assessment.studentIds.includes(student))
    }

    const now = new Date()
    switch (date) {
      case "week":
        filteredAssessments = filteredAssessments.filter(
          (assessment) => assessment.dueDate <= new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
        )
        break
      case "month":
        filteredAssessments = filteredAssessments.filter(
          (assessment) => assessment.dueDate <= new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()),
        )
        break
      case "year":
        filteredAssessments = filteredAssessments.filter(
          (assessment) => assessment.dueDate <= new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
        )
        break
    }

    setAssessments(filteredAssessments)
  }

  const handleViewAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment)
    setIsAssessmentModalOpen(true)
  }

  const handleEditAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment)
    setIsEditModalOpen(true)
  }

  const handleCloseAssessmentModal = () => {
    setIsAssessmentModalOpen(false)
    setSelectedAssessment(null)
  }

  const handleGradeAssessment = (id: string, grade: number) => {
    const updatedAssessments = assessments.map((assessment) =>
      assessment.id === id ? { ...assessment, status: "graded" as const, grade } : assessment,
    )
    setAssessments(updatedAssessments)
    console.log(`Assessment ID: ${id} graded with ${grade}`)
  }

  const handleCreateAssessment = (newAssessments: Omit<Assessment, "id">[]) => {
    const createdAssessments = newAssessments.map((assessment, index) => ({
      ...assessment,
      id: (assessments.length + index + 1).toString(),
    }))
    setAssessments([...assessments, ...createdAssessments])
    setIsCreateModalOpen(false)
  }

  const handleUpdateAssessment = (updatedAssessment: Assessment) => {
    const updatedAssessments = assessments.map((assessment) =>
      assessment.id === updatedAssessment.id ? updatedAssessment : assessment,
    )
    setAssessments(updatedAssessments)
    setIsEditModalOpen(false)
  }

  const handleDeleteAssessment = (id: string) => {
    const updatedAssessments = assessments.filter((assessment) => assessment.id !== id)
    setAssessments(updatedAssessments)
    setIsEditModalOpen(false)
  }

  return ( 
   <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Assessments</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Assessment
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search assessments..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <Select onValueChange={handleStatusFilter} defaultValue="all">
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="graded">Graded</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleDateFilter} defaultValue="all">
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Due Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleStudentFilter} defaultValue="all">
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Student" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            {SAMPLE_STUDENTS.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
        {assessments.map(
          (assessment) =>
            (
              <div
            key={assessment.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-4 mb-2 sm:mb-0">
              {assessment.status === "graded" ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : assessment.status === "submitted" ? (
                <FileText className="text-blue-500" size={24} />
              ) : (
                <Clock className="text-yellow-500" size={24} />
              )}
              <div>
                <h3 className="font-medium">{assessment.topic}</h3>
                <p className="text-sm text-gray-500">{assessment.subject}</p>
                <p className="text-xs text-gray-400 flex items-center mt-1">
                  <Calendar size={12} className="mr-1" />
                  Due: {format(assessment.dueDate, "MMM d, yyyy")}
                </p>
                <p>
                  Due: {format(assessment.dueDate, "MMM d, yyyy")}
                </p>
                <p className="text-xs text-gray-400 flex items-center mt-1">
                  Students:{" "}
                  {assessment.studentIds.map((id) => SAMPLE_STUDENTS.find((s) => s.id === id)?.name).join(", ")}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
              <Badge
                variant={
                  assessment.status === "graded" ? "success" : assessment.status === "submitted" ? "info" : "warning"
                }
              >
                {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => handleViewAssessment(assessment)}>
                <FileText size={16} className="mr-2" />
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEditAssessment(assessment)}>
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
            </div>
          </div>
            ),
        )}
      </div>
      <AssessmentModal
        assessment={selectedAssessment}
        isOpen={isAssessmentModalOpen}
        onClose={handleCloseAssessmentModal}
        onGrade={handleGradeAssessment}
        students={SAMPLE_STUDENTS}
      />
      <CreateAssessmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAssessment}
        students={SAMPLE_STUDENTS}
      />
      <EditAssessmentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateAssessment}
        onDelete={handleDeleteAssessment}
        assessment={selectedAssessment}
        students={SAMPLE_STUDENTS}
      />
    </div>
  )
}

