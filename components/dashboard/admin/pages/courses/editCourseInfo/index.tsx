"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CourseInfo {
  code: string
  department: string
  semester: string
}

interface EditCourseInfoModalProps {
  isOpen: boolean
  onClose: () => void
  courseInfo: CourseInfo
  onSave: (newCourseInfo: CourseInfo) => void
}

export function EditCourseInfoModal({ isOpen, onClose, courseInfo, onSave }: EditCourseInfoModalProps) {
  const [editedCourseInfo, setEditedCourseInfo] = useState(courseInfo)

  const handleSave = () => {
    onSave(editedCourseInfo)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Course Information</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Course Code
            </Label>
            <Input
              id="code"
              value={editedCourseInfo.code}
              onChange={(e) => setEditedCourseInfo({ ...editedCourseInfo, code: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <Input
              id="department"
              value={editedCourseInfo.department}
              onChange={(e) => setEditedCourseInfo({ ...editedCourseInfo, department: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="semester" className="text-right">
              Semester
            </Label>
            <Input
              id="semester"
              value={editedCourseInfo.semester}
              onChange={(e) => setEditedCourseInfo({ ...editedCourseInfo, semester: e.target.value })}
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

