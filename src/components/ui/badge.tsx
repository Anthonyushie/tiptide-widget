import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border-2 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-border bg-background text-foreground brutal-shadow-sm",
        secondary:
          "border-border bg-secondary text-secondary-foreground brutal-shadow-sm",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground brutal-shadow-sm",
        outline: "border-border text-foreground brutal-shadow-sm",
        accent: "border-accent bg-accent text-accent-foreground brutal-shadow-accent",
        success: "border-success bg-success text-accent-foreground brutal-shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }