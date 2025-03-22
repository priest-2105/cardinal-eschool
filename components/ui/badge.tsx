import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#1BC2C2] text-[#1BC2C2]-foreground hover:bg-[#1BC2C2]/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        info: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-[#c2421b] text-[#c2421b]-foreground hover:bg-[#c2421b]/80",
        outline: "text-[#1BC2C2] border border-[#1BC2C2]",
        success: "border-transparent text-destructive-foreground bg-green-200 text-green-800",
        warning: "border-transparent bg-[#e4d726] text-[#fff]-foreground hover:bg-[#e4d726]/80"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

