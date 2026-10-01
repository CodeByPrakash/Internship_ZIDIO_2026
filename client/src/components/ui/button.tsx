import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2.5 whitespace-nowrap text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]',
    {
        variants: {
            variant: {
                default:
                    'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/40 border border-indigo-400/30',
                destructive:
                    'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-500/25 hover:from-rose-500 hover:to-red-500 border border-rose-400/30',
                outline:
                    'border border-slate-200/90 bg-white/90 hover:bg-white hover:border-slate-300 text-slate-800 shadow-xs hover:shadow-sm backdrop-blur-md',
                secondary:
                    'bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200/80 shadow-xs',
                ghost:
                    'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                link:
                    'text-indigo-600 underline-offset-4 hover:underline p-0 h-auto font-bold',
                glow:
                    'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:brightness-105 border border-white/30',
            },
            size: {
                default: 'h-11 px-6 py-2.5 rounded-full text-sm',
                sm: 'h-9 px-4 py-1.5 rounded-full text-xs',
                lg: 'h-12 px-8 py-3 rounded-full text-base',
                icon: 'h-10 w-10 rounded-full p-0 flex items-center justify-center',
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
