"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { createClass } from "@/lib/api/admin/managecourses/createcourse"
import { getTutors } from "@/lib/api/admin/managetutor/fetchtutors"
import { getStudentForClasses } from "@/lib/api/admin/managestudent/getstudentforclassess"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/admin/ui/alert"

interface Schedule {
  day: string
  fromTime: string
  toTime: string
}

interface Tutor {
  tutor_codec: string
  name: string
  email: string
  qualification: string | null
  dp_url: string | null
}

interface Student {
  student_codec: string
  name: string
  email: string
  dp_url: string | null
  edu_level: string
  subjects_interested_in: string[]
}

interface ValidationErrors {
  [key: string]: string
}

interface APIError {
  response?: {
    data?: {
      errors?: ValidationErrors
    }
  }
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
  const [assignedTutor, setAssignedTutor] = useState<{
    id: string
    name: string
    email: string
    qualification: string | null
    dp_url: string | null
  } | null>(null)
  const [assignedStudents, setAssignedStudents] = useState<{ id: string; name: string }[]>([])
  const [isAssignTutorModalOpen, setIsAssignTutorModalOpen] = useState(false)
  const [isAssignStudentsModalOpen, setIsAssignStudentsModalOpen] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const token = useSelector((state: RootState) => state.auth?.token)

  useEffect(() => {
    const loadTutorsAndStudents = async () => {
      if (!token) return
      try {
        const [tutorsRes, studentsRes] = await Promise.all([
          getTutors(token),
          getStudentForClasses(token)
        ])
        
        if (tutorsRes.status === "success" && studentsRes.status === "success") {
          // The data is now available to pass to the modals
          console.log("Tutors:", tutorsRes.data)
          console.log("Students:", studentsRes.data)
        }
      } catch (error) {
        console.error("Failed to load tutors and students:", error)
        setAlert({
          type: "error",
          message: "Failed to load tutors and students"
        })
      }
    }

    loadTutorsAndStudents()
  }, [token, router])

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!courseName.trim()) newErrors.name = "Course name is required"
    if (!courseCode.trim()) newErrors.code = "Course code is required"
    if (!description.trim()) newErrors.description = "Description is required"
    if (schedules.length === 0) newErrors.schedule = "At least one schedule is required"
    if (!assignedTutor) newErrors.tutor = "A tutor must be assigned"
    if (assignedStudents.length === 0) newErrors.students = "At least one student must be assigned"

    // Meeting link validation
    if (joinClassLink) {
      const meetLinkRegex = /^(https?:\/\/)?(meet\.google\.com\/[a-zA-Z0-9-]+|(?:www\.)?zoom\.us\/(?:j\/)?[0-9]+(\?pwd=[a-zA-Z0-9]+)?)$/
      if (!meetLinkRegex.test(joinClassLink)) {
        newErrors.meeting_link = "Please enter a valid Google Meet or Zoom meeting link"
      }
    }

    // Schedule validation
    schedules.forEach((schedule, index) => {
      const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      if (!validDays.includes(schedule.day)) {
        newErrors[`schedule_${index}`] = "Invalid day selected"
      }
      if (!schedule.fromTime || !schedule.toTime) {
        newErrors[`schedule_time_${index}`] = "Both start and end time are required"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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
    setAssignedTutor({
      id: tutor.tutor_codec, // Map `tutor_codec` to `id`
      name: tutor.name,
      email: tutor.email,
      qualification: tutor.qualification,
      dp_url: tutor.dp_url,
    })
    setIsAssignTutorModalOpen(false)
  }

  const handleAssignStudents = (students: Student[]) => {
    setAssignedStudents(
      students.map(student => ({
        id: student.student_codec,
        name: student.name
      }))
    )
    setIsAssignStudentsModalOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    if (!validateForm()) {
      setAlert({
        type: "error",
        message: "Please fix the validation errors before submitting",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const requestBody = {
        name: courseName,
        code: courseCode,
        description,
        schedule: {
          days: schedules.map((s) => s.day),
          time: schedules.map((s) => `${s.fromTime}-${s.toTime}`),
        },
        meeting_link: joinClassLink,
        tutor_id: assignedTutor?.id || "",
        student_ids: assignedStudents.map((s) => s.id),
        learning_outcome: learningOutcomes,
        prerequisite: prerequisites,
        department,
        semester,
      }

      await createClass(token, requestBody)
      setAlert({
        type: "success",
        message: "Course created successfully!",
      })

      setTimeout(() => {
        router.push("/admin/courses")
      }, 2000)
    } catch (error: unknown) {
      const apiError = error as APIError
      setAlert({
        type: "error",
        message: apiError.response?.data?.errors
          ? "Validation errors occurred. Please check the form."
          : "Failed to create course. Please try again.",
      })

      if (apiError.response?.data?.errors) {
        setErrors(apiError.response.data.errors)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Create New Course</h1>
      </div>

      {alert && (
        <div className="fixed top-5 right-5 z-50">
          <Alert variant={alert.type === "success" ? "success" : "danger"}>
            <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input 
                  id="courseName" 
                  value={courseName} 
                  onChange={(e) => setCourseName(e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                  required 
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input 
                  id="courseCode" 
                  value={courseCode} 
                  onChange={(e) => setCourseCode(e.target.value)}
                  className={errors.code ? "border-red-500" : ""}
                  required 
                />
                {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
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
              <Label htmlFor="joinClassLink">Join Class Link (Google Meet or Zoom)</Label>
              <Input
                id="joinClassLink"
                value={joinClassLink}
                onChange={(e) => setJoinClassLink(e.target.value)}
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                className={errors.meeting_link ? "border-red-500" : ""}
              />
              {errors.meeting_link && (
                <p className="text-sm text-red-500">{errors.meeting_link}</p>
              )}
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
                className={errors.description ? "border-red-500" : ""}
                required
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
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
              {errors.tutor && <p className="text-sm text-red-500">{errors.tutor}</p>}
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
              {errors.students && <p className="text-sm text-red-500">{errors.students}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create Course"
            )}
          </Button>
        </div>
      </form>

      <AssignTutorModal
        isOpen={isAssignTutorModalOpen}
        onClose={() => setIsAssignTutorModalOpen(false)}
        onAssign={handleAssignTutor}
        currentTutor={assignedTutor ? { tutor_codec: assignedTutor.id, name: assignedTutor.name, email: assignedTutor.email, qualification: assignedTutor.qualification, dp_url: assignedTutor.dp_url } : null}
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

