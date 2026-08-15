import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Building2,
    MapPin,
    Briefcase,
    UserCheck,
     Hotel,
      Bus,
} from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Guides', path: '/guides', icon: UserCheck },
    { name: 'Cities', path: '/cities', icon: Building2 },
    { name: 'Places', path: '/places', icon: MapPin },
    { name: 'Workspaces', path: '/workspaces', icon: Briefcase },
       { name: 'Accommodations', path: '/accommodations', icon: Hotel },
       { name: 'Transport', path: '/transport', icon: Bus },
];

export default function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white">
            <div className="border-b border-gray-700 p-5">
                <h1 className="text-2xl font-bold">TourPal</h1>
                <p className="text-xs text-gray-400">Admin Dashboard</p>
            </div>

            <nav className="p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                                            isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-800'
                                        }`
                                    }
                                >
                                    <Icon size={18} />
                                    <span>{item.name}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
