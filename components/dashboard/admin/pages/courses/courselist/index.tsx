"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FilterModal } from "../coursefilter/index"
import { CourseTable } from "../coursetable/index"
import { Search, Plus } from "lucide-react"
import type { Course, FilterValues } from "../types"
import { CreateCourseModal } from "../createCourseModal/index"
import { useRouter } from "next/navigation"


const COURSES_DATA: Course[] = [
  {
    id: 1,
    name: "Introduction to Programming",
    grade: 10,
    noOfStudent: 20,
    schedule: "Monday, Wednesday 10:00 AM - 11:30 AM",
    status: "Active",
    dateAdded: "2024-03-01",
  },
  {
    id: 2,
    name: "Advanced JavaScript",
    grade: 10,
    noOfStudent: 15,
    schedule: "Tuesday, Thursday 2:00 PM - 3:30 PM",
    status: "Upcoming",
    dateAdded: "2024-04-15",
  },
]

const INITIAL_LOAD = 10
const LOAD_MORE_COUNT = 5

export function CourseList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_filters, setFilters] = useState<FilterValues>({
    courses: [],
    tutors: [],
    admins: [], // Add this line
    dateRange: {
      from: undefined,
      to: undefined,
    },
    status: [],
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const router = useRouter()
  const filteredCourses = COURSES_DATA.filter((course) => {
    const nameMatch = course.name.toLowerCase().includes(searchQuery.toLowerCase())
    const scheduleMatch = course.schedule.toLowerCase().includes(searchQuery.toLowerCase())
    return nameMatch || scheduleMatch
  })

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters)
  }

  const uniqueCourses = [
    ...new Map(filteredCourses.map((course) => [course.name, { id: course.id, name: course.name }])).values(),
  ]

  const visibleCourses = filteredCourses.slice(0, visibleCount)
  const hasMore = visibleCourses.length < filteredCourses.length

  const handleCreateCourse = () => {
    router.push("/admin/createcourse")
  }

  return (
    <div className="space-y-4 max-h-[80vh] h-full overflow-hidden">
      <div className="sm:flex max-sm:block max-sm:pb-3 items-center justify-between">
        <div className="space-y-1 max-sm:pb-3">
          <h2 className="text-2xl font-semibold">Manage Courses</h2>
          <p className="text-sm text-muted-foreground">Create, view, and manage courses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreateCourse}>
            <Plus className="mr-2 h-4 w-4" /> Create Course
          </Button>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <FilterModal courses={uniqueCourses} onFilterChange={handleFilterChange} />
        </div>
      </div>

      <CourseTable courses={visibleCourses} />

      {hasMore && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}>
            Load More
          </Button>
        </div>
      )}

      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCourse}
      />
    </div>
  )
}

