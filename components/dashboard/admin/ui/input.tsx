"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, type, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border bg-[#F5F5F5] px-3 py-2 text-sm transition-colors",
            "placeholder:text-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-[#1BC2C2] focus:border-transparent",
            error 
              ? "border-red-500 focus:ring-red-500" 
              : "border-gray-200",
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p className={`mt-1 text-sm ${error ? "text-red-500" : "text-gray-500"}`}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }

