import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Assessment } from "../types"

export interface Student {
  id: string
  name: string
  email: string
}


interface AssessmentModalProps {
  assessment: Assessment | null
  isOpen: boolean
  onClose: () => void
  onGrade: (id: string, grade: number) => void
  students: Student[]
}

export function AssessmentModal({ assessment, isOpen, onClose, onGrade, students }: AssessmentModalProps) {
  const [grade, setGrade] = useState<number | "">("")

  if (!assessment) return null

  const student = students.find((s) => assessment.studentIds.includes(s.id))

  const handleGrade = () => {
    if (typeof grade === "number") {
      onGrade(assessment.id, grade)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle>{assessment.topic}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Badge
              variant={
                assessment.status === "graded" ? "success" : assessment.status === "submitted" ? "info" : "warning"
              }
            >
              {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
            </Badge>
            <span className="text-sm text-gray-500">{assessment.subject}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="mr-2 h-4 w-4" />
            Due: {format(assessment.dueDate, "MMM d, yyyy")}
          </div>
          <p className="text-sm">{assessment.description || "No description provided."}</p>
          <div className="text-sm">
            <strong>Student:</strong> {student ? student.name : "Unknown"}
          </div>
          {assessment.submittedFile && (
            <div className="text-sm">
              <strong>Submitted File:</strong> {assessment.submittedFile}
            </div>
          )}
          {assessment.status !== "pending" && (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                type="number"
                min="0"
                max="100"
                value={grade}
                onChange={(e) => setGrade(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {assessment.status !== "pending" && (
            <Button onClick={handleGrade} disabled={grade === "" || assessment.status === "graded"}>
              {assessment.status === "graded" ? "Graded" : "Submit Grade"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

