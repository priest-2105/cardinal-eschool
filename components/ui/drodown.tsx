import type React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

// Export DropdownMenu components
export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuContent = DropdownMenuPrimitive.Content
export const DropdownMenuItem = DropdownMenuPrimitive.Item

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
    <SelectPrimitive.Root   value={value} onValueChange={onChange} disabled={disabled}>
      <SelectPrimitive.Trigger
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="overflow-hidden bg-white border border-gray-300 rounded-md shadow-lg"
          position="popper"
          sideOffset={4}
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className={cn(
                  "relative flex items-center px-6 py-2 text-sm rounded-md cursor-default select-none focus:bg-blue-100 focus:text-blue-900",
                  "radix-disabled:opacity-50",
                  "focus:outline-none",
                )}
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

export const DropdownMenuDemo: React.FC = () => {
  return (
    <DropdownMenu>
      <div className="bg-white p-4">
         <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-md hover:bg-gray-100">
          <MoreHorizontal size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[200px] bg-white border border-gray-200 rounded-md shadow-lg p-1">
        <DropdownMenuItem className="px-2 py-1 text-sm cursor-pointer hover:bg-blue-50 rounded-md">
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem className="px-2 py-1 text-sm cursor-pointer hover:bg-blue-50 rounded-md">
          Send Message
        </DropdownMenuItem>
        <DropdownMenuItem className="px-2 py-1 text-sm cursor-pointer hover:bg-blue-50 rounded-md">
          Edit Information
        </DropdownMenuItem>
      </DropdownMenuContent>
      </div>
    </DropdownMenu>
  )
}

