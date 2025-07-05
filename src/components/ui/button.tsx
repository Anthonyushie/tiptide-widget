import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold tracking-wide ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground brutal-border brutal-shadow hover:brutal-shadow-hover hover:translate-x-[-2px] hover:translate-y-[-2px] active:brutal-shadow-sm active:translate-x-[1px] active:translate-y-[1px]",
        destructive:
          "bg-destructive text-destructive-foreground brutal-border brutal-shadow hover:brutal-shadow-hover hover:translate-x-[-2px] hover:translate-y-[-2px] active:brutal-shadow-sm active:translate-x-[1px] active:translate-y-[1px]",
        outline:
          "border-2 border-border bg-background text-foreground brutal-shadow hover:brutal-shadow-hover hover:translate-x-[-2px] hover:translate-y-[-2px] active:brutal-shadow-sm active:translate-x-[1px] active:translate-y-[1px]",
        secondary:
          "bg-secondary text-secondary-foreground brutal-border brutal-shadow hover:brutal-shadow-hover hover:translate-x-[-2px] hover:translate-y-[-2px] active:brutal-shadow-sm active:translate-x-[1px] active:translate-y-[1px]",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground border-2 border-transparent hover:border-accent/20",
        link: "text-accent underline-offset-4 hover:underline font-semibold",
        accent: "bg-accent text-accent-foreground brutal-border brutal-shadow-accent hover:brutal-shadow-hover hover:translate-x-[-2px] hover:translate-y-[-2px] active:brutal-shadow-sm active:translate-x-[1px] active:translate-y-[1px]",
        bitcoin: "bg-bitcoin text-primary-foreground brutal-border brutal-shadow-bitcoin hover:brutal-shadow-hover hover:translate-x-[-2px] hover:translate-y-[-2px] active:brutal-shadow-sm active:translate-x-[1px] active:translate-y-[1px]",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-md",
        sm: "h-9 px-3 py-1 rounded-md text-xs",
        lg: "h-12 px-6 py-3 rounded-md text-base",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }