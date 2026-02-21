import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, profile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center bg-[#f4f8f7]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0a4f56]/20 border-t-[#0a4f56]" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const hasUsername = Boolean((profile?.username || '').trim());
    const onOnboardingRoute = location.pathname.startsWith('/app/onboarding');

    if (!hasUsername && location.pathname.startsWith('/app') && !onOnboardingRoute) {
        return <Navigate to="/app/onboarding" state={{ from: location }} replace />;
    }

    if (hasUsername && onOnboardingRoute) {
        return <Navigate to="/app" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
