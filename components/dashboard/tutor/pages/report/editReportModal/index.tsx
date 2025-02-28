"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  
 
interface EditReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (report: Report) => void
  report: Report | null
  students: Student[]
}

export function EditReportModal({ isOpen, onClose, onSubmit, report, students }: EditReportModalProps) {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [grade, setGrade] = useState("")
  const [content, setContent] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")

  useEffect(() => {
    if (report) {
      setTitle(report.title)
      setSubject(report.subject)
      setGrade(report.grade)
      setContent(report.content)
      setSelectedStudent(report.studentId)
    }
  }, [report])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (report) {
      const updatedReport: Report = {
        ...report,
        title,
        subject,
        grade,
        content,
        studentId: selectedStudent,
      }
      onSubmit(updatedReport)
    }
  }

  if (!report) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit Report</DialogTitle>
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
            <Label htmlFor="grade">Grade</Label>
            <Input id="grade" value={grade} onChange={(e) => setGrade(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="student">Student</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="content">Report Content</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Report</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

