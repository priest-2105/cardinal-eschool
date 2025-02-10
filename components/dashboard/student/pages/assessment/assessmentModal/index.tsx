"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Assessment {
  id: string
  title: string
  subject: string
  dueDate: Date
  status: "done" | "pending"
  description?: string
}

interface AssessmentModalProps {
  assessment: Assessment | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (id: string, file: File) => void
}

export function AssessmentModal({ assessment, isOpen, onClose, onSubmit }: AssessmentModalProps) {
  const [file, setFile] = useState<File | null>(null)

  if (!assessment) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = () => {
    if (file) {
      onSubmit(assessment.id, file)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{assessment.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Badge variant={assessment.status === "done" ? "success" : "warning"}>
              {assessment.status === "done" ? "Completed" : "Pending"}
            </Badge>
            <span className="text-sm text-gray-500">{assessment.subject}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="mr-2 h-4 w-4" />
            Due: {format(assessment.dueDate, "MMM d, yyyy")}
          </div>
          <p className="text-sm">{assessment.description || "No description provided."}</p>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="assessment-file">Upload Assessment</Label>
            <Input id="assessment-file" type="file" onChange={handleFileChange} className="cursor-pointer" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={assessment.status === "done" || !file}>
            {assessment.status === "done" ? "Submitted" : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

