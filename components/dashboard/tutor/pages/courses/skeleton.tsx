"use client"

export function CourseListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="space-y-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  )
}
