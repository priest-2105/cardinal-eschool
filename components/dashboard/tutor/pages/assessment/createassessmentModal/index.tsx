"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Assessment } from "../types" 

export interface Student {
  id: string
  name: string
  email: string
}

interface CreateAssessmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (assessments: Omit<Assessment, "id">[]) => void
  students: Student[]
}

export function CreateAssessmentModal({ isOpen, onClose, onSubmit, students }: CreateAssessmentModalProps) {
  const [topic, setTopic] = useState("")
  const [subject, setSubject] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [description, setDescription] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newAssessments: Omit<Assessment, "id">[] = selectedStudents.map((studentId) => ({
      topic,
      subject,
      dueDate: new Date(dueDate),
      status: "pending",
      description,
      studentIds: [studentId],
    }))
    onSubmit(newAssessments)
    resetForm()
  }

  const resetForm = () => {
    setTopic("")
    setSubject("")
    setDueDate("")
    setDescription("")
    setSelectedStudents([])
  }

  const handleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle>Create New Assessment</DialogTitle>
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Assessment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

