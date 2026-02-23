import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, History, LayoutDashboard, Lightbulb, LogOut, Mail, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOutUser } from '../lib/firebaseClient';

const AppSidebar = () => {
    const { profile, user } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isDashboardRoute = location.pathname === '/app';
    const isCalendarRoute = location.pathname === '/app/calendar';
    const isPodsRoute = location.pathname === '/app/pods';
    const isGmailSyncRoute = location.pathname === '/app/gmail-sync';
    const isVisionRoute = location.pathname === '/app/vision';
    const syncLabel = profile?.calendar_connected ? 'Synced' : 'Sync required';

    const navLinkClass = (active: boolean) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
            active ? 'bg-[#1D546D] text-white' : 'text-[#d5dee1] hover:bg-[#1D546D]/55 hover:text-white'
        }`;

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const mobileTabClass = (active: boolean) =>
        `flex-1 border-b-2 pb-2 pt-1 text-center text-[13px] font-semibold transition ${
            active ? 'border-[#5F9598] text-white' : 'border-transparent text-[#9cb2b8]'
        }`;

    return (
        <>
            <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:flex lg:h-full lg:w-60 lg:flex-col lg:bg-[#061E29] lg:p-5">
                <div className="mb-10 flex items-center gap-3 px-1">
                    <img src="/Orca_Logo.png" alt="Orca logo" className="h-10 w-10 rounded-xl bg-white p-1 object-contain" />
                    <span className="text-3xl font-semibold tracking-tight text-white">Orca</span>
                </div>

                <nav className="flex-1 space-y-6">
                    <div>
                        <Link to="/app" className={navLinkClass(isDashboardRoute)}>
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Dashboard</span>
                        </Link>
                    </div>

                    <div className="space-y-2">
                        <p className="px-3 text-xs uppercase tracking-[0.24em] text-[#5F9598]/80">Services</p>
                        <Link to="/app/calendar" className={navLinkClass(isCalendarRoute)}>
                            <CalendarDays className="h-4 w-4" />
                            <span className="inline-flex items-center gap-2">
                                <span>Calendar</span>
                                <span className={`h-2 w-2 rounded-full ${profile?.calendar_connected ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            </span>
                        </Link>
                        <Link to="/app/pods" className={navLinkClass(isPodsRoute)}>
                            <History className="h-4 w-4" />
                            <span>Pod History</span>
                        </Link>
                        <Link to="/app/gmail-sync" className={navLinkClass(isGmailSyncRoute)}>
                            <Mail className="h-4 w-4" />
                            <span>Sync Gmail</span>
                        </Link>
                    </div>
                </nav>

                <div className="mb-4">
                    <Link to="/app/vision" className={navLinkClass(isVisionRoute)}>
                        <Lightbulb className="h-4 w-4" />
                        <span>Our Vision</span>
                    </Link>
                </div>

                <div className="border-t border-white/10 px-3 pt-4">
                    <p className="truncate text-xs text-[#d5dee1]">{user?.email || profile?.username || 'Account'}</p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${profile?.calendar_connected ? 'bg-[#5F9598]' : 'bg-amber-400'}`} />
                        <span className="text-xs text-[#9cb2b8]">{syncLabel}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => signOutUser()}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-medium text-[#d5dee1] hover:border-white/40 hover:text-white"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        Log out
                    </button>
                </div>
            </aside>

            <div className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#061E29] lg:hidden">
                <div className="px-4 pt-3">
                    <div className="flex items-center justify-between gap-3">
                        <Link to="/app" className="inline-flex items-center gap-2">
                            <img src="/Orca_Logo.png" alt="Orca logo" className="h-9 w-9 rounded-lg bg-white p-1 object-contain" />
                            <span className="text-2xl font-semibold tracking-tight text-white">Orca</span>
                        </Link>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen((open) => !open)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-[#d5dee1]"
                                aria-expanded={mobileMenuOpen}
                                aria-label="Open menu"
                            >
                                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                            </button>

                            {mobileMenuOpen && (
                                <div className="absolute right-0 top-[calc(100%+0.5rem)] w-48 rounded-xl border border-white/15 bg-[#082733] p-1.5 shadow-xl">
                                    <Link
                                        to="/app/gmail-sync"
                                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                                            isGmailSyncRoute ? 'bg-[#1D546D] text-white' : 'text-[#d5dee1] hover:bg-[#1D546D]/55 hover:text-white'
                                        }`}
                                    >
                                        <Mail className="h-4 w-4" />
                                        <span>Gmail</span>
                                    </Link>
                                    <Link
                                        to="/app/vision"
                                        className={`mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                                            isVisionRoute ? 'bg-[#1D546D] text-white' : 'text-[#d5dee1] hover:bg-[#1D546D]/55 hover:text-white'
                                        }`}
                                    >
                                        <Lightbulb className="h-4 w-4" />
                                        <span>Our Vision</span>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            signOutUser();
                                        }}
                                        className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[#d5dee1] hover:bg-[#1D546D]/55 hover:text-white"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Log out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <nav className="mt-3 flex items-center gap-1 border-b border-white/15" aria-label="Primary">
                        <Link to="/app" className={mobileTabClass(isDashboardRoute)}>
                            Dashboard
                        </Link>
                        <Link to="/app/calendar" className={mobileTabClass(isCalendarRoute)}>
                            <span className="inline-flex items-center justify-center gap-1">
                                <span>Calendar</span>
                                <span className={`h-1.5 w-1.5 rounded-full ${profile?.calendar_connected ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            </span>
                        </Link>
                        <Link to="/app/pods" className={mobileTabClass(isPodsRoute)}>
                            Pod History
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default AppSidebar;
