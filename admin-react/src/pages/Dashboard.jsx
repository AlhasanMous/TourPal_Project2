import { useEffect, useState } from 'react';
import cityService from '../services/cityService';
import placeService from '../services/placeService';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const StatCard = ({ title, value }) => (
    <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="mt-2 text-3xl font-bold text-gray-800">{value}</h2>
    </div>
);

export default function Dashboard() {
    const [stats, setStats] = useState({
        cities: 0,
        places: 0,
        bookings: 0,
        reviews: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [citiesData, placesData] = await Promise.all([
                    cityService.getAdminCities({ per_page: 1 }),
                    placeService.getPlaces({ per_page: 1 }),
                ]);

                setStats({
                    cities: citiesData.meta?.total ?? 0,
                    places: placesData.meta?.total ?? 0,
                    bookings: 0,
                    reviews: 0,
                });
            } catch (err) {
                setError('Failed to load dashboard statistics.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <Loading message="Loading dashboard..." />;
    }

    const cards = [
        { title: 'Cities', value: stats.cities },
        { title: 'Places', value: stats.places },
        { title: 'Bookings', value: stats.bookings },
        { title: 'Reviews', value: stats.reviews },
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="mt-1 text-gray-500">
                    Welcome to the TourPal admin dashboard.
                </p>
            </div>

            <ErrorMessage message={error} onRetry={() => window.location.reload()} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <StatCard key={card.title} title={card.title} value={card.value} />
                ))}
            </div>
        </div>
    );
}
