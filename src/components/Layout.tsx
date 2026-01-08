import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-slate-950">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-4 lg:p-8 pb-24 lg:pb-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
