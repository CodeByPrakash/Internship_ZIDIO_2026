import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]',
    {
        variants: {
            variant: {
                default:
                    'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-indigo-500 hover:shadow-indigo-500/35 border border-indigo-400/30',
                destructive:
                    'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-rose-500/20 hover:from-red-400 hover:to-rose-500 border border-red-400/30',
                outline:
                    'border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 text-slate-200 backdrop-blur-sm',
                secondary:
                    'bg-slate-800/80 text-slate-100 hover:bg-slate-700/90 border border-white/10 backdrop-blur-md shadow-sm',
                ghost:
                    'text-slate-300 hover:bg-white/[0.06] hover:text-white',
                link:
                    'text-indigo-400 underline-offset-4 hover:underline p-0 h-auto',
                glow:
                    'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:brightness-110 border border-white/20',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-8 rounded-lg px-3 text-xs',
                lg: 'h-12 rounded-xl px-6 text-base font-semibold',
                icon: 'h-9 w-9 rounded-lg',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
