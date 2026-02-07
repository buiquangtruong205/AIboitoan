import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { register } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await register({ email, password, user_name: name });
            navigate('/auth/otp', { state: { email } });
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed');
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
                <p className="auth-quote">{t('quote2')}</p>
                <span className="auth-quote-author">{t('quoteAuthor2')}</span>
            </div>

            {/* Right Side - Form */}
            <div className="auth-book-right">
                <div className="auth-header">
                    <h2>{t('registerTitle')}</h2>
                    <p>{t('registerSubtitle')}</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('fullName')}</label>
                        <input
                            className="form-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                        />
                    </div>
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
                        {isLoading ? t('processing') : t('registerButton')}
                    </button>
                </form>

                <div className="auth-footer">
                    {t('hasAccount')}
                    <Link to="/auth/login" className="auth-link">{t('loginLink')}</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
