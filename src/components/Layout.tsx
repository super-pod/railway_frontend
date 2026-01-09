import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-[#F3F4F4]">
            <Sidebar />
            <main className="flex-1 lg:ml-60 pb-20 lg:pb-0">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
