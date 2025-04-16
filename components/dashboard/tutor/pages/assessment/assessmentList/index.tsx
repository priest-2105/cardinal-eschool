"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Eye, Trash2 } from "lucide-react"
import { format, parseISO } from "date-fns"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateAssessmentModal } from "../createassessmentModal/index"
import { AssessmentModal } from "../assessmentModal/index"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { getClassAssignments } from "@/lib/api/tutor/courses/fetchasessments"
import { deleteAssessment } from "@/lib/api/tutor/courses/deleteassessment"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const fetchAssessments = useCallback(async () => {
    if (!token) return

    setLoading(true)
    try {
      const response = await getClassAssignments(token, classId)
      setAssessments(response.data.assignments)
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch assignments")
    } finally {
      setLoading(false); // Ensure loading is set to false
    }
  }, [token, classId])

  useEffect(() => {
    fetchAssessments()
  }, [fetchAssessments])

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
          className="fixed top-8 bg-white right-4 z-50"
          onClose={() => setSuccessMessage(null)}
        >
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this assessment. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteAssessment(selectedAssessment!)
                setShowDeleteAlert(false)
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
        <div className="flex-1 flex items-center justify-center">
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
                    setShowDeleteAlert(true)
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

