"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
import { Assessment } from "@/types/dashboard/admin/course/assessment/index"



export interface Student {
    id: string
    name: string
    email: string
  }
  
 
interface EditAssessmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (assessment: Assessment) => void
  onDelete: (id: string) => void
  assessment: Assessment | null
  students: Student[]
}

export function EditAssessmentModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  assessment,
  students,
}: EditAssessmentModalProps) {
  const [topic, setTopic] = useState("")
  const [subject, setSubject] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (assessment) {
      setTopic(assessment.topic)
      setSubject(assessment.subject)
      setDueDate(assessment.dueDate.toISOString().split("T")[0])
      setDescription(assessment.description || "")
    }
  }, [assessment])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (assessment) {
      const updatedAssessment: Assessment = {
        ...assessment,
        topic,
        subject,
        dueDate: new Date(dueDate),
        description,
      }
      onSubmit(updatedAssessment)
    }
  }

  if (!assessment) return null

  const student = students.find((s) => s.id === assessment.studentIds[0])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit Assessment for {student?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4"> 
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <DialogFooter className="flex justify-between">
          <div className="ml-0 mr-auto">
             <Button type="button" variant="danger" onClick={() => onDelete(assessment.id)}>
              Delete
            </Button>
            </div>
            <div>
              <Button type="button" variant="outline" onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button type="submit">Update Assessment</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

