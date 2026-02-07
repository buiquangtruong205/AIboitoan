import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const OtpPage = () => {
    const [otp, setOtp] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const { verifyOtp } = useAuth();
    const { t } = useLanguage();
    const email = location.state?.email;
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await verifyOtp({ email, otp });
            navigate('/auth/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="auth-book">
                <div className="auth-book-left">
                    <div className="auth-brand">
                        <img src="/src/assets/images/logo.jpg" alt="Logo" className="auth-logo" />
                        <span className="auth-brand-name">Divination</span>
                    </div>
                </div>
                <div className="auth-book-right">
                    <div className="error-message">
                        Error: No email provided. Please register first.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-book">
            {/* Left Side - Logo & Quote */}
            <div className="auth-book-left">
                <div className="auth-brand">
                    <img src="/src/assets/images/logo.jpg" alt="Logo" className="auth-logo" />
                    <span className="auth-brand-name">Divination</span>
                </div>
                <p className="auth-quote">{t('quote1')}</p>
                <span className="auth-quote-author">{t('quoteAuthor1')}</span>
            </div>

            {/* Right Side - Form */}
            <div className="auth-book-right">
                <div className="auth-header">
                    <h2>{t('otpTitle')}</h2>
                    <p>{t('otpSubtitle')}: <strong>{email}</strong></p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('otpCode')}</label>
                        <input
                            className="form-input"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="000000"
                            required
                            maxLength={6}
                            style={{ letterSpacing: '0.3rem', textAlign: 'center', fontSize: '1.3rem' }}
                        />
                    </div>
                    <button className="auth-button" type="submit" disabled={isLoading}>
                        {isLoading ? t('processing') : t('verifyButton')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpPage;
