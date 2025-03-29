"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format, parseISO } from "date-fns"
import { Calendar, FileText, Users, Clock, Download } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { getAssignmentDetails } from "@/lib/api/tutor/courses/fetchsingleassessment"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Assessment {
  id: number;
  title: string;
  description: string;
  file_url: string;
  deadline: string;
  tutor: {
    name: string;
  };
}

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: Assessment | null;
}

export function AssessmentModal({ isOpen, onClose, assessment }: AssessmentModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [details, setDetails] = useState<any>(null)
  const token = useSelector((state: RootState) => state.auth?.token)

  useEffect(() => {
    const fetchDetails = async () => {
      if (!assessment?.id || !token) return
      
      setLoading(true)
      try {
        const response = await getAssignmentDetails(token, assessment.id)
        setDetails(response.data.assignment)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch assessment details")
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchDetails()
    }
  }, [assessment?.id, isOpen, token])

  if (!assessment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{assessment?.title}</DialogTitle>
        </DialogHeader>

        {error ? (
          <Alert variant="danger">{error}</Alert>
        ) : loading ? (
          <div className="flex items-center justify-center py-8">Loading details...</div>
        ) : details && (
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar size={16} />
                    <span>Due Date</span>
                  </div>
                  <p className="font-medium">
                    {format(parseISO(details.deadline), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Users size={16} />
                    <span>Students</span>
                  </div>
                  <p className="font-medium">
                    {details.submission_stats.submitted_students} / {details.submission_stats.total_students} Submitted
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Clock size={16} />
                    <span>Status</span>
                  </div>
                  <Progress 
                    value={(details.submission_stats.submitted_students / details.submission_stats.total_students) * 100} 
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Description</h3>
                  <p className="text-gray-600">{details.description}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Assignment File</h3>
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <a 
                      href={details.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2"
                    >
                      <Download size={16} />
                      Download Assignment
                    </a>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="submissions" className="mt-4">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Submission Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Students</span>
                      <span>{details.submission_stats.total_students}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Submitted</span>
                      <span className="text-green-600">
                        {details.submission_stats.submitted_students}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pending</span>
                      <span className="text-yellow-600">
                        {details.submission_stats.pending_students}
                      </span>
                    </div>
                    <Progress 
                      value={(details.submission_stats.submitted_students / details.submission_stats.total_students) * 100}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Student Submissions</h3>
                  {details.submissions.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No submissions yet</p>
                  ) : (
                    <div className="space-y-2">
                      {/* Add submissions list here when API provides the data */}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}

