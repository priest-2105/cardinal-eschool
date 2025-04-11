"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, FileText } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" 
import { ViewCourseModal } from "../viewStudentCourseModal/index" 

export interface Student {
  id: string
  name: string
  email: string
}
 

export interface Course {
  id: string
  title: string
  subject: string
  grade: string
  dateSubmitted: Date
  studentId: string
  content: string
}

const SAMPLE_STUDENTS: Student[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com" },
  { id: "2", name: "Bob Smith", email: "bob@example.com" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com" },
]

const SAMPLE_REPORTS: Course[] = [
  {
    id: "1",
    title: "Midterm Exam Results",
    subject: "Basic Science",
    grade: "A",
    dateSubmitted: new Date(2024, 5, 15),
    studentId: "1",
    content: "Alice demonstrated excellent understanding of basic scientific principles...",
  },
  {
    id: "2",
    title: "Lab Course: Energy Conservation",
    subject: "Physics",
    grade: "B+",
    dateSubmitted: new Date(2025, 6, 1),
    studentId: "2",
    content: "Bob's lab course on energy conservation showed good analytical skills...",
  },
]

export default function CoursesList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [courses, setCourses] = useState(SAMPLE_REPORTS)
  const [dateFilter, setDateFilter] = useState("all")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [studentFilter, _setStudentFilter] = useState("all")
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    filterCourses(term, dateFilter, studentFilter)
  }

  const handleDateFilter = (value: string) => {
    setDateFilter(value)
    filterCourses(searchTerm, value, studentFilter)
  }


  const filterCourses = (term: string, date: string, student: string) => {
    let filteredCourses = SAMPLE_REPORTS.filter(
      (course) =>
        course.title.toLowerCase().includes(term.toLowerCase()) ||
        course.subject.toLowerCase().includes(term.toLowerCase()),
    )

    if (student !== "all") {
      filteredCourses = filteredCourses.filter((course) => course.studentId === student)
    }

    const now = new Date()
    switch (date) {
      case "week":
        filteredCourses = filteredCourses.filter(
          (course) => course.dateSubmitted >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        )
        break
      case "month":
        filteredCourses = filteredCourses.filter(
          (course) => course.dateSubmitted >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
        )
        break
      case "year":
        filteredCourses = filteredCourses.filter(
          (course) => course.dateSubmitted >= new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        )
        break
    }

    setCourses(filteredCourses)
  }
  

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course)
    setIsViewModalOpen(true)
  }


  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Student Courses</h2>
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <Select onValueChange={handleDateFilter} defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="week">Past week</SelectItem>
            <SelectItem value="month">Past month</SelectItem>
            <SelectItem value="year">Past year</SelectItem>
          </SelectContent>
        </Select> 
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="mb-2 sm:mb-0">
              <h3 className="font-medium">{course.title}</h3>
              <p className="text-sm text-gray-500">
                {course.subject} • Grade: {course.grade}
              </p>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Calendar size={12} className="mr-1" />
                {format(course.dateSubmitted, "MMM d, yyyy")}
              </p>
              
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
              <Button variant="outline" size="sm" onClick={() => handleViewCourse(course)}>
                <FileText size={16} className="mr-2" />
                View
              </Button> 
            </div>
          </div>
        ))}
      </div> 
      <ViewCourseModal
        course={selectedCourse}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        students={SAMPLE_STUDENTS}
      />
     
    </div>
  )
}

