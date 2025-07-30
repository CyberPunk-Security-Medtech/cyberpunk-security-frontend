'use client';

import { useState } from 'react';
import MobileMenu from '@components/MobileMenu';
import MdMenu from '@components/MdMenu';
import Header from '@components/Header';

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>): React.ReactNode {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarMinimize, setSidebarMinimize] = useState(true);

    return (
        <div className="font-sans">
            <MobileMenu sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div
                className={`grid grid-cols-1 ${sidebarMinimize ? 'md:grid-cols-[0.1fr_4fr]' : 'md:grid-cols-[0.5fr_4fr]'} h-screen`}
            >
                <MdMenu
                    setSidebarMinimize={setSidebarMinimize}
                    sidebarMinimize={sidebarMinimize}
                />
                <div className="flex flex-col px-4 lg:px-4">
                    <Header setSidebarOpen={setSidebarOpen} />
                    <main className="flex-1">{children}</main>
                </div>
            </div>
        </div>
    );
}
