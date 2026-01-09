import { useLocation, Link } from 'react-router-dom';
import { Calendar, Users, Settings, LayoutDashboard, Waves } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { profile } = useAuth();
    const isCalendarSynced = profile?.is_calendar_synced;

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Settings, label: 'Settings', path: '/setup-orca' },
    ];

    const serviceItems = [
        { icon: Calendar, label: 'Calendar', path: '/dashboard/schedule' }
    ];

    return (
        <>
            <aside className="fixed left-0 top-0 h-full w-60 bg-[#061E29] p-5 hidden lg:flex flex-col">
                {/* Logo */}
                <div className="flex items-center gap-2.5 mb-10 px-1">
                    <div className="w-8 h-8 bg-[#5F9598] rounded-lg flex items-center justify-center">
                        <Waves className="w-4 h-4 text-[#061E29]" strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-semibold text-white tracking-tight">
                        Orca
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-6">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            const isDisabled = !isCalendarSynced && item.path !== '/sync-calendar' && item.path !== '/dashboard';

                            return (
                                <Link
                                    key={item.path}
                                    to={isDisabled ? '#' : item.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                                        ? 'bg-[#1D546D] text-white'
                                        : isDisabled
                                            ? 'opacity-30 cursor-not-allowed text-gray-500'
                                            : 'text-gray-400 hover:bg-[#1D546D]/50 hover:text-white'
                                        }`}
                                    onClick={(e) => isDisabled && e.preventDefault()}
                                >
                                    <Icon className="w-4 h-4" strokeWidth={2} />
                                    <span className="text-sm font-medium">{item.label}</span>
                                    {isActive && <div className="ml-auto accent-dot" />}
                                </Link>
                            );
                        })}
                    </div>

                    <div>
                        <div className="px-3 text-xs uppercase tracking-widest text-[#5F9598]/70 mb-2">
                            Services
                        </div>
                        <div className="space-y-1">
                            {serviceItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                const Icon = item.icon;
                                const isDisabled = !isCalendarSynced && item.path !== '/sync-calendar' && item.path !== '/dashboard';

                                return (
                                    <Link
                                        key={item.path}
                                        to={isDisabled ? '#' : item.path}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                                            ? 'bg-[#1D546D] text-white'
                                            : isDisabled
                                                ? 'opacity-30 cursor-not-allowed text-gray-500'
                                                : 'text-gray-400 hover:bg-[#1D546D]/50 hover:text-white'
                                            }`}
                                        onClick={(e) => isDisabled && e.preventDefault()}
                                    >
                                        <Icon className="w-4 h-4" strokeWidth={2} />
                                        <span className="text-sm font-medium">{item.label}</span>
                                        {isActive && <div className="ml-auto accent-dot" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </nav>

                {/* User Profile */}
                <div className="pt-4 border-t border-white/5">
                    <div className="px-3 py-2">
                        {profile?.email && (
                            <div className="text-xs text-gray-400 truncate mb-2">
                                {profile.email}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${isCalendarSynced ? 'bg-[#5F9598]' : 'bg-amber-400'}`} />
                            <span className="text-xs text-gray-500 font-medium">
                                {isCalendarSynced ? 'Synced' : 'Sync required'}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Menu */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#061E29] border-t border-white/5 px-4 py-3 flex justify-around items-center z-50">
                {[...menuItems, ...serviceItems].map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <Link key={item.path} to={item.path} className="p-2">
                            <Icon className={`w-5 h-5 ${isActive ? 'text-[#5F9598]' : 'text-gray-500'}`} strokeWidth={2} />
                        </Link>
                    );
                })}
            </div>
        </>
    );
};

export default Sidebar;
