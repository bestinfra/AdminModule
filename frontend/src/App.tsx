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
import Dashboard from './pages_v2/Dashboard';
import DTRDashboard from './pages_v2/DTRDashboard';
import AppManagement from './pages/Apps_module/AppManagement';
import AddConsumer from './pages/AddConsumer';
import ComponentsDocumentation from './pages/ComponentsDocumentation';
import Connect from './pages_v2/ConnectDisconnect';
import AddTicket from './pages_v2/AddTicket';
import RoleManagement from './pages_v2/RoleManagement';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import UserManagement from './pages/UserManagment';
import AllTickets from './pages/AllTickets';import ConsumerView from './pages/ConsumerView';
import Consumers from './pages_v2/Consumers';
import MeterDetails from './pages/MeterDetails';
import TicketView from './pages/TicketView';

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
                            <Route path="/pagedemo" element={<PageDemo />} />
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/dtr-dashboard" element={<DTRDashboard />} />
                            <Route path="/apps" element={<AppManagement />} />
                            <Route path="/add-consumer" element={<AddConsumer />} />
                            <Route path="/components-documentation" element={<ComponentsDocumentation />} />
                            <Route path="/connect-consumer" element={<Connect />} />
                            <Route path="/add-ticket" element={<AddTicket/>} />
                            <Route path="/role-management" element={<RoleManagement/>} />
                            <Route path="/super-admin" element={<SuperAdminDashboard/>} />
                            <Route path="/user-management" element={<UserManagement/>} />
                            <Route path="/all-tickets" element={<AllTickets/>} />
                            <Route path="/consumers" element={<Consumers />} />
                            <Route path="/consumers/high-usage" element={<Consumers />} />
                            <Route path="/consumers/add" element={<AddConsumer />} />
                            <Route path="/consumer-view/:unitId" element={<ConsumerView />} />
                            <Route path="/meter-details/:meterSlNo" element={<MeterDetails />} />
                            <Route path="/tickets/:ticketId" element={<TicketView />} />
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        </AppProvider>
    );
};

export default App;
