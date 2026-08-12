import { NavLink } from 'react-router-dom';

const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
       { name: 'Users', path: '/users' },
    { name: 'Cities', path: '/cities' },
    { name: 'Places', path: '/places' },
    { name: 'Workspaces', path: '/workspaces' },
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
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `block rounded-lg px-4 py-3 transition ${
                                        isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-800'
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
