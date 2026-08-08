import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // ===========================
    // Initial State
    // ===========================

    const storedUser = localStorage.getItem('tourpal_user');

    const [user, setUser] = useState(
        storedUser ? JSON.parse(storedUser) : null
    );

    const [loading, setLoading] = useState(true);

    // ===========================
    // Helpers
    // ===========================

    const isAuthenticated = !!user;

    const hasRole = (role) => {
        return user?.roles?.includes(role);
    };

    const isAdmin = () => hasRole('admin');

    const setAuthenticatedUser = (currentUser, token) => {
        localStorage.setItem('tourpal_token', token);

        localStorage.setItem(
            'tourpal_user',
            JSON.stringify(currentUser)
        );

        setUser(currentUser);
    };

    const clearAuthData = () => {
        localStorage.removeItem('tourpal_token');
        localStorage.removeItem('tourpal_user');

        setUser(null);
    };

    // ===========================
    // Check Authentication
    // ===========================

    useEffect(() => {
        const token = localStorage.getItem('tourpal_token');

        if (!token) {
            setLoading(false);
            return;
        }

        authService
            .me()
            .then((data) => {
                const currentUser = data.user;

                localStorage.setItem(
                    'tourpal_user',
                    JSON.stringify(currentUser)
                );

                setUser(currentUser);
            })
            .catch(() => {
                clearAuthData();
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // ===========================
    // Authentication
    // ===========================

    const login = async (credentials) => {
        const data = await authService.login(credentials);

        setAuthenticatedUser(data.user, data.token);

        return data.user;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            // Ignore logout API errors
        } finally {
            clearAuthData();
        }
    };

    const refreshUser = async () => {
        const data = await authService.me();

        localStorage.setItem(
            'tourpal_user',
            JSON.stringify(data.user)
        );

        setUser(data.user);
    };

    // ===========================
    // Provider
    // ===========================

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                refreshUser,
                isAuthenticated,
                hasRole,
                isAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
