import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[1.5rem] text-base font-display font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 active:translate-y-[4px] active:shadow-none duration-150 ease-out",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-button hover:brightness-105",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-button",
        outline: "border-2 border-border bg-background text-foreground hover:bg-muted shadow-sm active:translate-y-[1px]",
        secondary: "bg-secondary text-secondary-foreground shadow-button hover:brightness-105",
        ghost: "hover:bg-muted text-muted-foreground shadow-none translate-y-0 active:translate-y-0",
        link: "text-primary underline-offset-4 hover:underline shadow-none translate-y-0 active:translate-y-0",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 rounded-[1.2rem] px-4 text-xs",
        lg: "h-16 rounded-[2rem] px-10 text-xl",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
