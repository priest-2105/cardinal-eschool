"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Course } from "../types"

interface CreateCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (course: Omit<Course, "id">) => void
}

export function CreateCourseModal({ isOpen, onClose, onSubmit }: CreateCourseModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [tutor, setTutor] = useState("")
  const [schedule, setSchedule] = useState("")
  const [status, setStatus] = useState<Course["status"]>("Upcoming")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newCourse: Omit<Course, "id"> = {
      name,
      description,
      tutor,
      schedule,
      status,
      noOfStudent: 0,
      dateAdded: new Date().toISOString().split("T")[0],
    }
    onSubmit(newCourse)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setTutor("")
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
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tutor" className="text-right">
                Tutor
              </Label>
              <Input id="tutor" value={tutor} onChange={(e) => setTutor(e.target.value)} className="col-span-3" />
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

