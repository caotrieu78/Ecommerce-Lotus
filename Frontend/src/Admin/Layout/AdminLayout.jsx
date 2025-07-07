import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Component/Sidebar';
import Topbar from '../Component/Topbar';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleCollapse = () => setCollapsed((prev) => !prev);

    const drawerWidth = 240;
    const collapsedWidth = 80;

    return (
        <div>
            <Topbar onToggleSidebar={toggleSidebar} />
            {isSidebarOpen && (
                <Sidebar
                    open={isSidebarOpen}
                    collapsed={collapsed}
                    onToggleCollapse={handleCollapse}
                />
            )}
            <div
                style={{
                    marginTop: '64px',
                    marginLeft: isSidebarOpen ? (collapsed ? `${collapsedWidth}px` : `${drawerWidth}px`) : '0',
                    transition: 'all 0.3s ease',
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    minHeight: 'calc(100vh - 64px)',
                    overflow: 'hidden',
                }}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
