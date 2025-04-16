"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { getAssignmentDetails } from "@/lib/api/tutor/courses/fetchsingleassessment";
import { Alert } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubmissionModal } from "../viewsubmissionmodal";
import { Calendar, Clock, Download, User } from "lucide-react";
// import { FaBarsProgress } from "react-icons/fa6";

interface Tutor {
  name: string;
}

interface SubmissionStats {
  total_students: number;
  submitted_students: number;
  pending_students: number;
}

interface Submission {
  id: number;
  student_id: string;
  student_name: string;
  submission: string;
  file_url: string;
  status: string;
  submitted_at: string;
}

interface AssessmentDetails {
  id: number;
  title: string;
  description: string;
  file_url: string;
  deadline: string;
  tutor: Tutor;
  submission_stats: SubmissionStats;
  submissions: Submission[];
}

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: { id: number; title: string } | null;
}

export function AssessmentModal({ isOpen, onClose, assessment }: AssessmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<AssessmentDetails | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false); // Track submission modal state
  const token = useSelector((state: RootState) => state.auth?.token);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!assessment?.id || !token) return;

      setLoading(true);
      try {
        const response = await getAssignmentDetails(token, assessment.id);
        setDetails(response.data.assignment as AssessmentDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch assessment details");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchDetails();
    }
  }, [assessment?.id, isOpen, token]);

  if (!assessment) return null;

  return (
    <>
      <Dialog open={isOpen && !isSubmissionModalOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#1BC2C2]">{assessment?.title}</DialogTitle>
          </DialogHeader>

          {error ? (
            <Alert variant="danger">{error}</Alert>
          ) : loading ? (
            <div className="flex items-center justify-center py-8">Loading details...</div>
          ) : details && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="details"
                  className="pb-2 border-b-2"
                  style={{ borderColor: "var(--color-primary)" }}
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="submissions"
                  className="pb-2 border-b-2"
                  style={{ borderColor: "var(--color-primary)" }}
                >
                  Submissions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 mt-4 min-h-40">
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
                      <User size={16} />
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
                    <progress 
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
                    <a 
                      href={details.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 bg-[#1BC2C2] px-3 py-2 rounded-xl"
                    >
                      <Download size={16} />
                      Download Assignment
                    </a>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="submissions" className="mt-4">
                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {details.submissions.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No submissions yet</p>
                  ) : (
                    details.submissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium">{submission.student_name}</p>
                          <p className="text-sm text-gray-500">
                            Submitted: {format(parseISO(submission.submitted_at), "MMM d, yyyy HH:mm")}
                          </p>
                          <p className="text-sm text-gray-500">Status: {submission.status}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setIsSubmissionModalOpen(true); // Open submission modal
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          View
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {selectedSubmission && (
        <SubmissionModal
          isOpen={isSubmissionModalOpen}
          onClose={() => {
            setIsSubmissionModalOpen(false); // Close submission modal
          }}
          submission={selectedSubmission}
        />
      )}
    </>
  );
}

