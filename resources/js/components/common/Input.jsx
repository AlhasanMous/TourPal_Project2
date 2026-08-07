export default function Input({ label, error, className = '', ...props }) {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <input
                className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
                {...props}
            />

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
