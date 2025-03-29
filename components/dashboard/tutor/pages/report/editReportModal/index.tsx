"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { updateReport } from "@/lib/api/tutor/courses/updaterereport"
import { Alert } from "@/components/ui/alert"

interface EditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classId: string;
  report: {
    id: number;
    report: string;
  } | null;
}

export function EditReportModal({ isOpen, onClose, onSuccess, classId, report }: EditReportModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reportContent, setReportContent] = useState(report?.report || "")
  const token = useSelector((state: RootState) => state.auth?.token)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !report) return

    setLoading(true)
    setError(null)

    try {
      await updateReport(token, classId, report.id, {
        report: reportContent,
      })
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update report")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Report</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? "Updating..." : "Update Report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

