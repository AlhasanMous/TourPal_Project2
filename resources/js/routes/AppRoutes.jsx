import { Routes, Route, Navigate } from 'react-router-dom';

import DashboardLayout from '../layouts/DashboardLayout';

import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users/UsersList';
import Places from '../pages/Places/PlacesList';
// import Guides from '../pages/Guides';
// import Accommodations from '../pages/Accommodations';
// import Workspaces from '../pages/Workspaces';
// import Bookings from '../pages/Bookings';
// import Matching from '../pages/Matching';
// import Messages from '../pages/Messages';
// import Reviews from '../pages/Reviews';
// import Wishlist from '../pages/Wishlist';
// import Notifications from '../pages/Notifications';

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/places" element={<Places />} />
                <Route path="/guides" element={<Guides />} />
                <Route
                    path="/accommodations"
                    element={<Accommodations />}
                />
                <Route path="/workspaces" element={<Workspaces />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/matching" element={<Matching />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route
                    path="/notifications"
                    element={<Notifications />}
                />
            </Route>

            <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
            />
        </Routes>
    );
}
