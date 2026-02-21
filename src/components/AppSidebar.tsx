import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, LogOut, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOutUser } from '../lib/firebaseClient';

const AppSidebar = () => {
    const { profile, user } = useAuth();
    const location = useLocation();

    const isDashboardRoute = location.pathname === '/app';
    const isCalendarRoute = location.pathname === '/app/calendar';
    const isGmailSyncRoute = location.pathname === '/app/gmail-sync';
    const syncLabel = profile?.calendar_connected ? 'Synced' : 'Sync required';

    const navLinkClass = (active: boolean) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
            active ? 'bg-[#1D546D] text-white' : 'text-[#d5dee1] hover:bg-[#1D546D]/55 hover:text-white'
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
                            <span>Calendar</span>
                        </Link>
                        <Link to="/app/gmail-sync" className={navLinkClass(isGmailSyncRoute)}>
                            <Mail className="h-4 w-4" />
                            <span>Sync Gmail</span>
                        </Link>
                    </div>
                </nav>

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

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#061E29] px-4 py-3 lg:hidden">
                <div className="mb-2 flex items-center justify-center gap-2 text-xs text-[#9cb2b8]">
                    <span className={`h-2 w-2 rounded-full ${profile?.calendar_connected ? 'bg-[#5F9598]' : 'bg-amber-400'}`} />
                    <span>{syncLabel}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    <Link
                        to="/app"
                        className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs ${
                            isDashboardRoute ? 'bg-[#1D546D] text-white' : 'text-[#d5dee1]'
                        }`}
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        to="/app/calendar"
                        className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs ${
                            isCalendarRoute ? 'bg-[#1D546D] text-white' : 'text-[#d5dee1]'
                        }`}
                    >
                        <CalendarDays className="h-4 w-4" />
                        <span>Calendar</span>
                    </Link>
                    <Link
                        to="/app/gmail-sync"
                        className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs ${
                            isGmailSyncRoute ? 'bg-[#1D546D] text-white' : 'text-[#d5dee1]'
                        }`}
                    >
                        <Mail className="h-4 w-4" />
                        <span>Gmail</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => signOutUser()}
                        className="flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs text-[#d5dee1]"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default AppSidebar;
