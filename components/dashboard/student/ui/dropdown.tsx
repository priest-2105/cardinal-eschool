import type React from "react"
import * as Select from "@radix-ui/react-select"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className,
}) => {
  return (
    <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
      <Select.Trigger
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="overflow-hidden bg-white border border-gray-300 rounded-md shadow-lg"
          position="popper"
          sideOffset={4}
        >
          <Select.Viewport className="p-1">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className={cn(
                  "relative flex items-center px-6 py-2 text-sm rounded-md cursor-default select-none focus:bg-blue-100 focus:text-blue-900",
                  "radix-disabled:opacity-50",
                  "focus:outline-none",
                )}
              >
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

