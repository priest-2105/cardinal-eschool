"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, FileText, Plus, Edit } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" 
import { ViewReportModal } from "../viewStudentReportModal/index" 

export interface Student {
  id: string
  name: string
  email: string
}
 

export interface Report {
  id: string
  title: string
  subject: string
  grade: string
  dateSubmitted: Date
  studentId: string
  content: string
}

const SAMPLE_STUDENTS: Student[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com" },
  { id: "2", name: "Bob Smith", email: "bob@example.com" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com" },
]

const SAMPLE_REPORTS: Report[] = [
  {
    id: "1",
    title: "Midterm Exam Results",
    subject: "Basic Science",
    grade: "A",
    dateSubmitted: new Date(2024, 5, 15),
    studentId: "1",
    content: "Alice demonstrated excellent understanding of basic scientific principles...",
  },
  {
    id: "2",
    title: "Lab Report: Energy Conservation",
    subject: "Physics",
    grade: "B+",
    dateSubmitted: new Date(2025, 6, 1),
    studentId: "2",
    content: "Bob's lab report on energy conservation showed good analytical skills...",
  },
]

export default function ReportsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [reports, setReports] = useState(SAMPLE_REPORTS)
  const [dateFilter, setDateFilter] = useState("all")
  const [studentFilter, setStudentFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    filterReports(term, dateFilter, studentFilter)
  }

  const handleDateFilter = (value: string) => {
    setDateFilter(value)
    filterReports(searchTerm, value, studentFilter)
  }

  const handleStudentFilter = (value: string) => {
    setStudentFilter(value)
    filterReports(searchTerm, dateFilter, value)
  }

  const handleDeleteReport = (id: string) => {
    const updatedReports = reports.filter((report) => report.id !== id)
    setReports(updatedReports)
    setIsEditModalOpen(false)
  }

  const filterReports = (term: string, date: string, student: string) => {
    let filteredReports = SAMPLE_REPORTS.filter(
      (report) =>
        report.title.toLowerCase().includes(term.toLowerCase()) ||
        report.subject.toLowerCase().includes(term.toLowerCase()),
    )

    if (student !== "all") {
      filteredReports = filteredReports.filter((report) => report.studentId === student)
    }

    const now = new Date()
    switch (date) {
      case "week":
        filteredReports = filteredReports.filter(
          (report) => report.dateSubmitted >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        )
        break
      case "month":
        filteredReports = filteredReports.filter(
          (report) => report.dateSubmitted >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
        )
        break
      case "year":
        filteredReports = filteredReports.filter(
          (report) => report.dateSubmitted >= new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        )
        break
    }

    setReports(filteredReports)
  }

  const handleCreateReport = (newReport: Omit<Report, "id">) => {
    const id = (reports.length + 1).toString()
    setReports([...reports, { ...newReport, id }])
    setIsCreateModalOpen(false)
  }

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
    setIsViewModalOpen(true)
  }

  const handleEditReport = (report: Report) => {
    setSelectedReport(report)
    setIsEditModalOpen(true)
  }

  const handleUpdateReport = (updatedReport: Report) => {
    const updatedReports = reports.map((report) => (report.id === updatedReport.id ? updatedReport : report))
    setReports(updatedReports)
    setIsEditModalOpen(false)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Student Reports</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Report
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <Select onValueChange={handleDateFilter} defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="week">Past week</SelectItem>
            <SelectItem value="month">Past month</SelectItem>
            <SelectItem value="year">Past year</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleStudentFilter} defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by student" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All students</SelectItem>
            {SAMPLE_STUDENTS.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="mb-2 sm:mb-0">
              <h3 className="font-medium">{report.title}</h3>
              <p className="text-sm text-gray-500">
                {report.subject} • Grade: {report.grade}
              </p>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Calendar size={12} className="mr-1" />
                {format(report.dateSubmitted, "MMM d, yyyy")}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Student: {SAMPLE_STUDENTS.find((s) => s.id === report.studentId)?.name}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
              <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>
                <FileText size={16} className="mr-2" />
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEditReport(report)}>
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div> 
      <ViewReportModal
        report={selectedReport}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        students={SAMPLE_STUDENTS}
      />
     
    </div>
  )
}

