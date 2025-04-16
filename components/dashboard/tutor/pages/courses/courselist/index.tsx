'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Search, Filter, BookOpen } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectWrapper } from "@/components/ui/select"
import { CourseTable } from '../coursetable/index'
import { getTutorClasses } from '@/lib/api/tutor/courses/courselist'
import { useSelector } from 'react-redux'
import type { RootState } from '@/lib/store'
import { Pagination } from "@/src/components/ui/pagination"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogFooter } from "@/components/dashboard/student/ui/dialog"
import { Button } from "@/components/ui/button"
import { CourseListSkeleton } from "../skeleton"
import { useRouter } from 'next/navigation';

interface ApiCourse {
  class_id: number;
  name: string;
  code: string;
  no_of_students: number;
  schedule: {
    days: string[];
    time: string[];
  };
  status: string;
  progress_percentage: number;
  days_remaining: number | null;
  start_date: string | null;
  end_date: string | null;
  department: string;
  semester: string;
  meeting_link: string;
  resource_count: number;
}

interface Course extends ApiCourse {
  id: number; // Alias for class_id
}

export function CourseList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [selectedDay, setSelectedDay] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
  const token = useSelector((state: RootState) => state.auth?.token)

  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) {
        setError("Authentication token is missing.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await getTutorClasses(token, currentPage);
        if (response.status === "success") {
          setCourses(
            response.data.classes.map((course: ApiCourse) => ({
              ...course,
              id: course.class_id, // Map class_id to id
            }))
          );
          setTotalPages(response.data.total_pages);
        } else {
          setError(response.message || "Failed to fetch courses.");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token, currentPage])

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === "all" || course.status === selectedStatus
    const matchesSemester = selectedSemester === "all" || course.semester === selectedSemester
    const matchesDay = selectedDay === "all" || course.schedule.days.includes(selectedDay)

    return matchesSearch && matchesStatus && matchesSemester && matchesDay
  })

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

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
          <h2 className="text-2xl font-semibold">View Course Lists</h2>
          <p className="text-sm text-muted-foreground">
            Manage and track your assigned courses
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
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
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
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
        </SelectWrapper>

        <SelectWrapper>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-[200px]">
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
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-[200px]">
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
          <p className="text-lg font-medium text-gray-600">No results found</p>
          <p className="text-sm text-gray-500">Try adjusting your filters to see more results</p>
        </div>
      ) : (
        <CourseTable
          courses={filteredCourses}
          onRowClick={(course) => {
            setSelectedCourse(course)
            setIsCourseModalOpen(true)
          }}
        />
      )}

      <Dialog open={isCourseModalOpen} onOpenChange={setIsCourseModalOpen}>
        <DialogContent className="bg-white rounded-md max-w-[600px] w-[90%]">
          {selectedCourse && (
            <div className="p-4 space-y-4">
              <DialogTitle>Course Details</DialogTitle>
              <div className="grid grid-cols-2 gap-4">
                <div className="font-medium">Course Name</div>
                <div>{selectedCourse.name}</div>
                <div className="font-medium">Course Code</div>
                <div>{selectedCourse.code}</div>
                <div className="font-medium">No. of Students</div>
                <div>{selectedCourse.no_of_students}</div>
                <div className="font-medium">Semester</div>
                <div>{selectedCourse.semester}</div>
                <div className="font-medium">Department</div>
                <div>{selectedCourse.department}</div>
                <div className="font-medium">Schedule</div>
                <div>
                  {selectedCourse.schedule.days.map((day, index) => (
                    <div key={`${selectedCourse.id}-${day}`}>
                      {`${day} at ${selectedCourse.schedule.time[index]}`}
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="default"
                  className="w-full mt-4"
                  onClick={() => router.push(`/tutor/course/${selectedCourse.id}`)}
                >
                  View Class
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {!loading && courses.length > 0 && (
        <div className="flex justify-end mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

