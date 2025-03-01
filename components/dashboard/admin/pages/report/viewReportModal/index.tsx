import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

export interface Student {
    id: string
    name: string
    email: string
  }
  
  export interface Report {
    id: string
    title: string
    subject: string
    grade: string
    dateSubmitted: Date
    studentId: string
    content: string
  }
  
  

interface ViewReportModalProps {
  report: Report | null
  isOpen: boolean
  onClose: () => void
  students: Student[]
}

export function ViewReportModal({ report, isOpen, onClose, students }: ViewReportModalProps) {
  if (!report) return null

  const student = students.find((s) => s.id === report.studentId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle>{report.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Subject: {report.subject}</p>
            <p className="text-sm font-medium">Grade: {report.grade}</p>
            <p className="text-sm text-gray-500">Date Submitted: {format(report.dateSubmitted, "MMMM d, yyyy")}</p>
            <p className="text-sm text-gray-500">Student: {student ? student.name : "Unknown"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Report Content:</h4>
            <p className="text-sm whitespace-pre-wrap">{report.content}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

