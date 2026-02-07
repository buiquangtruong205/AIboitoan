import { Outlet } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import '../assets/auth.css';

const AuthLayout = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <div className="auth-wrapper">
            <div className="lang-switcher">
                <button
                    className={`lang-btn ${language === 'vi' ? 'active' : ''}`}
                    onClick={() => language !== 'vi' && toggleLanguage()}
                >
                    VI
                </button>
                <span className="lang-divider">|</span>
                <button
                    className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                    onClick={() => language !== 'en' && toggleLanguage()}
                >
                    EN
                </button>
            </div>
            <Outlet />
        </div>
    );
};

export default AuthLayout;
