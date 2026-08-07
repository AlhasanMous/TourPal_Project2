import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from './Loading';

export default function ProtectedRoute({ children }) {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return <Loading message="Checking authentication..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin()) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6 text-center">
                <h1 className="mb-2 text-2xl font-bold text-red-600">Access Denied</h1>
                <p className="text-gray-600">This dashboard is restricted to administrators.</p>
            </div>
        );
    }

    return children;
}
