"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { parseISO } from "date-fns"
import { Calendar, Download } from "lucide-react"

interface Assignment {
  id: number;
  title: string;
  description: string;
  deadline: string; // ISO string
  file_path: string;
  tutor_id: string;
  tutor_name: string;
  submissions: {
    total: number;
    turned_in: number;
    pending: number;
    overdue: number;
  };
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

interface AssessmentModalProps {
  assignment: Assignment | null
  isOpen: boolean
  onClose: () => void
}

export default function AssessmentModal({ assignment, isOpen, onClose }: AssessmentModalProps) {
  if (!assignment) return null

  const getFileName = (path: string) => {
    if (!path) return "Unknown File";
    const parts = path.split("/");
    return parts[parts.length - 1];
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle>{assignment.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Assignment
            </Badge>
            <span className="text-sm text-gray-500">Created by: {assignment.tutor_name}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="mr-2 h-4 w-4" />
            Due: {format(parseISO(assignment.deadline), "MMM d, yyyy HH:mm")}
          </div>
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-1">Description</h4>
            <p className="text-sm text-gray-700">{assignment.description}</p>
          </div>

          {assignment.file_path && (
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-1">Attachment</h4>
              <div className="flex items-center gap-2">
                <a
                  href={assignment.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  {getFileName(assignment.file_path)}
                </a>
              </div>
            </div>
          )}

          <div className="mt-2">
            <h4 className="text-sm font-medium mb-1">Submission Statistics</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Total:</span> {assignment.submissions.total}
              </div>
              <div>
                <span className="text-gray-500">Turned In:</span> {assignment.submissions.turned_in}
              </div>
              <div>
                <span className="text-gray-500">Pending:</span> {assignment.submissions.pending}
              </div>
              <div>
                <span className="text-gray-500">Overdue:</span> {assignment.submissions.overdue}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {assignment.file_path && (
            <Button>
              <a href={assignment.file_path} target="_blank" rel="noopener noreferrer">
                Download Assignment
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

