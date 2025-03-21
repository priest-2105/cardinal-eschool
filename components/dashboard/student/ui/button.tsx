import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#1BC2C2] text-white hover:bg-[#19a8a8] focus-visible:ring-[#1BC2C2]",
        danger: "bg-[#c21b1b] text-white hover:bg-[#be5737] focus-visible:ring-[#c2421b]",
        warning: "bg-[#e4d726] text-white hover:bg-[#be9a37] focus-visible:ring-[#c2b11b]",
        outline: "border border-[#1BC2C2] text-[#1BC2C2] hover:bg-[#fffde9] focus-visible:ring-[#c2951b]",
        ghost: "text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
  return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = "Button"

export { Button, buttonVariants }

