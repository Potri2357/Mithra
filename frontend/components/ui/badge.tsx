import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#005EB8] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#005EB8] text-white shadow-2xs",
        secondary:
          "border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
        destructive:
          "border-transparent bg-[#DC2626] text-white shadow-2xs",
        outline:
          "text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900",
        blue:
          "border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/60 text-[#005EB8] dark:text-blue-300",
        success:
          "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-300",
        warning:
          "border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/60 text-[#D97706] dark:text-amber-300",
        danger:
          "border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/60 text-[#DC2626] dark:text-red-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
