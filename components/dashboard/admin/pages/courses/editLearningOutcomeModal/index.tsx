"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface EditLearningOutcomesModalProps {
  isOpen: boolean
  onClose: () => void
  learningOutcomes: string
  onSave: (newLearningOutcomes: string) => void
}

export function EditLearningOutcomesModal({
  isOpen,
  onClose,
  learningOutcomes,
  onSave,
}: EditLearningOutcomesModalProps) {
  const [editedLearningOutcomes, setEditedLearningOutcomes] = useState(learningOutcomes)

  const handleSave = () => {
    onSave(editedLearningOutcomes)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Learning Outcomes</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={editedLearningOutcomes}
            onChange={(e) => setEditedLearningOutcomes(e.target.value)}
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

