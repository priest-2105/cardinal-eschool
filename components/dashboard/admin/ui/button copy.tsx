"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", fullWidth, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-[#1BC2C2] focus:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          variant === "default" && "bg-[#1BC2C2] text-white hover:bg-[#19a8a8]",
          variant === "outline" && "border border-[#1BC2C2] text-[#1BC2C2] hover:bg-[#1BC2C2] hover:text-white",
          size === "default" && "h-10 py-2 px-4",
          size === "sm" && "h-8 px-3 text-sm",
          size === "lg" && "h-12 px-8 text-lg",
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

