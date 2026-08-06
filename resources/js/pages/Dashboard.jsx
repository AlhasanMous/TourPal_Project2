const stats = [
    {
        title: 'Users',
        value: '0',
    },
    {
        title: 'Places',
        value: '0',
    },
    {
        title: 'Bookings',
        value: '0',
    },
    {
        title: 'Reviews',
        value: '0',
    },
];

export default function Dashboard() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Dashboard
                </h1>

                <p className="mt-1 text-gray-500">
                    Welcome to TourPal Dashboard
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="rounded-xl bg-white p-6 shadow-sm"
                    >
                        <p className="text-sm text-gray-500">
                            {stat.title}
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-gray-800">
                            {stat.value}
                        </h2>
                    </div>
                ))}
            </div>
        </div>
    );
}
