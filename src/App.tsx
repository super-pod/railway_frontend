import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PodCreate from './pages/PodCreate';
import PodDetail from './pages/PodDetail';
import SyncCalendar from './pages/SyncCalendar';
import SetupOrca from './pages/SetupOrca';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/pods/create" element={<PodCreate />} />
                        <Route path="/pods/:podId" element={<PodDetail />} />
                        <Route path="/sync-calendar" element={<SyncCalendar />} />
                        <Route path="/setup-orca" element={<SetupOrca />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
