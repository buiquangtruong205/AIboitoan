import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/divination.css';

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { result, type } = location.state || {};

    if (!result) {
        return (
            <div className="divination-container">
                <div className="card result-card">
                    <h2 className="card-title">Không tìm thấy kết quả</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Có vẻ như bạn đã truy cập trực tiếp vào trang này hoặc phiên làm việc đã hết hạn.
                    </p>
                    <button onClick={() => navigate('/divination')} className="submit-btn">
                        Quay lại trang Bói toán
                    </button>
                </div>
            </div>
        );
    }

    const typeLabels = {
        tarot: 'Lá bài Tarot',
        horoscope: 'Cung Hoàng Đạo',
        tu_vi: 'Lá số Tử Vi'
    };

    return (
        <div className="divination-container result-page-animate">
            <div className="card result-card premium-glass">
                <div className="result-header">
                    <h2 className="result-main-title">🌟 Kết Quả Luận Giải</h2>
                    <div className="result-badge">{typeLabels[type] || 'Bói toán'}</div>
                </div>

                <div className="result-content-wrapper">
                    <div className="result-body-text">
                        {result.answer || (typeof result === 'string' ? result : JSON.stringify(result))}
                    </div>
                </div>

                <div className="result-actions">
                    <button onClick={() => navigate('/divination')} className="back-btn">
                        <span>←</span> Tiếp tục xem bói
                    </button>
                    <button onClick={() => window.print()} className="print-btn mobile-hide">
                        🖨️ In kết quả
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
