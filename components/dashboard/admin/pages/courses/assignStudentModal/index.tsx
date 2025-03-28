"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useSelector } from "react-redux"
import { getStudentForClasses } from "@/lib/api/admin/managestudent/getstudentforclassess"
import type { RootState } from "@/lib/store"

interface Student {
  student_codec: string
  name: string
  email: string
  dp_url: string | null
  edu_level: string
  subjects_interested_in: string[]
}

interface AssignStudentsModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (students: Student[]) => void
  currentStudents: Student[]
}

export function AssignStudentsModal({ isOpen, onClose, onAssign, currentStudents }: AssignStudentsModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<Student[]>(currentStudents)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const token = useSelector((state: RootState) => state.auth?.token)

  useEffect(() => {
    const loadStudents = async () => {
      if (!token) return
      setLoading(true)
      try {
        const response = await getStudentForClasses(token)
        setStudents(response.data)
      } catch (error) {
        console.error("Failed to load students:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      loadStudents()
    }
  }, [isOpen, token])

  useEffect(() => {
    setSelectedStudents(currentStudents)
  }, [currentStudents])

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleToggleStudent = (student: Student) => {
    setSelectedStudents((prev) =>
      prev.some((s) => s.student_codec === student.student_codec)
        ? prev.filter((s) => s.student_codec !== student.student_codec)
        : [...prev, student]
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
              placeholder="Search by name or email..."
            />
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {loading ? (
              <p>Loading students...</p>
            ) : (
              filteredStudents.map((student) => (
                <div key={student.student_codec} className="flex items-center space-x-2">
                  <Checkbox
                    id={`student-${student.student_codec}`}
                    checked={selectedStudents.some((s) => s.student_codec === student.student_codec)}
                    onCheckedChange={() => handleToggleStudent(student)}
                  />
                  <Label htmlFor={`student-${student.student_codec}`}>{student.name} ({student.email})</Label>
                </div>
              ))
            )}
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

