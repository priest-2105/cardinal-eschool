"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface EditPrerequisitesModalProps {
  isOpen: boolean
  onClose: () => void
  prerequisites: string
  onSave: (newPrerequisites: string) => void
}

export function EditPrerequisitesModal({ isOpen, onClose, prerequisites, onSave }: EditPrerequisitesModalProps) {
  const [editedPrerequisites, setEditedPrerequisites] = useState(prerequisites)

  const handleSave = () => {
    onSave(editedPrerequisites)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Prerequisites</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={editedPrerequisites}
            onChange={(e) => setEditedPrerequisites(e.target.value)}
            rows={5}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

