'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FilterModal } from '../coursefilter/index'
import { CourseTable } from '../coursetable/index'
import { Search } from 'lucide-react'
import { Course, FilterValues } from '../types'


const COURSES_DATA: Course[] = [
  {
    id: 1,
    name: "Social Studies",
    tutor: {
      name: "Florence Adekunle",
      email: "florenceadekunle1@gmail.com",
      avatar: "/avatars/florence.jpg"
    },
    schedule: "Wednesday 11th Jan 2025",
    status: "Upcoming",
    dateAdded: "January 5, 2025"
  },
  // Add more courses...
]

const INITIAL_LOAD = 10
const LOAD_MORE_COUNT = 3

export function CourseList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD)
  const [filters, setFilters] = useState<FilterValues>({
    courses: [],
    tutors: [],
    dateRange: {
      from: undefined,
      to: undefined
    },
    status: []
  })

  // Get unique courses and tutors for filter options
  const uniqueCourses = Array.from(new Set(COURSES_DATA.map(course => course.name)))
    .map(name => ({
      id: COURSES_DATA.find(c => c.name === name)?.id || 0,
      name
    }))

  const uniqueTutors = Array.from(new Set(COURSES_DATA.map(course => course.tutor.name)))
    .map(name => ({
      id: COURSES_DATA.findIndex(c => c.tutor.name === name),
      name
    }))

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters)
    setVisibleCount(INITIAL_LOAD)
  }

  // Apply filters and search to courses
  const filteredCourses = COURSES_DATA.filter(course => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tutor.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCourses = 
      filters.courses.length === 0 || 
      filters.courses.includes(course.name)
    
    const matchesTutors = 
      filters.tutors.length === 0 || 
      filters.tutors.includes(course.tutor.name)
    
    const matchesStatus = 
      filters.status.length === 0 || 
      filters.status.includes(course.status)
    
    const matchesDateRange = 
      (!filters.dateRange.from || new Date(course.dateAdded) >= filters.dateRange.from) &&
      (!filters.dateRange.to || new Date(course.dateAdded) <= filters.dateRange.to)
    
    return matchesSearch && matchesCourses && matchesTutors && matchesStatus && matchesDateRange
  })

  const visibleCourses = filteredCourses.slice(0, visibleCount)
  const hasMore = visibleCourses.length < filteredCourses.length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">View Class Lists</h2>
          <p className="text-sm text-muted-foreground">
            Manage and track your enrolled classes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <FilterModal 
            courses={uniqueCourses}
            tutors={uniqueTutors}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      <CourseTable courses={visibleCourses} />
      
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setVisibleCount(prev => prev + LOAD_MORE_COUNT)}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}

