import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import OtpPage from '../pages/Auth/OtpPage';
import Dashboard from '../pages/Dashboard';  // Assumes index.jsx inside Dashboard
import DivinationPage from '../pages/Divination'; // Assumes index.jsx inside Divination
import ResultPage from '../pages/Divination/ResultPage';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>; // Or a spinner component
    if (!user) return <Navigate to="/auth/login" replace />;
    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="otp" element={<OtpPage />} />
            </Route>

            <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="divination" element={<DivinationPage />} />
                <Route path="divination/result" element={<ResultPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
