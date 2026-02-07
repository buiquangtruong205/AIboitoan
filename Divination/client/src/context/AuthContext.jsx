import { createContext, useState, useEffect, useContext } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await authApi.getCurrentUser(); // Assumption: /me endpoint exists
                    setUser(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch user", error);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (credentials) => {
        const response = await authApi.login(credentials);
        localStorage.setItem('token', response.data.access_token);
        setUser(response.data.user);
        return response;
    };

    const register = async (userData) => {
        return await authApi.register(userData);
    };

    const verifyOtp = async (data) => {
        return await authApi.verifyOtp(data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, verifyOtp, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
