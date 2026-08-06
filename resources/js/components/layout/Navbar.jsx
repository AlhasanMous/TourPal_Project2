export default function Navbar() {
    return (
        <header className="fixed left-64 right-0 top-0 z-10 h-16 border-b bg-white">
            <div className="flex h-full items-center justify-between px-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    Dashboard
                </h2>

                <div className="flex items-center gap-4">
                    <button className="text-gray-600 hover:text-gray-900">
                        Notifications
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                            A
                        </div>

                        <span className="font-medium text-gray-700">
                            Admin
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
