import { createContext, useContext, useState } from 'react';

const translations = {
    vi: {
        // Login
        loginTitle: 'Đăng Nhập',
        loginSubtitle: 'Chào mừng bạn quay trở lại',
        email: 'Email',
        password: 'Mật khẩu',
        loginButton: 'Đăng Nhập',
        noAccount: 'Chưa có tài khoản?',
        registerLink: 'Đăng ký ngay',
        // Register
        registerTitle: 'Đăng Ký',
        registerSubtitle: 'Tạo tài khoản để bắt đầu hành trình',
        fullName: 'Họ và tên',
        registerButton: 'Đăng Ký',
        hasAccount: 'Đã có tài khoản?',
        loginLink: 'Đăng nhập',
        // OTP
        otpTitle: 'Xác Thực OTP',
        otpSubtitle: 'Nhập mã OTP đã gửi đến email của bạn',
        otpCode: 'Mã OTP',
        verifyButton: 'Xác Thực',
        // Common
        processing: 'Đang xử lý...',
        // Quote
        quote1: '"Vận mệnh không phải là điều được ban tặng, mà là điều bạn tự tạo nên."',
        quote2: '"Hành trình ngàn dặm bắt đầu từ một bước chân."',
        quoteAuthor1: '— Divination App',
        quoteAuthor2: '— Lão Tử',
    },
    en: {
        // Login
        loginTitle: 'Login',
        loginSubtitle: 'Welcome back',
        email: 'Email',
        password: 'Password',
        loginButton: 'Login',
        noAccount: "Don't have an account?",
        registerLink: 'Register now',
        // Register
        registerTitle: 'Register',
        registerSubtitle: 'Create an account to start your journey',
        fullName: 'Full Name',
        registerButton: 'Register',
        hasAccount: 'Already have an account?',
        loginLink: 'Login',
        // OTP
        otpTitle: 'OTP Verification',
        otpSubtitle: 'Enter the OTP code sent to your email',
        otpCode: 'OTP Code',
        verifyButton: 'Verify',
        // Common
        processing: 'Processing...',
        // Quote
        quote1: '"Destiny is not given, it is what you create."',
        quote2: '"A journey of a thousand miles begins with a single step."',
        quoteAuthor1: '— Divination App',
        quoteAuthor2: '— Lao Tzu',
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('vi');

    const t = (key) => translations[language][key] || key;

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'vi' ? 'en' : 'vi');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
