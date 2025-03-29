"use client"

import type React from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { createReport } from "@/lib/api/tutor/courses/createreport"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert } from "@/components/ui/alert"

interface CreateReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  classId: string
  students: {
    id: string
    name: string
    dp_url: string | null
  }[]
}

export function CreateReportModal({ isOpen, onClose, onSuccess, classId, students }: CreateReportModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const token = useSelector((state: RootState) => state.auth?.token)
  const [selectedStudent, setSelectedStudent] = useState("")
  const [month, setMonth] = useState("")
  const [reportContent, setReportContent] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      await createReport(token, classId, {
        student_id: selectedStudent,
        month,
        report: reportContent,
      })
      onSuccess()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create report")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedStudent("")
    setMonth("")
    setReportContent("")
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Report</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Student</Label>
            <Select 
              value={selectedStudent} 
              onValueChange={setSelectedStudent}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
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
            <Label>Month</Label>
            <Select 
              value={month} 
              onValueChange={setMonth}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Report Content</Label>
            <Textarea 
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
              required
              rows={6}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

