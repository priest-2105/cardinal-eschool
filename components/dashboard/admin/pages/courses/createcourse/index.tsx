"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2, User, Users } from "lucide-react"
import { AssignTutorModal } from "../assignTutorModal/index"
import { AssignStudentsModal } from "../assignStudentModal/index"

interface Schedule {
  day: string
  fromTime: string
  toTime: string
}

interface Tutor {
  id: string
  name: string
}

interface Student {
  id: string
  name: string
}

export default function CreateCoursePage() {
  const router = useRouter()
  const [courseName, setCourseName] = useState("")
  const [courseCode, setCourseCode] = useState("")
  const [department, setDepartment] = useState("")
  const [semester, setSemester] = useState("")
  const [description, setDescription] = useState("")
  const [prerequisites, setPrerequisites] = useState("")
  const [learningOutcomes, setLearningOutcomes] = useState("")
  const [joinClassLink, setJoinClassLink] = useState("")
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [newSchedule, setNewSchedule] = useState<Schedule>({ day: "", fromTime: "", toTime: "" })
  const [assignedTutor, setAssignedTutor] = useState<Tutor | null>(null)
  const [assignedStudents, setAssignedStudents] = useState<Student[]>([])
  const [isAssignTutorModalOpen, setIsAssignTutorModalOpen] = useState(false)
  const [isAssignStudentsModalOpen, setIsAssignStudentsModalOpen] = useState(false)

  const handleAddSchedule = () => {
    if (newSchedule.day && newSchedule.fromTime && newSchedule.toTime) {
      setSchedules([...schedules, newSchedule])
      setNewSchedule({ day: "", fromTime: "", toTime: "" })
    }
  }

  const handleRemoveSchedule = (index: number) => {
    const updatedSchedules = schedules.filter((_, i) => i !== index)
    setSchedules(updatedSchedules)
  }

  const handleAssignTutor = (tutor: Tutor) => {
    setAssignedTutor(tutor)
    setIsAssignTutorModalOpen(false)
  }

  const handleAssignStudents = (students: Student[]) => {
    setAssignedStudents(students)
    setIsAssignStudentsModalOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the course data to your backend
    console.log({
      courseName,
      courseCode,
      department,
      semester,
      description,
      prerequisites,
      learningOutcomes,
      joinClassLink,
      schedules,
      assignedTutor,
      assignedStudents,
    })
    // After successful creation, navigate back to the courses list
    router.push("/admin/courses")
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Create New Course</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input id="courseName" value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input id="courseCode" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input id="semester" value={semester} onChange={(e) => setSemester(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="joinClassLink">Join Class Link</Label>
              <Input
                id="joinClassLink"
                value={joinClassLink}
                onChange={(e) => setJoinClassLink(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prerequisites">Prerequisites</Label>
              <Textarea
                id="prerequisites"
                value={prerequisites}
                onChange={(e) => setPrerequisites(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="learningOutcomes">Learning Outcomes</Label>
              <Textarea
                id="learningOutcomes"
                value={learningOutcomes}
                onChange={(e) => setLearningOutcomes(e.target.value)}
                rows={5}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Class Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {schedules.map((schedule, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Select
                  value={schedule.day}
                  onValueChange={(value) => {
                    const updatedSchedules = [...schedules]
                    updatedSchedules[index].day = value
                    setSchedules(updatedSchedules)
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monday">Monday</SelectItem>
                    <SelectItem value="Tuesday">Tuesday</SelectItem>
                    <SelectItem value="Wednesday">Wednesday</SelectItem>
                    <SelectItem value="Thursday">Thursday</SelectItem>
                    <SelectItem value="Friday">Friday</SelectItem>
                    <SelectItem value="Saturday">Saturday</SelectItem>
                    <SelectItem value="Sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <span>From:</span>
                  <Input
                    type="time"
                    value={schedule.fromTime}
                    onChange={(e) => {
                      const updatedSchedules = [...schedules]
                      updatedSchedules[index].fromTime = e.target.value
                      setSchedules(updatedSchedules)
                    }}
                    className="w-[120px]"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span>To:</span>
                  <Input
                    type="time"
                    value={schedule.toTime}
                    onChange={(e) => {
                      const updatedSchedules = [...schedules]
                      updatedSchedules[index].toTime = e.target.value
                      setSchedules(updatedSchedules)
                    }}
                    className="w-[120px]"
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveSchedule(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Select value={newSchedule.day} onValueChange={(value) => setNewSchedule({ ...newSchedule, day: value })}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                  <SelectItem value="Saturday">Saturday</SelectItem>
                  <SelectItem value="Sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <span>From:</span>
                <Input
                  type="time"
                  value={newSchedule.fromTime}
                  onChange={(e) => setNewSchedule({ ...newSchedule, fromTime: e.target.value })}
                  className="w-[120px]"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span>To:</span>
                <Input
                  type="time"
                  value={newSchedule.toTime}
                  onChange={(e) => setNewSchedule({ ...newSchedule, toTime: e.target.value })}
                  className="w-[120px]"
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleAddSchedule}>
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assign Tutor and Students</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Assigned Tutor</Label>
              <div className="flex items-center space-x-2">
                {assignedTutor ? (
                  <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                    <User className="h-4 w-4" />
                    <span>{assignedTutor.name}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">No tutor assigned</span>
                )}
                <Button type="button" onClick={() => setIsAssignTutorModalOpen(true)}>
                  {assignedTutor ? "Change Tutor" : "Assign Tutor"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Assigned Students</Label>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                  <Users className="h-4 w-4" />
                  <span>{assignedStudents.length} students assigned</span>
                </div>
                <Button type="button" onClick={() => setIsAssignStudentsModalOpen(true)}>
                  {assignedStudents.length > 0 ? "Edit Students" : "Assign Students"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Create Course</Button>
        </div>
      </form>

      <AssignTutorModal
        isOpen={isAssignTutorModalOpen}
        onClose={() => setIsAssignTutorModalOpen(false)}
        onAssign={handleAssignTutor}
        currentTutor={assignedTutor}
      />

      <AssignStudentsModal
        isOpen={isAssignStudentsModalOpen}
        onClose={() => setIsAssignStudentsModalOpen(false)}
        onAssign={handleAssignStudents}
        currentStudents={assignedStudents}
      />
    </div>
  )
}

