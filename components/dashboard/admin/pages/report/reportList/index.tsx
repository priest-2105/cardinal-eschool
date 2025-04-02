"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, FileText, Plus, Download, CheckCircle } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getClassReports } from "@/lib/api/admin/managecourses/fetchreport"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

export interface Student {
  id: string
  name: string
  dp_url?: string | null
}

export interface Report {
  id: number
  student_id: string
  report: string
  status: "pending" | "completed"
  month: string
  created_at: string
  updated_at: string
  student_name: string
  view_report: {
    download_url: string
  }
}

interface ReportListProps {
  classId: string
  courseDetails: {
    students?: Student[]
    students_assigned?: Student[]
  }
}

export default function ReportsList({ classId, students }: ReportListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [monthFilter, setMonthFilter] = useState("all")
  const [studentFilter, setStudentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const token = useSelector((state: RootState) => state.auth?.token)

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const fetchReports = async () => {
    if (!token) return

    setLoading(true)
    try {
      const response = await getClassReports(token, classId)
      setReports(response.data.reports)
      setFilteredReports(response.data.reports)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reports")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [classId, token])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    filterReports(term, monthFilter, statusFilter, studentFilter)
  }

  const handleMonthFilter = (value: string) => {
    setMonthFilter(value)
    filterReports(searchTerm, value, statusFilter, studentFilter)
  }

  const handleStudentFilter = (value: string) => {
    setStudentFilter(value)
    filterReports(searchTerm, monthFilter, statusFilter, value)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    filterReports(searchTerm, monthFilter, value, studentFilter)
  }

  const filterReports = (term: string, month: string, status: string, student: string) => {
    let result = reports.filter(
      (report) =>
        report.report.toLowerCase().includes(term.toLowerCase()) ||
        report.student_name.toLowerCase().includes(term.toLowerCase()),
    )

    if (month !== "all") {
      result = result.filter((report) => report.month === month)
    }

    if (status !== "all") {
      result = result.filter((report) => report.status === status)
    }

    if (student !== "all") {
      result = result.filter((report) => report.student_id === student)
    }

    setFilteredReports(result)
  }

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
    setIsViewModalOpen(true)
  }

  const handleApproveReport = async (reportId: number) => {
    if (!token) return

    try {
      // Implement the API call to approve the report
      // await approveReport(token, reportId);

      // For now, we'll just update the local state
      const updatedReports = reports.map((report) =>
        report.id === reportId ? { ...report, status: "completed" as const } : report,
      )

      setReports(updatedReports)
      setFilteredReports(
        filteredReports.map((report) =>
          report.id === reportId ? { ...report, status: "completed" as const } : report,
        ),
      )

      setSuccessMessage("Report approved successfully")

      // Close the modal if the approved report is the selected one
      if (selectedReport?.id === reportId) {
        setSelectedReport({ ...selectedReport, status: "completed" })
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve report")
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Success message */}
      {successMessage && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Student Reports</h2>
        {/* <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Report
        </Button> */}
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

        <Select value={monthFilter} onValueChange={handleMonthFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All months</SelectItem>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {students?.length > 1 && (
          <Select value={studentFilter} onValueChange={handleStudentFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All students</SelectItem>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p>Loading reports...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500">
          <p>{error}</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>No reports found</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => handleViewReport(report)}
            >
              <div className="mb-2 sm:mb-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{report.student_name}</h3>
                  <Badge
                    variant={report.status === "pending" ? "outline" : "default"}
                    className={
                      report.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-green-100 text-green-800 border-green-200"
                    }
                  >
                    {report.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">{report.report}</p>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-xs text-gray-400">
                    <Calendar size={12} className="inline mr-1" />
                    {format(parseISO(report.created_at), "MMM d, yyyy")}
                  </p>
                  <p className="text-xs text-gray-400">Month: {report.month}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewReport(report)
                  }}
                >
                  <FileText size={16} className="mr-2" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Report Modal */}
      <Dialog
        open={isViewModalOpen}
        onOpenChange={(open) => {
          if (!open) setIsViewModalOpen(false)
        }}
      >
        <DialogContent className="sm:max-w-[625px] bg-white">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle>Student Report</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-lg">{selectedReport.student_name}</h3>
                    <Badge
                      variant={selectedReport.status === "pending" ? "outline" : "default"}
                      className={
                        selectedReport.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : "bg-green-100 text-green-800 border-green-200"
                      }
                    >
                      {selectedReport.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">Month: {selectedReport.month}</div>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  Created: {format(parseISO(selectedReport.created_at), "MMM d, yyyy")}
                </div>

                <div className="mt-2">
                  <h4 className="text-sm font-medium mb-1">Report Content</h4>
                  <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-md">{selectedReport.report}</p>
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                {selectedReport.status === "pending" && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white sm:mr-auto"
                    onClick={() => handleApproveReport(selectedReport.id)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Report
                  </Button>
                )}

                <Button variant="outline" onClick={() => setIsViewModalOpen(false)} className="sm:ml-auto">
                  Close
                </Button>

                <Button asChild>
                  <a
                    href={selectedReport.view_report.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* <Download className="mr-2 h-4 w-4" /> */}
                    Download PDF
                  </a>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

