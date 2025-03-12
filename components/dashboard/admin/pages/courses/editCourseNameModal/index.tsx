"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditCourseNameModalProps {
  isOpen: boolean
  onClose: () => void
  courseName: string
  joinClassLink: string
  onSave: (newCourseName: string, newJoinClassLink: string) => void
}

export function EditCourseNameModal({ isOpen, onClose, courseName, joinClassLink, onSave }: EditCourseNameModalProps) {
  const [editedCourseName, setEditedCourseName] = useState(courseName)
  const [editedJoinClassLink, setEditedJoinClassLink] = useState(joinClassLink)

  const handleSave = () => {
    onSave(editedCourseName, editedJoinClassLink)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Course Name and Join Link</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-4">
            <Label htmlFor="courseName" className="text-left">
              Course Name
            </Label>
            <Input
              id="courseName"
              value={editedCourseName}
              onChange={(e) => setEditedCourseName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid items-center gap-4">
            <Label htmlFor="joinClassLink" className="text-left">
              Join Class Link
            </Label>
            <Input
              id="joinClassLink"
              value={editedJoinClassLink}
              onChange={(e) => setEditedJoinClassLink(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

