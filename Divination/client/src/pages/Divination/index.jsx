import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDivination from '../../hooks/useDivination';
import { useAuth } from '../../context/AuthContext';
import '../../assets/divination.css';

const DivinationPage = () => {
    const navigate = useNavigate();
    const [question, setQuestion] = useState('');
    const [divinationType, setDivinationType] = useState('horoscope'); // 'horoscope', 'tu_vi', or 'tarot'
    const { askDivination, loading, error } = useDivination();
    const { user } = useAuth();

    const balance = user?.balance || 0;

    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [gender, setGender] = useState('male'); // 'male' | 'female'

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        const options = {};
        if (divinationType === 'tu_vi') {
            options.birthDate = birthDate;
            options.birthTime = birthTime;
            options.gender = gender;
        }

        try {
            const resultData = await askDivination(question, divinationType, options);
            if (resultData) {
                navigate('/divination/result', { state: { result: resultData, type: divinationType } });
            }
        } catch (err) {
            console.error("Divination failed:", err);
        }
    };

    return (
        <div className="divination-container">
            <div className="card">
                <h2 className="card-title">Bói Toán</h2>

                <div className="balance-display">
                    💰 Số dư: ${balance}
                </div>

                <div className="divination-tabs">
                    <button
                        type="button"
                        onClick={() => setDivinationType('tarot')}
                        className={`tab-btn ${divinationType === 'tarot' ? 'active' : ''}`}
                    >
                        🃏 Tarot
                    </button>
                    <button
                        type="button"
                        onClick={() => setDivinationType('horoscope')}
                        className={`tab-btn ${divinationType === 'horoscope' ? 'active' : ''}`}
                    >
                        ♈ 12 Cung
                    </button>
                    <button
                        type="button"
                        onClick={() => setDivinationType('tu_vi')}
                        className={`tab-btn ${divinationType === 'tu_vi' ? 'active' : ''}`}
                    >
                        🔮 Tử Vi
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="divination-form">
                    {divinationType === 'tu_vi' && (
                        <div className="tu-vi-fields">
                            <div className="tu-vi-grid">
                                <div className="divination-input-group">
                                    <label>Ngày sinh (DL)</label>
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        className="divination-input"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                    />
                                </div>
                                <div className="divination-input-group">
                                    <label>Giờ sinh</label>
                                    <input
                                        type="text"
                                        placeholder="HH:MM"
                                        className="divination-input"
                                        value={birthTime}
                                        onChange={(e) => setBirthTime(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="gender-group">
                                <label className="gender-option">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={gender === 'male'}
                                        onChange={(e) => setGender(e.target.value)}
                                    /> Nam
                                </label>
                                <label className="gender-option">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={gender === 'female'}
                                        onChange={(e) => setGender(e.target.value)}
                                    /> Nữ
                                </label>
                            </div>
                        </div>
                    )}

                    <textarea
                        className="question-input"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={
                            divinationType === 'horoscope'
                                ? "Hỏi về vận mệnh cung Hoàng Đạo của bạn..."
                                : divinationType === 'tarot'
                                    ? "Hỏi về ý nghĩa lá bài Tarot, tương lai..."
                                    : "Hỏi về lá số Tử Vi, các sao..."
                        }
                        rows={4}
                    />

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? (
                            <>⏳ Đang luận giải...</>
                        ) : (
                            <>🔮 Xem bói</>
                        )}
                    </button>
                </form>

                {error && (
                    <div className="error-box">
                        ❌ Lỗi: {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DivinationPage;
