"use client";

export default function CardPaymentSkeleton() {
  return (
    <div className="p-4 space-y-6">
      {/* Header Skeleton */}
      <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>

      {/* Subscription Section Skeleton */}
      <div className="flex flex-col lg:flex-row bg-white justify-between rounded-lg p-4 sm:p-6 space-y-6 lg:space-y-0 lg:space-x-6">
        <div className="flex-1 p-4 sm:p-6 w-full lg:w-1/2 max-w-screen-sm space-y-4">
          <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          <div className="bg-gray-100 p-6 rounded-lg space-y-4">
            <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Right Section Skeleton */}
        <div className="space-y-4 bg-gray-100 p-4 sm:p-6 w-full lg:w-1/2 max-w-screen-sm">
          <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="bg-gray-100 p-4 rounded-lg space-y-4">
            <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg space-y-4">
            <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
