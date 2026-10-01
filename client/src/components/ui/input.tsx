import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon, ...props }, ref) => {
        if (icon) {
            return (
                <div className="relative flex items-center w-full">
                    <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-500">
                        {icon}
                    </div>
                    <input
                        type={type}
                        className={cn(
                            'flex h-11 w-full rounded-xl border border-slate-200/90 bg-white/80 pl-10 pr-4 py-2 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25 focus-visible:border-indigo-500 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
            );
        }

        return (
            <input
                type={type}
                className={cn(
                    'flex h-11 w-full rounded-xl border border-slate-200/90 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25 focus-visible:border-indigo-500 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';

export { Input };
