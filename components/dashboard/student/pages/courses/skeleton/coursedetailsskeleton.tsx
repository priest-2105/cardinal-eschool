export function CourseListSkeleton() {
    return (
      <div className="space-y-6">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
  
        {/* Filters Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-10 bg-gray-300 rounded w-[150px]"></div>
          ))}
          <div className="relative flex-1">
            <div className="h-10 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
  
        {/* Course List Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse flex items-center space-x-4 p-4 border border-gray-200 rounded-md"
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  