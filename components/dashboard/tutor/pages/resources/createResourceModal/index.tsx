"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { createResource } from "@/lib/api/tutor/courses/createresources"
import { Alert } from "@/components/ui/alert"

interface CreateResourceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateResourceModal({ isOpen, onClose, onSuccess }: CreateResourceModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const token = useSelector((state: RootState) => state.auth?.token)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token) return

    const form = e.currentTarget
    const formData = new FormData(form)

    setLoading(true)
    setError(null)

    try {
      await createResource(token, formData)
      onSuccess()
      onClose()
      form.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create resource")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload New Resource</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Resource Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="comment">Comment</Label>
            <Textarea id="comment" name="comment" />
          </div>
          <div>
            <Label htmlFor="file">File</Label>
            <Input id="file" name="file" type="file" required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload Resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

