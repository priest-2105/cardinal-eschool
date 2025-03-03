"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface Student {
  id: string
  name: string
}

interface AssignStudentsModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (students: Student[]) => void
  currentStudents: Student[]
}

const SAMPLE_STUDENTS: Student[] = [
  { id: "1", name: "Alice Johnson" },
  { id: "2", name: "Bob Smith" },
  { id: "3", name: "Charlie Brown" },
  { id: "4", name: "Diana Ross" },
  { id: "5", name: "Ethan Hunt" },
]

export function AssignStudentsModal({ isOpen, onClose, onAssign, currentStudents }: AssignStudentsModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<Student[]>(currentStudents)

  useEffect(() => {
    setSelectedStudents(currentStudents)
  }, [currentStudents])

  const filteredStudents = SAMPLE_STUDENTS.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleToggleStudent = (student: Student) => {
    setSelectedStudents((prev) =>
      prev.some((s) => s.id === student.id) ? prev.filter((s) => s.id !== student.id) : [...prev, student],
    )
  }

  const handleAssign = () => {
    onAssign(selectedStudents)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Students</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Students</Label>
            <Input
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
            />
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {filteredStudents.map((student) => (
              <div key={student.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`student-${student.id}`}
                  checked={selectedStudents.some((s) => s.id === student.id)}
                  onCheckedChange={() => handleToggleStudent(student)}
                />
                <Label htmlFor={`student-${student.id}`}>{student.name}</Label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleAssign} disabled={selectedStudents.length === 0}>
            Assign Students ({selectedStudents.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

