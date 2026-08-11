import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function ResetPassword() {
    const [form, setForm] = useState({
        email: '',
        password: '',
        password_confirmation: '',
        token: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');
        setError('');

        try {
            // Backend endpoint for password reset is not configured yet.
            // This UI is ready to connect once it becomes available.
            setMessage(
                'Password reset is not available at the moment. Please contact an administrator.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Reset Password</h1>
            <p className="mb-6 text-gray-500">Enter your new password below.</p>

            {message && (
                <div className="mb-4 rounded border border-yellow-200 bg-yellow-50 p-3 text-yellow-800">
                    {message}
                </div>
            )}

            {error && (
                <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                />

                <Input
                    label="Reset Token"
                    type="text"
                    name="token"
                    value={form.token}
                    onChange={handleChange}
                    placeholder="Token from email"
                    required
                />

                <Input
                    label="New Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                />

                <Input
                    label="Confirm New Password"
                    type="password"
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
                Back to{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:underline">
                    Sign in
                </Link>
            </p>
        </>
    );
}
