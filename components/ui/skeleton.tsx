import type React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  count?: number
}

export function Skeleton({ className, count = 1, ...props }: SkeletonProps) {
  const renderSkeletons = () => {
    return Array(count)
      .fill(0)
      .map((_, index) => <div key={index} className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />)
  }

  return count > 1 ? (
    <>{renderSkeletons()}</>
  ) : (
    <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
  )
}

export function NotificationSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="flex items-start gap-4 p-4 border-b">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex items-center gap-2 pt-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex justify-between items-center mb-3">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton className="h-8 w-1/2 mb-1" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  )
}

export function TableRowSkeleton({ columns }: { columns: number }) {
  return (
    <div className="flex items-center space-x-4 py-3">
      {Array(columns)
        .fill(0)
        .map((_, index) => (
          <Skeleton
            key={index}
            className={`h-4 ${index === 0 ? "w-1/6" : index === columns - 1 ? "w-1/12" : "w-1/4"}`}
          />
        ))}
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <Skeleton className="h-24 w-24 rounded-full" />
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
      <div className="w-full space-y-3 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}

