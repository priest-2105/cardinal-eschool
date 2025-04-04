"use client"

import { cn } from "@/lib/utils"

interface MultiSelectProps {
  options: { value: string; label: string }[]
  onChange: (selected: string[]) => void
  value: string[]
  className?: string
  placeholder?: string
}

export function MultiSelect({ options, onChange, value = [], className, placeholder }: MultiSelectProps) {
  // Ensure value is always an array
  const safeValue = Array.isArray(value) ? value : []

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-colors",
            "border-2",
            safeValue.includes(option.value)
              ? "border-[#1BC2C2] bg-[#1BC2C2]/10 text-[#1BC2C2]"
              : "border-gray-200 hover:border-[#1BC2C2] hover:bg-[#1BC2C2]/5"
          )}
        >
          <input
            type="checkbox"
            className="hidden"
            value={option.value}
            checked={safeValue.includes(option.value)}
            onChange={(e) => {
              const newValue = e.target.checked
                ? [...safeValue, option.value]
                : safeValue.filter((v) => v !== option.value)
              onChange(newValue)
            }}
          />
          {option.label}
        </label>
      ))}
    </div>
  )
}
