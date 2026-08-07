import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';

export default function AuthLayout() {
    const { user, loading, isAdmin } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loading message="Checking authentication..." />;
    }

    if (user && isAdmin()) {
        window.location.href = '/dashboard';
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12">
            <div className="mb-8 text-center">
                <Link to="/">
                    <h1 className="text-4xl font-bold text-blue-600">TourPal</h1>
                </Link>
                <p className="mt-2 text-gray-600">Welcome back</p>
            </div>

            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
                <Outlet />
            </div>

            <p className="mt-8 text-center text-xs text-gray-500">
                TourPal Admin Dashboard
            </p>
        </div>
    );
}
