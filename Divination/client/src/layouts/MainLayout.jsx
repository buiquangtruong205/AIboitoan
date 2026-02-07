import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/main.css';

const MainLayout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="main-layout">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar}></div>
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-brand">
                    <img src="/src/assets/images/logo.jpg" alt="Logo" className="sidebar-logo" />
                    <span className="sidebar-title">Divination</span>
                    {/* Close button for mobile */}
                    <button className="mobile-only close-btn" onClick={closeSidebar} style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        marginLeft: 'auto',
                        cursor: 'pointer'
                    }}>✕</button>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        <li className="nav-item">
                            <Link
                                to="/dashboard"
                                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                                onClick={closeSidebar}
                            >
                                <span className="nav-icon">🏠</span>
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/divination"
                                className={`nav-link ${isActive('/divination') ? 'active' : ''}`}
                                onClick={closeSidebar}
                            >
                                <span className="nav-icon">🔮</span>
                                Divination
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="main-header">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button className="menu-toggle mobile-only" onClick={toggleSidebar}>
                            ☰
                        </button>
                        <h1 className="header-welcome">
                            Welcome, <span>{user?.name || 'User'}</span>
                        </h1>
                    </div>
                    <button className="logout-btn" onClick={logout}>
                        Logout
                    </button>
                </header>

                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
