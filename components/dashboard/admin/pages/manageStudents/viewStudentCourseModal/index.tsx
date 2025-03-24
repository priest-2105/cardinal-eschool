import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

export interface Student {
    id: string
    name: string
    email: string
  }
  
  export interface Course {
    id: string
    title: string
    subject: string
    grade: string
    dateSubmitted: Date
    studentId: string
    content: string
  }
  
  

interface ViewCourseModalProps {
  course: Course | null
  isOpen: boolean
  onClose: () => void
  students: Student[]
}

export function ViewCourseModal({ course, isOpen, onClose, students }: ViewCourseModalProps) {
  if (!course) return null

  const student = students.find((s) => s.id === course.studentId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle>{course.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Subject: {course.subject}</p>
            <p className="text-sm font-medium">Grade: {course.grade}</p>
            <p className="text-sm text-gray-500">Date Submitted: {format(course.dateSubmitted, "MMMM d, yyyy")}</p>
            <p className="text-sm text-gray-500">Student: {student ? student.name : "Unknown"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Course Content:</h4>
            <p className="text-sm whitespace-pre-wrap">{course.content}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

