"use client"

import type React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Eye, Download, Upload } from "lucide-react"
import { format, parseISO, isToday, startOfWeek, startOfMonth, isWithinInterval } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { getClassAssignments } from "@/lib/api/student/courses/fetchasessments"
import { submitAssignment } from "@/lib/api/student/courses/turninassessment"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Assignment {
  id: number
  title: string
  description: string
  file_path: string
  deadline: string
  tutor_id: string
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
  const [isTurnInModalOpen, setIsTurnInModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState("most_recent")
  const [submissionText, setSubmissionText] = useState("")
  const [submissionFile, setSubmissionFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
  }, [classId, token])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleViewAssessment = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setIsAssessmentModalOpen(true)
  }

  const handleTurnInAssessment = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setSubmissionText("")
    setSubmissionFile(null)
    setIsTurnInModalOpen(true)
  }

  const handleCloseAssessmentModal = () => {
    setIsAssessmentModalOpen(false)
    setSelectedAssignment(null)
  }

  const handleCloseTurnInModal = () => {
    setIsTurnInModalOpen(false)
    setSelectedAssignment(null)
    setSubmissionText("")
    setSubmissionFile(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSubmissionFile(e.target.files[0])
    }
  }

  const handleSubmitAssignment = async () => {
    if (!token || !selectedAssignment) return

    if (!submissionText.trim() && !submissionFile) {
      setError("Please provide either a text submission or upload a file")
      return
    }

    setIsSubmitting(true)
    
    try {
      // const response = await submitAssignment(
      //   token,
      //   selectedAssignment.id.toString(),
      //   submissionText,
      //   submissionFile
      // )
      
      setSuccessMessage("Assignment submitted successfully!")
      handleCloseTurnInModal()
      
      // Refresh assignments list after submission
      fetchAssignments()
      
      // Clear the success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit assignment")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if an assignment is overdue
  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date()
  }

  // Sort and filter the assignments
  const filteredAndSortedAssignments = useMemo(() => {
    // First apply search filter
    let filtered = assignments.filter(
      (assignment) =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Apply status filter
    if (statusFilter !== "all") {
      // const now = new Date()
      if (statusFilter === "overdue") {
        filtered = filtered.filter(assignment => isOverdue(assignment.deadline))
      } else if (statusFilter === "pending") {
        filtered = filtered.filter(assignment => !isOverdue(assignment.deadline))
      }
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date()
      if (dateFilter === "today") {
        filtered = filtered.filter(assignment => isToday(new Date(assignment.deadline)))
      } else if (dateFilter === "this_week") {
        const weekStart = startOfWeek(now)
        filtered = filtered.filter(assignment => 
          isWithinInterval(new Date(assignment.deadline), { 
            start: weekStart, 
            end: now 
          })
        )
      } else if (dateFilter === "this_month") {
        const monthStart = startOfMonth(now)
        filtered = filtered.filter(assignment => 
          isWithinInterval(new Date(assignment.deadline), { 
            start: monthStart, 
            end: now 
          })
        )
      }
    }

    // Finally sort the results
    return filtered.sort((a, b) => {
      const dateA = new Date(a.deadline).getTime()
      const dateB = new Date(b.deadline).getTime()
      return sortOrder === "most_recent" ? dateB - dateA : dateA - dateB
    })
  }, [assignments, searchTerm, statusFilter, dateFilter, sortOrder])

  // Calculate stats
  // const stats = useMemo(() => {
    // const now = new Date()
    const total = assignments.length
    const overdue = assignments.filter(assignment => isOverdue(assignment.deadline)).length
    const pending = total - overdue
    
    return {
      total,
      overdue,
      pending,
      turned_in: 0, // Not available in the API data
      percentage_turned_in: 0 // Not available in the API data
    }
  }, [assignments])

  // Helper function to get filename from path
  const getFileName = (path: string) => {
    const parts = path.split("/")
    return parts[parts.length - 1]
  }

  return (
    <div className="h-full flex flex-col">
      {/* Success message */}
      {successMessage && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

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
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="most_recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assignments list */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1BC2C2] mr-3"></div>
          <p>Loading assessments...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500">
          <p>{error}</p>
        </div>
      ) : filteredAndSortedAssignments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>{searchTerm || statusFilter !== "all" || dateFilter !== "all" 
              ? "No assessments match your filters" 
              : "No assessments found"}</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
          {filteredAndSortedAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => handleViewAssessment(assignment)}
            >
              <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                <div>
                  <h3 className="font-medium">{assignment.title}</h3>
                  <p className="text-sm text-gray-500">{assignment.description}</p>
                  <p className={`text-xs flex items-center mt-1 ${
                    isOverdue(assignment.deadline) ? 'text-red-500' : 'text-gray-400'
                  }`}>
                    <Calendar size={12} className="mr-1" />
                    Due: {format(parseISO(assignment.deadline), "MMM d, yyyy HH:mm")}
                    {isOverdue(assignment.deadline) && " (Overdue)"}
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
                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTurnInAssessment(assignment)
                  }}
                >
                  <Upload size={16} className="mr-2" />
                  Turn In
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assessment View Modal */}
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
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  Due: {format(parseISO(selectedAssignment.deadline), "MMM d, yyyy HH:mm")}
                  {isOverdue(selectedAssignment.deadline) && (
                    <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
                      Overdue
                    </Badge>
                  )}
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseAssessmentModal}>
                  Close
                </Button>
                <Button onClick={() => {
                  handleCloseAssessmentModal();
                  handleTurnInAssessment(selectedAssignment);
                }}>
                  Turn In Assignment
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Turn In Assignment Modal */}
      <Dialog open={isTurnInModalOpen} onOpenChange={handleCloseTurnInModal}>
        <DialogContent className="sm:max-w-[625px] bg-white">
          {selectedAssignment && (
            <>
              <DialogHeader>
                <DialogTitle>Turn In Assignment: {selectedAssignment.title}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  Due: {format(parseISO(selectedAssignment.deadline), "MMM d, yyyy HH:mm")}
                  {isOverdue(selectedAssignment.deadline) && (
                    <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
                      Overdue
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="submissionText">Your Submission</Label>
                  <Textarea
                    id="submissionText"
                    placeholder="Enter your submission text here..."
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="submissionFile">Upload File (optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="submissionFile"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                  </div>
                  {submissionFile && (
                    <p className="text-xs text-green-600">
                      Selected file: {submissionFile.name} ({(submissionFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseTurnInModal} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitAssignment} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Assignment"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

