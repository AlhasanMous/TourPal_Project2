export default function Loading({ message = 'Loading...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-600">
            <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            <p>{message}</p>
        </div>
    );
}
