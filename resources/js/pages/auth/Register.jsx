import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorMessage from '../../components/common/ErrorMessage';

const ROLES = [
    { value: 'tourist', label: 'Tourist' },
    { value: 'guide', label: 'Guide' },
    { value: 'host', label: 'Host' },
];

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'tourist',
    });
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
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
        setSuccessMessage('');

        try {
            await authService.register(form);
            setSuccessMessage('Account created successfully. Please sign in.');

            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            if (err.response?.status === 422) {
                const serverErrors = err.response.data.errors ?? {};
                const mapped = {};
                Object.keys(serverErrors).forEach((key) => {
                    mapped[key] = serverErrors[key][0];
                });
                setErrors(mapped);
            } else {
                setGlobalError(err.response?.data?.message ?? 'Registration failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="mb-6 text-gray-500">Sign up for a TourPal account.</p>

            {successMessage && (
                <div className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-green-700">
                    {successMessage}
                </div>
            )}

            <ErrorMessage message={globalError} />

            <form onSubmit={handleSubmit}>
                <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    error={errors.name}
                    required
                />

                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
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

                <Input
                    label="Confirm Password"
                    type="password"
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder="••••••••"
                    error={errors.password_confirmation}
                    required
                />

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Role
                    </label>
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        {ROLES.map((role) => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                    {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:underline">
                    Sign in
                </Link>
            </p>
        </>
    );
}
