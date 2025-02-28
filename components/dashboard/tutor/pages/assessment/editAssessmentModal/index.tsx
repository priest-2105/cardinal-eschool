"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"



interface Student {
    id: string
    name: string
    email: string
  }
  
   interface Assessment {
    id: string
    title: string
    subject: string
    dueDate: Date
    status: "pending" | "submitted" | "graded"
    description?: string
    submittedFile?: string
    studentId: string
    grade?: number
  }
  

interface EditAssessmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (assessment: Assessment) => void
  assessment: Assessment | null
  students: Student[]
}

export function EditAssessmentModal({ isOpen, onClose, onSubmit, assessment, students }: EditAssessmentModalProps) {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [description, setDescription] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  useEffect(() => {
    if (assessment) {
      setTitle(assessment.title)
      setSubject(assessment.subject)
      setDueDate(assessment.dueDate.toISOString().split("T")[0])
      setDescription(assessment.description || "")
      setSelectedStudents(assessment.studentIds)
    }
  }, [assessment])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (assessment) {
      const updatedAssessment: Assessment = {
        ...assessment,
        title,
        subject,
        dueDate: new Date(dueDate),
        description,
        studentIds: selectedStudents,
      }
      onSubmit(updatedAssessment)
    }
  }

  const handleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  if (!assessment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit Assessment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label>Assign to Students</Label>
            <div className="space-y-2 mt-2">
              {students.map((student) => (
                <div key={student.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`student-${student.id}`}
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => handleStudentSelection(student.id)}
                  />
                  <Label htmlFor={`student-${student.id}`}>{student.name}</Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Assessment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

