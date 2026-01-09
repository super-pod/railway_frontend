import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, profile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const path = location.pathname;
    const isPodLink = path.startsWith('/pod/') || path.startsWith('/pod-invite/');

    // Critical Step: Check if calendar is synced
    // Allow pod invite/details to handle calendar gating per pod type
    if (profile && !profile.is_calendar_synced && path !== '/sync-calendar' && !isPodLink) {
        return <Navigate to="/sync-calendar" state={{ from: location }} replace />;
    }

    if (profile && !profile.has_orca && path !== '/setup-orca') {
        return <Navigate to="/setup-orca" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
