"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { getSubmissionDetails } from "@/lib/api/tutor/courses/fetchsinglesubmisson";
import { Alert } from "@/components/ui/alert";
// import { ExternalLink } from "lucide-react";

interface SubmissionDetails {
  id: number;
  assignment_id: number;
  student_id: string;
  student_name: string;
  submission: string;
  file_url: string;
  status: string;
  submitted_at: string;
}

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: { id: number } | null;
}

export function SubmissionModal({ isOpen, onClose, submission }: SubmissionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<SubmissionDetails | null>(null);
  const token = useSelector((state: RootState) => state.auth?.token);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!submission?.id || !token) return;

      setLoading(true);
      try {
        const response = await getSubmissionDetails(token, submission.id);
        setDetails(response.data.submission as SubmissionDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch submission details");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchDetails();
    }
  }, [submission?.id, isOpen, token]);

  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Submission Details</DialogTitle>
        </DialogHeader>

        {error ? (
          <Alert variant="danger">{error}</Alert>
        ) : loading ? (
          <div className="flex items-center justify-center py-8">Loading submission details...</div>
        ) : details && (
          <div className="space-y-4">
            <p className="font-medium">Student Name: {details.student_name}</p>
            <p className="text-sm text-gray-500">
              Submitted: {format(parseISO(details.submitted_at), "MMM d, yyyy HH:mm")}
            </p>
            <p className="text-sm text-gray-500">Status: {details.status}</p>
            <p className="text-sm text-gray-500">Submission: {details.submission}</p>
            <div className="relative group">
              <iframe
                src={details.file_url}
                className="w-full h-64 border rounded-lg"
                title="Document Preview"
              ></iframe>
              <a
                href={details.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded"
              >
                Open in New Tab
              </a>
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-[#1BC2C2] text-white rounded-lg hover:bg-teal-600"
            >
              Close
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

