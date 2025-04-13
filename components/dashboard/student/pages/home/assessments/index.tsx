"use client"

import { useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/student/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import Link from "next/link";
import { submitAssignment } from "@/lib/api/student/courses/turninassessment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/dashboard/student/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RootState } from "@/lib/store";

interface Assessment {
  id: string;
  title: string;
  description: string;
  deadline: string;
  class: { name: string; id: string };
}

interface AssessmentsProps {
  assignments: Assessment[];
}

export default function Assessments({ assignments }: AssessmentsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assessment | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);
  const [errors, setErrors] = useState<{ text?: string; file?: string }>({});
  const token = useSelector((state: RootState) => state.auth?.token);

  const handleOpenDialog = (assignment: Assessment) => {
    setSelectedAssignment(assignment);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (isSubmitting) return;
    setIsDialogOpen(false);
    setSelectedAssignment(null);
    setSubmissionText("");
    setFile(null);
    setAlert(null);
    setErrors({});
  };

  const validateInputs = () => {
    const newErrors: { text?: string; file?: string } = {};
    if (!submissionText.trim()) {
      newErrors.text = "Submission details are required.";
    }
    if (!file) {
      newErrors.file = "A file must be uploaded.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!selectedAssignment || !token) {
      setAlert({ type: "danger", message: "Token not found or assignment not selected." });
      return;
    }

    if (!validateInputs()) return;

    setIsSubmitting(true);
    try {
      await submitAssignment(token, selectedAssignment.id, submissionText, file);
      setAlert({ type: "success", message: "Assignment submitted successfully!" });
    } catch (error) {
      console.error("Error submitting assignment:", error);
      setAlert({ type: "danger", message: "Failed to submit assignment. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignments.map((assessment) => {
            const daysLeft = differenceInDays(parseISO(assessment.deadline), new Date());
            const deadlineColor = daysLeft <= 5 ? "text-red-500" : "text-green-500";

            return (
              <div key={assessment.id} className="flex flex-col space-y-4 p-4 rounded-lg border bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{assessment.title}</h3>
                      <div className="text-sm text-gray-500">{assessment.class.name}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className={`text-sm font-medium ${deadlineColor}`}>
                    Submit before {assessment.deadline}
                  </p>
                  <div className="flex items-center justify-between">
                    <Link
                      href={`student/course/${assessment.class.id}`}
                      className="text-[#1BC2C2] px-5 py-1 font-medium border-[#1BC2C2] rounded-md border-2"
                    >
                      View
                    </Link>
                    <Button
                      size="sm"
                      className="bg-[#1BC2C2] hover:bg-teal-600 text-white"
                      onClick={() => handleOpenDialog(assessment)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-white max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              {selectedAssignment?.title}
            </DialogDescription>
          </DialogHeader>
          <textarea
            className={`outline-none w-full p-2 border rounded mb-2 ${
              errors.text ? "border-red-500" : "border-gray-300"
            }`}
            rows={4}
            placeholder="Enter submission details..."
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
          />
          {errors.text && <p className="text-red-500 text-sm mb-2">{errors.text}</p>}
          <div className="relative mb-4">
            <label
              htmlFor="file-upload"
              className={`block w-full p-2 border rounded cursor-pointer text-center ${
                errors.file ? "border-red-500" : "border-[#1BC2C2]-300"
              }`}
            >
              {file ? file.name : "Click to upload a file"}
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
          </div>
          {errors.file && <p className="text-red-500 text-sm mb-2">{errors.file}</p>}
          {alert && (
            <Alert variant={alert.type} className="mb-4">
              <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#1BC2C2] text-white">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

