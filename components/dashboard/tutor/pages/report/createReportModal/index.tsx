"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea" 


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
  
  

interface CreateReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (report: Omit<Report, "id">) => void
  students: Student[]
}

export function CreateReportModal({ isOpen, onClose, onSubmit, students }: CreateReportModalProps) {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [grade, setGrade] = useState("")
  const [content, setContent] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newReport: Omit<Report, "id"> = {
      title,
      subject,
      grade,
      dateSubmitted: new Date(),
      studentId: selectedStudent,
      content,
    }
    onSubmit(newReport)
    resetForm()
  }

  const resetForm = () => {
    setTitle("")
    setSubject("")
    setGrade("")
    setContent("")
    setSelectedStudent("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle>Create New Report</DialogTitle>
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
            <Select onValueChange={setSelectedStudent} required>
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
            <Button type="submit">Create Report</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

