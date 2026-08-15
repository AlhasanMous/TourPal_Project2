import { Routes, Route, Navigate } from 'react-router-dom';

import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Dashboard from '../pages/Dashboard';
import CitiesList from '../pages/cities/CitiesList';
import CreateCity from '../pages/cities/CreateCity';
import EditCity from '../pages/cities/EditCity';
import PlacesList from '../pages/places/PlacesList';
import CreatePlace from '../pages/places/CreatePlace';
import EditPlace from '../pages/places/EditPlace';
import GuidesList from '../pages/guides/GuidesList';
import GuideDetails from '../pages/guides/GuideDetails';
import EditGuide from '../pages/guides/EditGuide';
import WorkspacesList from '../pages/workspaces/WorkspacesList';
import WorkspaceDetails from '../pages/workspaces/WorkspaceDetails';
import WorkspaceTimeline from '../pages/workspaces/WorkspaceTimeline';
import WorkspaceParticipants from '../pages/workspaces/WorkspaceParticipants';
import WorkspaceSuggestions from '../pages/workspaces/WorkspaceSuggestions';
import WorkspacePlaces from '../pages/workspaces/WorkspacePlaces';

import UsersList from '../pages/users/UsersList';
import EditUser from '../pages/users/EditUser';
import ViewUser from '../pages/users/ViewUser';
export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            <Route
                element={
                    <ProtectedRoute>
                        <DashboardLayout />

                    </ProtectedRoute>
                }
            >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UsersList />} />
                <Route path="/users/:id" element={<ViewUser />} />
                <Route path="/users/:id/edit" element={<EditUser />} />
                <Route path="/cities" element={<CitiesList />} />
                <Route path="/cities/create" element={<CreateCity />} />
                <Route path="/cities/:id/edit" element={<EditCity />} />
                <Route path="/places" element={<PlacesList />} />
                <Route path="/places/create" element={<CreatePlace />} />
                <Route path="/places/:id/edit" element={<EditPlace />} />
          <Route path="/workspaces" element={<WorkspacesList />} />
<Route
    path="/workspaces/:id/timeline"
    element={<WorkspaceTimeline />}
/>
<Route
    path="/workspaces/:id/suggestions"
    element={<WorkspaceSuggestions />}
/>
<Route
    path="/workspaces/:id/participants"
    element={<WorkspaceParticipants />}
/>
<Route
 path="/workspaces/:id/places"
 element={<WorkspacePlaces />}
/>
<Route path="/workspaces/:id" element={<WorkspaceDetails />} />

                <Route path="/guides" element={<GuidesList />} />
                <Route path="/guides/:id" element={<GuideDetails />} />
                <Route path="/guides/:id/edit" element={<EditGuide />} />

</Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

