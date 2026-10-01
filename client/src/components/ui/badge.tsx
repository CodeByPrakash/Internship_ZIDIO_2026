import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-xs',
    {
        variants: {
            variant: {
                default:
                    'border-indigo-200 bg-indigo-50/90 text-indigo-700 hover:bg-indigo-100',
                secondary:
                    'border-slate-200 bg-slate-100/90 text-slate-700 hover:bg-slate-200/80',
                destructive:
                    'border-rose-200 bg-rose-50/90 text-rose-700 hover:bg-rose-100',
                outline:
                    'border-slate-300 text-slate-700 bg-white/60',
                success:
                    'border-emerald-200 bg-emerald-50/90 text-emerald-800 hover:bg-emerald-100',
                warning:
                    'border-amber-200 bg-amber-50/90 text-amber-800 hover:bg-amber-100',
                cyan:
                    'border-sky-200 bg-sky-50/90 text-sky-800 hover:bg-sky-100',
            },
        },
        defaultVariants: {
            variant: 'default',
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
