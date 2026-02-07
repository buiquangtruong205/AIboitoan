import { BrowserRouter as Router } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import AppRoutes from './routes/AppRoutes';


function App() {
    return (
        <LanguageProvider>
            <Router>
                <AppRoutes />
            </Router>
        </LanguageProvider>
    );
}

export default App;
