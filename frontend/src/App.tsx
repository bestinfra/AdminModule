import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import Tickets from './pages_v2/Tickets';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import PageDemo from './pages/PageDemo';
import Login from './pages/Login';
import DataLogger from './pages_v2/DataLogger';
import Meters from './pages_v2/Meters';
import Users from './pages_v2/Users';

const App: React.FC = () => {
    return (
        <AppProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} /> 
                        <Route
                            element={
                                <ProtectedRoute>
                                    <MainLayout />
                                </ProtectedRoute>
                            }>
                            <Route path="/tickets" element={<Tickets />} />
                            <Route
                                path="/data-logger"
                                element={<DataLogger />}
                            />
                            <Route path="/meters" element={<Meters />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/" element={<PageDemo />} />
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        </AppProvider>
    );
};

export default App;
