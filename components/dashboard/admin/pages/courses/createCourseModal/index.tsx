"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Course } from "../types"

interface CreateCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (course: Omit<Course, "id">) => void
}

export function CreateCourseModal({ isOpen, onClose, onSubmit }: CreateCourseModalProps) {
  const [name, setName] = useState("")
  const [grade, setGrade] = useState(0)
  const [noOfStudent, setNoOfStudent] = useState(0)
  const [schedule, setSchedule] = useState("")
  const [status, setStatus] = useState<Course["status"]>("Upcoming")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newCourse: Omit<Course, "id"> = {
      name,
      grade,
      noOfStudent,
      schedule,
      status,
      dateAdded: new Date().toISOString().split("T")[0],
    }
    onSubmit(newCourse)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setGrade(0)
    setNoOfStudent(0)
    setSchedule("")
    setStatus("Upcoming")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="grade" className="text-right">
                Grade
              </Label>
              <Input
                id="grade"
                type="number"
                value={grade}
                onChange={(e) => setGrade(Number.parseInt(e.target.value))}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="noOfStudent" className="text-right">
                Number of Students
              </Label>
              <Input
                id="noOfStudent"
                type="number"
                value={noOfStudent}
                onChange={(e) => setNoOfStudent(Number.parseInt(e.target.value))}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schedule" className="text-right">
                Schedule
              </Label>
              <Input
                id="schedule"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select onValueChange={(value: Course["status"]) => setStatus(value)} defaultValue={status}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Course</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

