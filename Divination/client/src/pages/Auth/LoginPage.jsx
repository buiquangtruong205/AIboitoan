import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-book">
            {/* Left Side - Logo & Quote */}
            <div className="auth-book-left">
                <div className="auth-brand">
                    <img
                        src="/src/assets/images/logo.jpg"
                        alt="Divination Logo"
                        className="auth-logo"
                    />
                    <span className="auth-brand-name">Divination</span>
                </div>
                <p className="auth-quote">{t('quote1')}</p>
                <span className="auth-quote-author">{t('quoteAuthor1')}</span>
            </div>

            {/* Right Side - Form */}
            <div className="auth-book-right">
                <div className="auth-header">
                    <h2>{t('loginTitle')}</h2>
                    <p>{t('loginSubtitle')}</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('email')}</label>
                        <input
                            className="form-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('password')}</label>
                        <input
                            className="form-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button className="auth-button" type="submit" disabled={isLoading}>
                        {isLoading ? t('processing') : t('loginButton')}
                    </button>
                </form>

                <div className="auth-footer">
                    {t('noAccount')}
                    <Link to="/auth/register" className="auth-link">{t('registerLink')}</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
