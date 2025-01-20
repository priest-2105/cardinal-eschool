"use client"

import { useState } from "react"
import type { ComplaintFormData } from "../types"
import { Button } from "@/components/dashboard/student/ui/button"
import { Input } from "@/components/dashboard/student/ui/input"
import { Label } from "@/components/dashboard/student/ui/label"
import { Textarea } from "@/components/dashboard/student/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/student/ui/select"

const departments = [
  { id: "1", name: "Academic Affairs" },
  { id: "2", name: "Administrative" },
  { id: "3", name: "Technical Support" },
  { id: "4", name: "Student Services" },
]

export function ComplaintForm() {
  const [formData, setFormData] = useState<ComplaintFormData>({
    name: "",
    email: "",
    department: "",
    issue: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Submit Complaint</h2>
        <p className="text-sm text-muted-foreground">Fill out the form below to submit your complaint</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select
          value={formData.department}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="issue">Issue Type</Label>
        <Select value={formData.issue} onValueChange={(value) => setFormData((prev) => ({ ...prev, issue: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select issue type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technical">Technical Issue</SelectItem>
            <SelectItem value="academic">Academic Issue</SelectItem>
            <SelectItem value="administrative">Administrative Issue</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="Enter subject"
          value={formData.subject}
          onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Enter your message"
          value={formData.message}
          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          required
          className="min-h-[150px]"
        />
      </div>

      <Button type="submit" className="w-full">
        Submit Complaint
      </Button>
    </form>
  )
}

