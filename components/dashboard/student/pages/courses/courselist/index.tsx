'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Filter } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectWrapper } from "@/components/ui/select"
import { CourseTable } from '../coursetable/index'
import { useSelector } from 'react-redux'
import type { RootState } from '@/lib/store'
import { getStudentClasses } from '@/lib/api/student/courses/courselist'
import { Button } from "@/components/ui/button"
import { CourseListSkeleton } from "../skeleton"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/dashboard/student/ui/dialog"
import { useRouter } from "next/navigation"


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
  semester: string; // Added this property
}

export function CourseList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedGrade, ] = useState("all")
  const [selectedDay, setSelectedDay] = useState("all"); // Changed from selectedDateRange to selectedDay
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCode, setSelectedCode] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [currentPage,] = useState(1)
  const [, setTotalPages] = useState(1)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null) // For modal
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false) // For mobile filter modal
  const [applyFilters,] = useState(false) // To trigger filter application
  const token = useSelector((state: RootState) => state.auth?.token)
  const router = useRouter()

  
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
              progress_percentage: course.progress_percentage.toString(),
              no_of_students: course.resources.length, 
              schedule: course.schedule,
              tutor: {
                name: course.tutor.name || "Unknown Tutor",
                dp_url: course.tutor.dp_url || "/placeholder.svg",
              },
              semester: course.semester, // Added semester
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
  }, [token, currentPage, applyFilters]) // Trigger fetch when filters are applied

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tutor.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesGrade = selectedGrade === "all"
    const matchesStatus = selectedStatus === "all" 
    const matchesDay =
      selectedDay === "all" || course.schedule.days.includes(selectedDay);
    const matchesCode = selectedCode === "all" || course.code === selectedCode;
    const matchesSemester =
      selectedSemester === "all" || course.semester === selectedSemester;

    return matchesSearch && matchesGrade && matchesStatus && matchesDay && matchesCode && matchesSemester
  })

  if (loading) {
    return <CourseListSkeleton />
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
        <div className="sm:hidden">
          <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-md max-w-[600px] w-[90%]">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Select value={selectedCode} onValueChange={setSelectedCode}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Course Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Codes</SelectItem>
                    {Array.from(new Set(courses.map((course) => course.code))).map(
                      (code) => (
                        <SelectItem key={code} value={code}>
                          {code}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>

                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {Array.from(new Set(courses.map((course) => course.semester))).map(
                      (semester) => (
                        <SelectItem key={semester} value={semester}>
                          {semester}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Day of Week" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Days</SelectItem>
                    <SelectItem value="Monday">Monday</SelectItem>
                    <SelectItem value="Tuesday">Tuesday</SelectItem>
                    <SelectItem value="Wednesday">Wednesday</SelectItem>
                    <SelectItem value="Thursday">Thursday</SelectItem>
                    <SelectItem value="Friday">Friday</SelectItem>
                    <SelectItem value="Saturday">Saturday</SelectItem>
                    <SelectItem value="Sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                <Button
                  variant="default"
                  className="w-full mt-4"
                  onClick={() => setIsFilterModalOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="hidden sm:flex flex-row gap-4 mb-6">
        <SelectWrapper>
        <Select value={selectedCode} onValueChange={setSelectedCode}>
          <SelectTrigger  className="w-[200px]">
            <SelectValue placeholder="Course Code" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Codes</SelectItem>
            {Array.from(new Set(courses.map((course) => course.code))).map(
              (code) => (
                <SelectItem key={code} value={code}>
                  {code}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        </SelectWrapper>

        <SelectWrapper>
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger  className="w-[200px]">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            {Array.from(new Set(courses.map((course) => course.semester))).map(
              (semester) => (
                <SelectItem key={semester} value={semester}>
                  {semester}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        </SelectWrapper>

        <SelectWrapper>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger  className="w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        </SelectWrapper>

       <SelectWrapper>
        <Select value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger  className="w-[200px]">
            <SelectValue placeholder="Day of Week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Days</SelectItem>
            <SelectItem value="Monday">Monday</SelectItem>
            <SelectItem value="Tuesday">Tuesday</SelectItem>
            <SelectItem value="Wednesday">Wednesday</SelectItem>
            <SelectItem value="Thursday">Thursday</SelectItem>
            <SelectItem value="Friday">Friday</SelectItem>
            <SelectItem value="Saturday">Saturday</SelectItem>
            <SelectItem value="Sunday">Sunday</SelectItem>
          </SelectContent>
        </Select>
        </SelectWrapper>

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

      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <BookOpen className="h-16 w-16 text-gray-300" />
          <p className="text-lg font-medium text-gray-600">No results found</p>
          <p className="text-sm text-gray-500">Try adjusting your filters to see more results</p>
        </div>
      ) : (
        <CourseTable
          courses={filteredCourses}
          onRowClick={(course) =>
            setSelectedCourse({
              ...course, 
            })
          }
        />
      )}

      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="bg-white rounded-md max-w-[600px] w-[90%]">
          {selectedCourse && (
            <div className="p-4 space-y-4">
              <DialogTitle>Course Details</DialogTitle>
              <div className="grid grid-cols-2 gap-4">
                <div className="font-medium">Tutor</div>
                <div>{selectedCourse.tutor.name}</div>
                <div className="font-medium">Course Name</div>
                <div>{selectedCourse.name}</div>
                <div className="font-medium">Course Code</div>
                <div>{selectedCourse.code}</div>
                <div className="font-medium">Progress</div>
                <div>{selectedCourse.progress_percentage}%</div>
                <div className="font-medium">Schedule</div>
                <div>
                  {selectedCourse.schedule.days.map((day, index) => (
                    <div key={`${selectedCourse.id}-${day}`}>
                      {`${day} at ${selectedCourse.schedule.time[index]}`}
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="default"
                className="w-full mt-4"
                onClick={() => router.push(`/student/course/${selectedCourse.id}`)}
              >
                View Class
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
