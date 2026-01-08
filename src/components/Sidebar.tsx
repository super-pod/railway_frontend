import { useLocation, Link } from 'react-router-dom';
import { Home, Calendar, Users, Target, Activity, Settings, LayoutDashboard, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { profile } = useAuth();
    const isCalendarSynced = profile?.is_calendar_synced;

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Calendar, label: 'My Schedule', path: '/dashboard/schedule' },
        { icon: Users, label: 'Pods', path: '/dashboard' }, // Simplified for now
        { icon: Settings, label: 'Preferences', path: '/setup-orca' },
    ];

    return (
        <>
            <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 p-6 hidden lg:flex flex-col">
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                            Orca
                        </span>
                        <span className="block text-[10px] text-slate-500 font-medium tracking-wider -mt-1 uppercase">Coordination Engine</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        const isDisabled = !isCalendarSynced && item.path !== '/sync-calendar';

                        return (
                            <Link
                                key={item.path}
                                to={isDisabled ? '#' : item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600/10 text-blue-400'
                                    : isDisabled
                                        ? 'opacity-40 cursor-not-allowed'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                                onClick={(e) => isDisabled && e.preventDefault()}
                            >
                                <Icon className={`w-5 h-5 transition-transform duration-200 ${!isDisabled && 'group-hover:scale-110'} ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'}`} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile Menu */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-6 py-4 flex justify-between items-center z-50">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <Link key={item.path} to={item.path}>
                            <Icon className={`w-6 h-6 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                        </Link>
                    );
                })}
            </div>
        </>
    );
};

export default Sidebar;
