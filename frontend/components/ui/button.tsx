import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EB8] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#005EB8] text-white hover:bg-[#004b94] active:bg-[#003d7a] shadow-xs",
        destructive:
          "bg-[#DC2626] text-white hover:bg-red-700 shadow-xs",
        outline:
          "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs",
        secondary:
          "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700",
        ghost:
          "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
        link:
          "text-[#005EB8] dark:text-blue-400 underline-offset-4 hover:underline p-0 h-auto",
        subtle:
          "bg-blue-50 dark:bg-blue-950/60 text-[#005EB8] dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-900/60",
        glass:
          "bg-white/80 dark:bg-[#21201C]/85 backdrop-blur-md border border-white/60 dark:border-white/10 text-slate-800 dark:text-[#E6E4DD] hover:bg-white/95 dark:hover:bg-[#2B2A26] shadow-xs active:scale-[0.98]",
        neu:
          "bg-white dark:bg-[#21201C] border border-slate-200 dark:border-[#34332E] text-slate-800 dark:text-[#E6E4DD] shadow-[0_2px_5px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.95)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]",
        chip:
          "rounded-full px-3.5 py-1.5 text-xs font-semibold bg-white/90 dark:bg-[#262521] border border-slate-200/90 dark:border-[#383630] text-slate-800 dark:text-[#E6E4DD] shadow-2xs hover:border-[#005EB8] dark:hover:border-[#4D8DF5] hover:text-[#005EB8] dark:hover:text-white hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-5 text-sm",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
