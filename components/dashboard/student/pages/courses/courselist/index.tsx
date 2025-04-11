'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Search, BookOpen } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CourseTable } from '../coursetable/index'
import { useSelector } from 'react-redux'
import type { RootState } from '@/lib/store'
import { getStudentClasses } from '@/lib/api/student/courses/courselist'
import { Button } from "@/components/ui/button"

// Define the API response type for a course
interface ApiCourse {
  id: number;
  name: string;
  code: string;
  description: string;
  schedule: {
    days: string[];
    time: string[];
  };
  meeting_link: string;
  status: string;
  progress_percentage: number;
  days_remaining: number | null;
  start_date: string | null;
  end_date: string | null;
  department: string;
  semester: string;
  tutor: {
    id: string;
    name: string;
    dp_url: string | null;
  };
  resources: {
    id: string;
    name: string;
    file_path: string;
  }[];
}

interface Course {
  id: number; // Changed from class_id to id
  name: string;
  code: string;
  progress_percentage: string;
  no_of_students: number; // Added this property
  schedule: {
    days: string[];
    time: string[];
  };
  tutor: {
    name: string;
    dp_url: string;
  }; // Added this property
}

export function CourseList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [selectedDateRange, setSelectedDateRange] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const token = useSelector((state: RootState) => state.auth?.token)
  // const perPage = 10

  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const response = await getStudentClasses(token);
        if (response.status === "success") {
          setCourses(
            response.data.classes.map((course: ApiCourse) => ({
              id: course.id,
              name: course.name,
              code: course.code,
              progress_percentage: course.progress_percentage.toString(), // Convert to string
              no_of_students: course.resources.length, // Use resources length as a placeholder
              schedule: course.schedule,
              tutor: {
                name: course.tutor.name || "Unknown Tutor",
                dp_url: course.tutor.dp_url || "/placeholder.svg",
              },
            }))
          );
          setTotalPages(response.data.total_pages);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        if (errorMessage.includes("401")) {
          setError("Session expired. Please login again.");
        } else {
          setError("No courses available at this time. Please contact support.");
        }
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token, currentPage])

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tutor.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesGrade = selectedGrade === "all"
    const matchesStatus = selectedStatus === "all" 
    const matchesDate = selectedDateRange === "all"
    
    return matchesSearch && matchesGrade && matchesStatus && matchesDate
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1BC2C2] mr-3"></div>
        <p>Loading courses...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-500 text-lg font-medium">{error}</div>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <BookOpen className="h-16 w-16 text-gray-300" />
        <p className="text-lg font-medium text-gray-600">No courses available</p>
        <p className="text-sm text-gray-500">Please contact support for assistance</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="sm:flex max-sm:block max-sm:pb-3 items-center justify-between">
        <div className="space-y-1 max-sm:pb-3">
          <h2 className="text-2xl font-semibold">My Courses</h2>
          <p className="text-sm text-muted-foreground">
            View and manage your enrolled courses
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <Select value={currentPage.toString()} onValueChange={(value) => setCurrentPage(parseInt(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`Page ${currentPage} of ${totalPages}`} />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <SelectItem key={page} value={page.toString()}>
                  Page {page} of {totalPages}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
