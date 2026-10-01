import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Video, ArrowRight, Menu, X, Sparkles } from 'lucide-react';

export default function PublicNavbar() {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Features', href: '/#features' },
        { name: 'Solutions', href: '/solutions' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Resources', href: '/resources' },
    ];

    const isActive = (href: string) => {
        if (href.startsWith('/#')) {
            return location.pathname === '/' && location.hash === href.replace('/', '');
        }
        return location.pathname === href;
    };

    return (
        <header className="sticky top-0 z-50 w-full px-6 sm:px-12 lg:px-16 py-4 transition-all bg-white/70 backdrop-blur-xl border-b border-white/80 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
                        <Video className="w-5 h-5 text-white fill-white/20" />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-2xl font-black tracking-tight text-slate-900">
                            Intell<span className="text-indigo-600">Meet</span>
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 tracking-wider">
                            AI
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav Links (Centered) */}
                <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60 backdrop-blur-md">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                                    active
                                        ? 'bg-white text-indigo-600 shadow-sm font-bold'
                                        : 'text-slate-700 hover:text-indigo-600 hover:bg-white/50'
                                }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="hidden sm:flex items-center gap-4">
                    <Link
                        to="/login"
                        className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors px-3 py-1.5"
                    >
                        Sign In
                    </Link>
                    <Link to="/signup">
                        <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                            <span>Get Started</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>

                {/* Mobile Hamburger Button */}
                <div className="flex sm:hidden items-center gap-2">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden mt-3 p-4 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-xl space-y-3">
                    <div className="flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    isActive(link.href)
                                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                                        : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                        <Link
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full"
                        >
                            <button className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2">
                                <span>Get Started Free</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
