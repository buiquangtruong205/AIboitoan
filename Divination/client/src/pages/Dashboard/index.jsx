import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <div className="welcome-card">
                <h2 className="card-title">Chào mừng trở lại!</h2>
                <p className="welcome-text">
                    Xin chào <strong>{user?.name}</strong>! Bạn đã đăng nhập thành công vào hệ thống Divination.
                    Hãy khám phá những bí ẩn đang chờ đón bạn.
                </p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">0</div>
                    <div className="stat-label">Câu hỏi đã đặt</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">$0</div>
                    <div className="stat-label">Số dư hiện tại</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">∞</div>
                    <div className="stat-label">Vận may chờ đón</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
