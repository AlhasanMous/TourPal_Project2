import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
        setGlobalError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setGlobalError('');

        try {
            const user = await login(form);

            if (!user?.roles?.includes('admin')) {
                setGlobalError('Admin access only.');
                return;
            }

            navigate('/dashboard', { replace: true });
        } catch (err) {
            if (err.response?.status === 422) {
                const serverErrors = err.response.data.errors ?? {};
                const mapped = {};
                Object.keys(serverErrors).forEach((key) => {
                    mapped[key] = serverErrors[key][0];
                });
                setErrors(mapped);
            } else if (err.response?.status === 401) {
                setGlobalError('Invalid email or password.');
            } else {
                setGlobalError(err.response?.data?.message ?? 'Login failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Sign In</h1>
            <p className="mb-6 text-gray-500">Welcome back to TourPal.</p>

            <ErrorMessage message={globalError} />

            <form onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@tourpal.sy"
                    error={errors.email}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    error={errors.password}
                    required
                />

                <div className="mb-6 text-right">
                    <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
                Need an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:underline">
                    Create one
                </Link>
            </p>
        </>
    );
}
