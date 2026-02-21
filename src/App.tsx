import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppSidebar from './components/AppSidebar';
import Login from './pages/Login';
import AppHome from './pages/AppHome';
import AppCalendar from './pages/AppCalendar';
import GmailSyncPage from './pages/GmailSyncPage';
import Onboarding from './pages/Onboarding';
import OrcaLinkPage from './pages/OrcaLinkPage';
import PodPage from './pages/PodPage';
import OAuthComplete from './pages/OAuthComplete';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import { useAuth } from './context/AuthContext';

const AppShell = () => (
    <div className="min-h-screen bg-[#f4f8f7]">
        <AppSidebar />
        <main className="pb-24 lg:ml-60 lg:pb-0">
            <Outlet />
        </main>
    </div>
);

const RootRedirect = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen grid place-items-center bg-[#f4f8f7] text-[#33585d]">Loading...</div>;
    }

    if (location.pathname === '/') {
        return <Navigate to={user ? '/app' : '/login'} replace />;
    }

    return null;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/oauth-complete" element={<OAuthComplete />} />
                <Route path="/pod/:podToken" element={<PodPage />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/app/onboarding" element={<Onboarding />} />
                    <Route element={<AppShell />}>
                        <Route path="/app" element={<AppHome />} />
                        <Route path="/app/calendar" element={<AppCalendar />} />
                        <Route path="/app/gmail-sync" element={<GmailSyncPage />} />
                        <Route path="/app/settings" element={<Navigate to="/app" replace />} />
                    </Route>
                </Route>

                <Route path="/calendar/s/:shareToken" element={<OrcaLinkPage />} />
                <Route path="/calendar/:username" element={<OrcaLinkPage />} />
                <Route path="/s/:shareToken" element={<OrcaLinkPage />} />
                <Route path="/:username" element={<OrcaLinkPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
