"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  helperText?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          className={cn(
            "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[#1BC2C2] focus:border-transparent",
            error 
              ? "border-red-500 focus:ring-red-500" 
              : "border-gray-200",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {helperText && (
          <p className={`mt-1 text-sm ${error ? "text-red-500" : "text-gray-500"}`}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }

