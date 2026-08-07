import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
                localStorage.setItem('tourpal_user', JSON.stringify(currentUser));
                setUser(currentUser);
            })
            .catch(() => {
                localStorage.removeItem('tourpal_token');
                localStorage.removeItem('tourpal_user');
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (credentials) => {
        const data = await authService.login(credentials);
        const currentUser = data.user;

        localStorage.setItem('tourpal_token', data.token);
        localStorage.setItem('tourpal_user', JSON.stringify(currentUser));

        setUser(currentUser);

        return currentUser;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch {
            // ignore logout errors
        } finally {
            localStorage.removeItem('tourpal_token');
            localStorage.removeItem('tourpal_user');
            setUser(null);
        }
    };

    const isAdmin = () => {
        const roles = user?.roles ?? [];
        return roles.includes('admin');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
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
