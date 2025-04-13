"use client";

export default function AssessmentListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-100 rounded-lg animate-pulse"
          >
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <div className="h-8 w-20 bg-gray-300 rounded"></div>
              <div className="h-8 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
    </div>
  );
}
