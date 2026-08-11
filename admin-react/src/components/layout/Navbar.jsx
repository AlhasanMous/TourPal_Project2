import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    const initials = user?.name
        ? user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : 'A';

    return (
        <header className="fixed left-64 right-0 top-0 z-10 h-16 border-b bg-white">
            <div className="flex h-full items-center justify-between px-6">
                <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>

                <div className="flex items-center gap-4">
                    <Button variant="secondary" onClick={handleLogout}>
                        Logout
                    </Button>

                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                            {initials}
                        </div>

                        <span className="font-medium text-gray-700">
                            {user?.name ?? 'Admin'}
                        </span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
