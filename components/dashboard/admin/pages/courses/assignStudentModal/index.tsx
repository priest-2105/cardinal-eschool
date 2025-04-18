"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Search } from "lucide-react"
import { getStudentForClasses } from "@/lib/api/admin/managestudent/getstudentforclassess"
import { useSelector } from "react-redux"
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
  currentStudents: { id: string; name: string }[]
}

export function AssignStudentsModal({ isOpen, onClose, onAssign, currentStudents = [] }: AssignStudentsModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([])
  const token = useSelector((state: RootState) => state.auth?.token)

  // Fetch students when modal opens
  useEffect(() => {
    const fetchStudents = async () => {
      if (!token || !isOpen) return
      
      setLoading(true)
      try {
        const response = await getStudentForClasses(token)
        if (response.status === "success") {
          setStudents(response.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch students:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchStudents()
    }
  }, [token, isOpen])

  // Initialize selected students when the modal opens and we have student data
  useEffect(() => {
    if (isOpen && students.length > 0 && currentStudents?.length > 0) {
      const currentStudentIds = currentStudents.map(s => s.id)
      // console.log("Current student IDs:", currentStudentIds)
      
      const initialSelectedStudents = students.filter(student => 
        currentStudentIds.includes(student.student_codec)
      )
      
      // console.log("Initial selected students:", initialSelectedStudents)
      setSelectedStudents(initialSelectedStudents)
    } else if (isOpen && students.length > 0) {
      // Reset selection when modal opens with no current students
      setSelectedStudents([])
    }
  }, [isOpen, students, currentStudents])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const toggleStudentSelection = (student: Student) => {
    setSelectedStudents(prev => {
      const isSelected = prev.some(s => s.student_codec === student.student_codec)
      
      if (isSelected) {
        return prev.filter(s => s.student_codec !== student.student_codec)
      } else {
        return [...prev, student]
      }
    })
  }

  const handleAssign = () => {
    onAssign(selectedStudents)
    onClose()
  }

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isStudentSelected = (student: Student) =>
    selectedStudents.some((s) => s.student_codec === student.student_codec)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Assign Students to Course</DialogTitle>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students by name or email..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="max-h-[400px] overflow-y-auto border rounded-md">
          {loading ? (
            <div className="p-4 text-center">Loading students...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-4 text-center">No students found</div>
          ) : (
            <div className="space-y-2 p-2">
              {filteredStudents.map(student => (
                <div
                  key={student.student_codec}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100"
                >
                  <Checkbox
                    id={student.student_codec}
                    checked={isStudentSelected(student)}
                    onCheckedChange={() => toggleStudentSelection(student)}
                  />
                  <label
                    htmlFor={student.student_codec}
                    className="flex-1 flex justify-between items-center cursor-pointer"
                  >
                    <span>{student.name}</span>
                    <span className="text-sm text-muted-foreground">{student.email}</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <div className="w-full flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {selectedStudents.length} students selected
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleAssign} disabled={loading}>
                Assign Students
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

