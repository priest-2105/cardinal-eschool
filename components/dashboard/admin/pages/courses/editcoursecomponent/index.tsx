"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2, User, Users } from "lucide-react"
import { AssignTutorModal } from "../assignTutorModal/index"
import { AssignStudentsModal } from "../assignStudentModal/index"
import { getAdminCourseDetails } from "@/lib/api/admin/managecourses/fetchsinglecourse"
import { getTutors } from "@/lib/api/admin/managetutor/fetchtutors"
import { getStudentForClasses } from "@/lib/api/admin/managestudent/getstudentforclassess"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/admin/ui/alert"
import { updateCourse } from "@/lib/api/admin/managecourses/updatecourse"

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

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params?.courseid as string
  const isEditMode = !!courseId

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
  const [assignedTutor, setAssignedTutor] = useState<{ id: string; name: string } | null>(null)
  const [assignedStudents, setAssignedStudents] = useState<{ id: string; name: string }[]>([])
  const [isAssignTutorModalOpen, setIsAssignTutorModalOpen] = useState(false)
  const [isAssignStudentsModalOpen, setIsAssignStudentsModalOpen] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const token = useSelector((state: RootState) => state.auth?.token)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)

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
  }, [token])

  useEffect(() => {
    // Fetch existing course data if in edit mode
    const fetchCourseDetails = async () => {
      if (!token || !isEditMode) return
      
      setFetchLoading(true)
      try {
        const response = await getAdminCourseDetails(token, courseId)
        const courseData = response.data.class
        
        // Set form fields with existing data
        setCourseName(courseData.name)
        setCourseCode(courseData.code)
        setDepartment(courseData.department || "")
        setSemester(courseData.semester || "")
        setDescription(courseData.description || "")
        setPrerequisites(courseData.prerequisite || "")
        setLearningOutcomes(courseData.learning_outcome || "")
        setJoinClassLink(courseData.meeting_link || "")
        
        // Handle schedule data
        if (courseData.schedule && courseData.schedule.days) {
          const scheduleItems = courseData.schedule.days.map((day, index) => ({
            day,
            fromTime: courseData.schedule.time[index] || "",
            toTime: "", // This seems to not be in your API response, so leaving blank
          }))
          setSchedules(scheduleItems)
        }
        
        // Set tutor if available
        if (courseData.tutor_codec) {
          // Need to get tutor name from students data
          setAssignedTutor({
            id: courseData.tutor_codec,
            name: "Assigned Tutor"
          })
        }
        
        // Set students if available
        if (response.data.students && response.data.students.length > 0) {
          const students = response.data.students.map(student => ({
            id: student.id,
            name: student.name
          }))
          setAssignedStudents(students)
        }
      } catch (err) {
        console.error("Failed to fetch course details:", err)
        setAlert({
          type: "error",
          message: "Failed to load course details"
        })
      } finally {
        setFetchLoading(false)
      }
    }

    fetchCourseDetails()
  }, [token, courseId, isEditMode])

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
      id: tutor.tutor_codec,
      name: tutor.name
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
    e.preventDefault();
    if (!token) return;

    if (!validateForm()) {
      setAlert({
        type: "error",
        message: "Please fix the validation errors before submitting",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const requestBody = {
        name: courseName,
        code: courseCode,
        description,
        schedule: {
          days: schedules.map(s => s.day),
          time: schedules.map(s => s.fromTime),
        },
        meeting_link: joinClassLink,
        tutor_id: assignedTutor?.id || "",
        student_ids: assignedStudents.map(s => s.id),
        learning_outcome: learningOutcomes,
        prerequisite: prerequisites,
        department,
        semester
      };
      
      console.log("Request body:", requestBody);
      console.log("Is edit mode:", isEditMode);
      console.log("Course ID:", courseId);

      let response;
      if (isEditMode) {
        // Update existing course
        console.log("Calling updateCourse function");
        response = await updateCourse(token, courseId, requestBody);
        console.log("Course updated successfully:", response);
        setAlert({
          type: "success",
          message: "Course updated successfully!"
        });
      } else {
        // Create new course
        console.log("Calling editClass function");
        response = await editClass(token, requestBody);
        console.log("Course created successfully:", response);
        setAlert({
          type: "success",
          message: "Course created successfully!"
        });
      }
      
      // After successful update/creation, redirect after a delay
      setTimeout(() => {
        if (isEditMode) {
          router.push(`/admin/course/${courseId}`);
        } else {
          router.push("/admin/courses");
        }
      }, 2000);
    } catch (error: any) {
      console.error("Error:", {
        message: error.message,
        stack: error.stack
      });
      
      setAlert({
        type: "error",
        message: error.message || "Failed to save course. Please check the console for details."
      });
      
      // Log validation errors if present
      if (error.response?.data?.errors) {
        console.error("Validation errors:", error.response.data.errors);
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold">{isEditMode ? "Edit Course" : "Create New Course"}</h1>
      </div>

      {alert && (
        <div className="fixed top-5 right-5 z-50">
          <Alert variant={alert.type === "success" ? "success" : "danger"}>
            <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {fetchLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1BC2C2]"></div>
          <span className="ml-3">Loading course details...</span>
        </div>
      ) : (
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
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
            >
              {isSubmitting ? (
                <div className="flex items-center">
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
                  {isEditMode ? "Updating..." : "Creating..."}
                </div>
              ) : (
                <span>{isEditMode ? "Update Course" : "Create Course"}</span>
              )}
            </Button>
          </div>
        </form>
      )}

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

