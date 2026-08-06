    import { Outlet } from 'react-router-dom';

import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar />

            <Navbar />

            <main className="ml-64 pt-16">
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
