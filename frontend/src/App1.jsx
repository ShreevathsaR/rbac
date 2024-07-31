import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import App from './App';
import ProtectedRoutes from './components/ProtectedRoutes';

function App1() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/home" element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
                <Route path='*' element={<h1>404</h1>} />
            </Routes>
        </Router>
    );
}

export default App1;
