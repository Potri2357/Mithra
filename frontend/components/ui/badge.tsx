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
        chip:
          "rounded-full px-3 py-1 text-xs font-semibold bg-white/85 dark:bg-[#23221E]/90 border-slate-200/90 dark:border-[#3C3A33] text-slate-800 dark:text-[#E6E4DD] shadow-2xs backdrop-blur-md",
        chipInteractive:
          "rounded-full px-3 py-1 text-xs font-semibold bg-white/90 dark:bg-[#23221E]/90 border-slate-200 dark:border-[#3C3A33] text-slate-800 dark:text-[#E6E4DD] hover:border-[#005EB8] dark:hover:border-[#4D8DF5] hover:text-[#005EB8] dark:hover:text-white shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 cursor-pointer transition-all backdrop-blur-md",
        glass:
          "rounded-full px-3 py-0.5 text-xs font-semibold bg-white/70 dark:bg-[#181816]/75 border-white/60 dark:border-white/10 text-slate-900 dark:text-[#F5F4ED] shadow-sm backdrop-blur-md",
        neu:
          "rounded-full px-3 py-1 text-xs font-semibold bg-white dark:bg-[#21201C] border-slate-200 dark:border-[#34332E] text-slate-800 dark:text-[#E6E4DD] shadow-[0_2px_5px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]",
        standard:
          "font-mono font-bold text-[11px] px-2.5 py-0.5 rounded-md bg-blue-50/90 dark:bg-blue-950/50 text-[#005EB8] dark:text-blue-300 border-blue-200/80 dark:border-blue-900/60 shadow-2xs",
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
