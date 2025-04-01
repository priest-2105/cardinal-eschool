"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FilterModal } from "../coursefilter/index"
import { CourseTable } from "../coursetable/index"
import { Search, Plus } from "lucide-react"
import type { Course, FilterValues } from "../types"
import { useRouter } from "next/navigation"
import { getTutorClasses } from "@/lib/api/admin/managecourses/courselist"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Alert } from "@/components/ui/alert"

const INITIAL_LOAD = 10
const LOAD_MORE_COUNT = 5

export function CourseList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD)
  const [_filters, setFilters] = useState<FilterValues>({
    courses: [],
    tutors: [],
    admins: [],
    dateRange: {
      from: undefined,
      to: undefined,
    },
    status: [],
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth?.token)

  const fetchCourses = async () => {
    if (!token) return

    setLoading(true)
    try {
      const response = await getTutorClasses(token)
      const formattedCourses = response.data.classes.map(course => ({
        id: course.class_id,
        name: course.name,
        grade: "10", // You might want to add this to your API response
        noOfStudent: course.no_of_students,
        schedule: `${course.schedule.days.join(", ")} ${course.schedule.time.join(" - ")}`,
        status: "Active", // You might want to add this to your API response
        dateAdded: new Date().toISOString().split('T')[0], // You might want to add this to your API response
      }))
      setCourses(formattedCourses)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch courses")
    } finally {
      setLoading(false)
    }
  }

  

  useEffect(() => {
    fetchCourses()
  }, [token])

  const filteredCourses = courses.filter((course) => {
    const nameMatch = course.name.toLowerCase().includes(searchQuery.toLowerCase())
    const scheduleMatch = course.schedule.toLowerCase().includes(searchQuery.toLowerCase())
    return nameMatch || scheduleMatch
  })

  const uniqueCourses = [
    ...new Map(filteredCourses.map((course) => [course.name, { id: course.id, name: course.name }])).values(),
  ]

  const visibleCourses = filteredCourses.slice(0, visibleCount)
  const hasMore = visibleCourses.length < filteredCourses.length

  const handleCreateCourse = () => {
    router.push("/admin/createcourse")
  }

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters)
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

      {error ? (
        <Alert variant="danger" className="mb-4">{error}</Alert>
      ) : loading ? (
        <div className="flex items-center justify-center h-32">Loading courses...</div>
      ) : (
        <CourseTable courses={visibleCourses} />
      )}

      {hasMore && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}>
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}

