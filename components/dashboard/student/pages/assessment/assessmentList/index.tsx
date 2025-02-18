"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, FileText, CheckCircle, Clock } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AssessmentModal } from "../assessmentModal"

interface Assessment {
  id: string
  title: string
  subject: string
  dueDate: Date
  status: "done" | "pending"
  description?: string
  submittedFile?: string
}

const SAMPLE_ASSESSMENTS: Assessment[] = [
  {
    id: "1",
    title: "Scientific Method Essay",
    subject: "Basic Science",
    dueDate: new Date(2023, 7, 15),
    status: "pending",
    description:
      "Write a 500-word essay explaining the steps of the scientific method and provide an example of its application.",
  },
  {
    id: "2",
    title: "Energy Conservation Lab Report",
    subject: "Physics",
    dueDate: new Date(2023, 7, 20),
    status: "done",
    description: "Complete the lab report for the energy conservation experiment conducted in class.",
    submittedFile: "energy_conservation_report.pdf",
  },
  {
    id: "3",
    title: "Ecosystem Diagram",
    subject: "Biology",
    dueDate: new Date(2023, 7, 25),
    status: "pending",
    description:
      "Create a detailed diagram of a local ecosystem, identifying at least 10 different organisms and their interactions.",
  },
  {
    id: "4",
    title: "Solar System Quiz",
    subject: "Astronomy",
    dueDate: new Date(2023, 8, 1),
    status: "pending",
    description: "Complete the online quiz about the solar system. The quiz will cover all planets and major moons.",
  },
  {
    id: "5",
    title: "Chemical Reactions Worksheet",
    subject: "Chemistry",
    dueDate: new Date(2023, 8, 5),
    status: "done",
    description: "Complete the worksheet on balancing chemical equations and identifying types of reactions.",
    submittedFile: "chemical_reactions_worksheet.pdf",
  },
  {
    id: "6",
    title: "Chemical Reactions Worksheet",
    subject: "Chemistry",
    dueDate: new Date(2023, 8, 5),
    status: "done",
    description: "Complete the worksheet on balancing chemical equations and identifying types of reactions.",
    submittedFile: "chemical_reactions_worksheet.pdf",
  },
  {
    id: "7",
    title: "Chemical Reactions Worksheet",
    subject: "Chemistry",
    dueDate: new Date(2023, 8, 5),
    status: "done",
    description: "Complete the worksheet on balancing chemical equations and identifying types of reactions.",
    submittedFile: "chemical_reactions_worksheet.pdf",
  },
]

export default function AssessmentsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [assessments, setAssessments] = useState(SAMPLE_ASSESSMENTS)
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    filterAssessments(term, statusFilter, dateFilter)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    filterAssessments(searchTerm, value, dateFilter)
  }

  const handleDateFilter = (value: string) => {
    setDateFilter(value)
    filterAssessments(searchTerm, statusFilter, value)
  }

  const filterAssessments = (term: string, status: string, date: string) => {
    let filteredAssessments = SAMPLE_ASSESSMENTS.filter(
      (assessment) =>
        assessment.title.toLowerCase().includes(term.toLowerCase()) ||
        assessment.subject.toLowerCase().includes(term.toLowerCase()),
    )

    if (status !== "all") {
      filteredAssessments = filteredAssessments.filter((assessment) => assessment.status === status)
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
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedAssessment(null)
  }

  const handleSubmitAssessment = (id: string, file: File) => {
    const updatedAssessments = assessments.map((assessment) =>
      assessment.id === id ? { ...assessment, status: "done" as const, submittedFile: file.name } : assessment,
    )
    setAssessments(updatedAssessments)
    console.log(`File "${file.name}" uploaded for assessment ID: ${id}`)
  }

  return (
    <div className="h-full flex flex-col">
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
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
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
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
        {assessments.map((assessment) => (
          <div
            key={assessment.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-4 mb-2 sm:mb-0">
              {assessment.status === "done" ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <Clock className="text-yellow-500" size={24} />
              )}
              <div>
                <h3 className="font-medium">{assessment.title}</h3>
                <p className="text-sm text-gray-500">{assessment.subject}</p>
                <p className="text-xs text-gray-400 flex items-center mt-1">
                  <Calendar size={12} className="mr-1" />
                  Due: {format(assessment.dueDate, "MMM d, yyyy")}
                </p>
                {assessment.submittedFile && (
                  <p className="text-xs text-gray-400 flex items-center mt-1">
                    <FileText size={12} className="mr-1" />
                    Submitted: {assessment.submittedFile}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
            <Badge variant={assessment.status === "done" ? "success" : "warning"}>
            {assessment.status === "done" ? "Completed" : "Pending"}
          </Badge>
              <Button variant="outline" size="sm" onClick={() => handleViewAssessment(assessment)}>
                <FileText size={16} className="mr-2" />
                {assessment.status === "done" ? "View" : "Submit"}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <AssessmentModal
        assessment={selectedAssessment}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitAssessment}
      />
    </div>
  )
}

