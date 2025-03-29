"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Eye, Edit, Trash2 } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateAssessmentModal } from "../createassessmentModal/index"
import { AssessmentModal } from "../assessmentModal/index"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { getClassAssignments } from "@/lib/api/tutor/courses/fetchasessments"
import { deleteAssessment } from "@/lib/api/tutor/courses/deleteassessment"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Assessment {
  id: number
  title: string
  description: string
  file_url: string
  deadline: string
  tutor: {
    name: string
  }
}

interface AssessmentListProps {
  classId: string
}

export default function AssessmentsList({ classId }: AssessmentListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const token = useSelector((state: RootState) => state.auth?.token)

  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const fetchAssessments = async () => {
    if (!token) return

    setLoading(true)
    try {
      const response = await getClassAssignments(token, classId)
      setAssessments(response.data.assignments)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch assignments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssessments()
  }, [classId, token])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
  }

  const handleViewAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment)
    setIsAssessmentModalOpen(true)
  }

  const handleDeleteAssessment = async (assessment: Assessment) => {
    if (!token) return
    
    try {
      await deleteAssessment(token, assessment.id)
      handleAssessmentSuccess("Assessment deleted successfully")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete assessment")
    }
  }

  const handleAssessmentSuccess = (message: string) => {
    setSuccessMessage(message)
    fetchAssessments() // Refresh the list
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  return (
    <div className="h-full flex flex-col">
      {successMessage && (
        <Alert 
          variant="success" 
          className="fixed top-4 right-4 z-50"
          onClose={() => setSuccessMessage(null)}
        >
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert 
          variant="danger" 
          className="fixed top-4 right-4 z-50"
          onClose={() => setError(null)}
        >
          <AlertDescription>
            {error === 'CONFIRM_DELETE' ? (
              <div className="flex flex-col gap-2">
                <p>Are you sure you want to delete this assessment?</p>
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setError(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => {
                      setError(null)
                      handleDeleteAssessment(selectedAssessment!)
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              error
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Assessments</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create Assessment
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
      </div>
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p>Loading assessments...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                <div>
                  <h3 className="font-medium">{assessment.title}</h3>
                  <p className="text-sm text-gray-500">{assessment.description}</p>
                  <p className="text-xs text-gray-400 flex items-center mt-1">
                    <Calendar size={12} className="mr-1" />
                    Due: {format(parseISO(assessment.deadline), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewAssessment(assessment)}
                >
                  <Eye size={16} className="mr-2" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSelectedAssessment(assessment)
                    setError('CONFIRM_DELETE')
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <AssessmentModal
        assessment={selectedAssessment}
        isOpen={isAssessmentModalOpen}
        onClose={() => {
          setIsAssessmentModalOpen(false)
          setSelectedAssessment(null)
        }}
      />
      <CreateAssessmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false)
          handleAssessmentSuccess("Assessment created successfully")
        }}
        classId={classId}
      />
    </div>
  )
}

