"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface EditDescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  description: string
  onSave: (newDescription: string) => void
}

export function EditDescriptionModal({ isOpen, onClose, description, onSave }: EditDescriptionModalProps) {
  const [editedDescription, setEditedDescription] = useState(description)

  const handleSave = () => {
    onSave(editedDescription)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Course Description</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            rows={10}
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

