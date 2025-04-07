"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Eye, Download } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { getClassAssignments } from "@/lib/api/admin/managecourses/fetchasessments"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Assignment {
  id: number
  title: string
  description: string
  deadline: string
  file_path: string
  tutor_id: string
  tutor_name: string
  submissions: {
    total: number
    turned_in: number
    pending: number
    overdue: number
  }
  created_at: string
  updated_at: string
}

interface AssessmentListProps {
  classId: string
}

export default function AssessmentsList({ classId }: AssessmentListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const token = useSelector((state: RootState) => state.auth?.token)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Stats derived from assignments
  const stats = {
    total: assignments.length,
    turned_in: assignments.reduce((acc, curr) => acc + curr.submissions.turned_in, 0),
    pending: assignments.reduce((acc, curr) => acc + curr.submissions.pending, 0),
    overdue: assignments.reduce((acc, curr) => acc + curr.submissions.overdue, 0),
    percentage_turned_in:
      assignments.length > 0
        ? Math.round(
            (assignments.reduce((acc, curr) => acc + curr.submissions.turned_in, 0) / assignments.length) * 100,
          )
        : 0,
  }

  const fetchAssignments = async () => {
    if (!token) return

    setLoading(true)
    try {
      const response = await getClassAssignments(token, classId)
      setAssignments(response.data.assignments)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch assignments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, [classId, token, fetchAssignments])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleViewAssessment = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setIsAssessmentModalOpen(true)
  }

  const handleCloseAssessmentModal = () => {
    setIsAssessmentModalOpen(false)
    setSelectedAssignment(null)
  }

  // Filter assignments based on search term
  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Helper function to get filename from path
  const getFileName = (path: string) => {
    const parts = path.split("/")
    return parts[parts.length - 1]
  }

  return (
    <div className="h-full flex flex-col">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total</CardTitle>
            <CardDescription className="text-2xl font-bold">{stats.total}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Turned In</CardTitle>
            <CardDescription className="text-2xl font-bold text-green-600">{stats.turned_in}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
            <CardDescription className="text-2xl font-bold text-yellow-600">{stats.pending}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Overdue</CardTitle>
            <CardDescription className="text-2xl font-bold text-red-600">{stats.overdue}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Success message */}
      {successMessage && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Header and Create button */}
      {/* <div className="flex justify-between items-center mb-4"> */}
        {/* <h2 className="text-2xl font-bold">Assessments</h2> */}
        {/* <Button onClick={() => setIsCreateModalOpen(true)}>Create Assessment</Button> */}
      {/* </div> */}

      {/* Search and filters */}
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="turned_in">Turned In</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assignments list */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p>Loading assessments...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500">
          <p>{error}</p>
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>No assessments found</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => handleViewAssessment(assignment)}
            >
              <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                <div>
                  <h3 className="font-medium">{assignment.title}</h3>
                  <p className="text-sm text-gray-500">{assignment.description}</p>
                  <p className="text-xs text-gray-400 flex items-center mt-1">
                    <Calendar size={12} className="mr-1" />
                    Due: {format(parseISO(assignment.deadline), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewAssessment(assignment)
                  }}
                >
                  <Eye size={16} className="mr-2" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assessment Modal */}
      <Dialog open={isAssessmentModalOpen} onOpenChange={handleCloseAssessmentModal}>
        <DialogContent className="sm:max-w-[625px] bg-white">
          {selectedAssignment && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedAssignment.title}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Assignment
                  </Badge>
                  <span className="text-sm text-gray-500">Created by: {selectedAssignment.tutor_name}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  Due: {format(parseISO(selectedAssignment.deadline), "MMM d, yyyy HH:mm")}
                </div>
                <div className="mt-2">
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-gray-700">{selectedAssignment.description}</p>
                </div>

                {selectedAssignment.file_path && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">Attachment</h4>
                    <div className="flex items-center gap-2">
                      <a
                        href={selectedAssignment.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {getFileName(selectedAssignment.file_path)}
                      </a>
                    </div>
                  </div>
                )}

                <div className="mt-2">
                  <h4 className="text-sm font-medium mb-1">Submission Statistics</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Total:</span> {selectedAssignment.submissions.total}
                    </div>
                    <div>
                      <span className="text-gray-500">Turned In:</span> {selectedAssignment.submissions.turned_in}
                    </div>
                    <div>
                      <span className="text-gray-500">Pending:</span> {selectedAssignment.submissions.pending}
                    </div>
                    <div>
                      <span className="text-gray-500">Overdue:</span> {selectedAssignment.submissions.overdue}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseAssessmentModal}>
                  Close
                </Button>
                {selectedAssignment.file_path && (
                  <Button asChild>
                    <a
                      href={selectedAssignment.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Download Assignment
                    </a>
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

