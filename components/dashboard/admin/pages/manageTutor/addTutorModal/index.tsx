"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddTutorModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTutor: (tutor: Omit<Tutor, "id">) => void
}

interface Tutor {
  id: string
  name: string
  email: string
  subject: string
  dateJoined: string
  status: "Active" | "Suspended" | "Inactive"
}

export function AddTutorModal({ isOpen, onClose, onAddTutor }: AddTutorModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newTutor: Omit<Tutor, "id"> = {
      name,
      email,
      subject,
      dateJoined: new Date().toISOString().split("T")[0],
      status: "Active",
    }
    onAddTutor(newTutor)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setEmail("")
    setSubject("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Tutor</DialogTitle>
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
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  {/* Add more subjects as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Tutor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

