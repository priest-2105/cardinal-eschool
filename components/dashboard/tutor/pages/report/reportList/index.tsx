"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, FileText, Plus, Edit } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateReportModal } from "../createReportModal/index"
import { ViewReportModal } from "../viewReportModal/index"
import { EditReportModal } from "../editReportModal/index"
import { Badge } from "@/components/ui/badge"
import { getClassReports } from "@/lib/api/tutor/courses/fetchreport"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import type { Report } from "@/lib/types/report";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export interface Student {
  id: string
  name: string
  email: string
}

interface ReportListProps {
  classId: string
  courseDetails: {
    students_assigned: {
      id: string
      name: string
      dp_url: string | null
    }[]
  }
}

export default function ReportsList({ classId, courseDetails }: ReportListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [monthFilter, setMonthFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const token = useSelector((state: RootState) => state.auth?.token)

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const fetchReports = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await getClassReports(token, classId);
      setReports(response.data.reports);
      setFilteredReports(response.data.reports);
      setError(null); // Clear any previous errors
    } catch (err) {
      if (err instanceof Error && err.message.includes("404")) {
        setError("No reports available");
        setReports([]);
        setFilteredReports([]);
      } else {
        setError(err instanceof Error ? err.message : "Failed to fetch reports");
      }
    } finally {
      setLoading(false);
    }
  }, [token, classId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    filterReports(term, monthFilter, statusFilter)
  }

  const handleMonthFilter = (value: string) => {
    setMonthFilter(value)
    filterReports(searchTerm, value, statusFilter)
  }

  const handleStudentFilter = () => {
    filterReports(searchTerm, monthFilter, statusFilter)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    filterReports(searchTerm, monthFilter, value)
  }

  const filterReports = (term: string, month: string, status: string) => {
    let result = reports.filter(
      (report) =>
        report.report.toLowerCase().includes(term.toLowerCase()),
    )

    if (month !== "all") {
      result = result.filter((report) => report.month === month)
    }

    if (status !== "all") {
      result = result.filter((report) => report.status === status)
    }

    setFilteredReports(result)
  }

  const handleCreateReport = () => {
    setIsCreateModalOpen(false);
    fetchReports();
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
    setIsViewModalOpen(true)
  }

  const handleEditReport = (report: Report) => {
    setSelectedReport(report)
    setIsEditModalOpen(true)
  }

  const handleAssessmentSuccess = (message: string) => {
    console.log(message)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">Student Reports</h2>
        <Button className="w-full sm:w-auto" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Report
        </Button>
      </div>

      {/* Filters for Mobile */}
      <div className="sm:hidden mb-4">
        <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Filters
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white rounded-md max-w-[600px] w-[90%]">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full"
              />
              <Select onValueChange={handleMonthFilter} defaultValue="all">
                <SelectTrigger className="w-full">
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
              {courseDetails.students_assigned.length > 1 && (
                <Select onValueChange={handleStudentFilter} defaultValue="all">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All students</SelectItem>
                    {courseDetails.students_assigned.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Select onValueChange={handleStatusFilter} defaultValue="all">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="default"
                className="w-full mt-4"
                onClick={() => setIsFilterModalOpen(false)}
              >
                Apply
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters for Desktop */}
      <div className="hidden sm:flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
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
        <Select onValueChange={handleMonthFilter} defaultValue="all">
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
        {courseDetails.students_assigned.length > 1 && (
          <Select onValueChange={handleStudentFilter} defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All students</SelectItem>
              {courseDetails.students_assigned.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Select onValueChange={handleStatusFilter} defaultValue="all">
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
          <div className="space-y-4">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-100 rounded-lg animate-pulse"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
                <div className="flex space-x-2 mt-2 sm:mt-0">
                  <div className="h-8 w-20 bg-gray-300 rounded"></div>
                  <div className="h-8 w-20 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>{error}</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="mb-2 sm:mb-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">
                    {report.student_name}
                  </h3>
                  <Badge variant={report.status === "pending" ? "warning" : "success"}>
                    {report.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">{report.report}</p>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-xs text-gray-400">
                    <Calendar size={12} className="inline mr-1" />
                    {report.created_at}
                  </p>
                  <p className="text-xs text-gray-400">
                    Month: {report.month}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
                <Button className="mr-2" variant="outline" size="sm" onClick={() => handleViewReport(report)}>
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
      )}
      <CreateReportModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateReport} 
        classId={classId}
        students={courseDetails.students_assigned}
      />
      <ViewReportModal
        report={selectedReport} 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        students={courseDetails.students_assigned}
      />
      <EditReportModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          setIsEditModalOpen(false)
          handleAssessmentSuccess("Report updated successfully")
          fetchReports() // Refresh the list after update
        }}
        report={selectedReport}
        classId={classId}
      />
    </div>
  )
}

