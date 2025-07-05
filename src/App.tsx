import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageBuilder from './pages/PageBuilder/PageBuilder';
import ModuleSelection from './pages/ModuleSelection';
import Profile from './pages/Profile';
import AllTickets from './pages/AllTickets';
import Forms from './pages/Forms';
import MainLayout from './components/layout/MainLayout';
import NotFound from './pages/NotFound';
import { AppProvider } from './context/AppContext'; 
import AppManagement from './pages/Apps_module/AppManagement';
import Dashboard from './pages/Dashboard';
import Consumers from './pages/Consumers';
import BillsPrepaid from './pages/BillsPrepaid';
import BillsPostpaid from './pages/BillsPostpaid';

const App: React.FC = () => {

    return (
        <AppProvider>
            <Router>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route
                            path="/"
                            element={<Dashboard />}
                        />
                        <Route path="/apps" element={<AppManagement />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/all-tickets" element={<AllTickets />} />
                        <Route path="/forms" element={<Forms />} />
                        <Route path="/consumers" element={<Consumers />} />
                        <Route path="/bills/prepaid" element={<BillsPrepaid />} />
                        <Route path="/bills/postpaid" element={<BillsPostpaid />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                    <Route path="/page-builder" element={<PageBuilder />} />
                    <Route
                        path="/module-selection"
                        element={<ModuleSelection />}
                    />
                </Routes>
            </Router>
            
        </AppProvider>
    );
};

export default App;
