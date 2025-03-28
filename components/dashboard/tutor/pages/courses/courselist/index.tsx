'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CourseTable } from '../coursetable/index'
import { getTutorClasses } from '@/lib/api/tutor/courses/courselist'
import { useSelector } from 'react-redux'
import type { RootState } from '@/lib/store'
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/tutor/ui/alert"

interface Course {
  class_id: number
  name: string
  code: string
  no_of_students: number
  schedule: {
    days: string[]
    time: string[]
  }
}

export function CourseList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [selectedDateRange, setSelectedDateRange] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const token = useSelector((state: RootState) => state.auth?.token)

  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) return
      setLoading(true)
      try {
        const response = await getTutorClasses(token)
        setCourses(response.data.classes)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [token])

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesGrade = selectedGrade === "all" // Add grade filtering logic if needed
    const matchesStatus = selectedStatus === "all" // Add status filtering logic if needed
    const matchesDate = selectedDateRange === "all" // Add date filtering logic if needed
    
    return matchesSearch && matchesGrade && matchesStatus && matchesDate
  })

  if (loading) {
    return <div className="text-center py-12">Loading courses...</div>
  }

  if (error) {
    return (
      <Alert variant="danger">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="sm:flex max-sm:block max-sm:pb-3 items-center justify-between">
        <div className="space-y-1 max-sm:pb-3">
          <h2 className="text-2xl font-semibold">View Course Lists</h2>
          <p className="text-sm text-muted-foreground">
            Manage and track your enrolled courses
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {[...Array(12)].map((_, i) => (
              <SelectItem key={i} value={`${i + 1}`}>
                Grade {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Date Added" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="last7days">Last 7 Days</SelectItem>
            <SelectItem value="last30days">Last 30 Days</SelectItem>
            <SelectItem value="last90days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
      </div>

      <CourseTable courses={filteredCourses} />
    </div>
  )
}

