export default function Login() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
                <h1 className="mb-6 text-2xl font-bold">
                    TourPal Login
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="mb-4 w-full rounded border p-3"
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="mb-4 w-full rounded border p-3"
                />

                <button className="w-full rounded bg-blue-600 p-3 text-white">
                    Login
                </button>
            </div>
        </div>
    );
}
