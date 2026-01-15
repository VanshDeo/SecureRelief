import React from 'react';
import Layout from './Layout';

interface DashboardLayoutProps {
    children: React.ReactNode;
    fullWidth?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, fullWidth = false }) => {
    return (
        <Layout fullWidth={fullWidth}>
            <div className="min-h-screen bg-gray-50">
                {/* 
                   We could add a common dashboard header here, 
                   or breadcrumbs, if needed in the future.
                   For now, it wraps the main Layout and ensures consistent background.
                */}
                {children}
            </div>
        </Layout>
    );
};

export default DashboardLayout;
