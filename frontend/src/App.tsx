import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { FilterStyleProvider } from '@/contexts/FilterStyleContext';
import Tickets from './pages_v2/Tickets';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import PageDemo from './pages/PageDemo';
import Login from './pages/Login';
import DataLogger from './pages_v2/DataLogger';
import DataLoggerDashboard from './pages_v2/DataLoggerDashboard';
import Meters from './pages_v2/Meters';
import Users from './pages_v2/Users';
import AssetManagment from './pages_v2/AssetManagement';
// import Dashboard from './pages_v2/Dashboard';
import DTRDashboard from './pages_v2/DTRDashboard';
import AppManagement from './pages/Apps_module/AppManagement';
import AddConsumer from './pages/AddConsumer';
import ComponentsDocumentation from './pages/ComponentsDocumentation';
import Connect from './pages_v2/ConnectDisconnect';
import AddTicket from './pages_v2/AddTicket';
import RoleManagement from './pages_v2/RoleManagement';
import UserManagement from './pages/UserManagment';
import AllTickets from './pages/AllTickets';
import ConsumerView from './pages_v2/ConsumerView';
import Consumers from './pages_v2/Consumers';
import MeterDetails from './pages_v2/MeterDetails';
import TicketView from './pages_v2/TicketView';
// import Prepaid from './pages_v2/Prepaid';   
// import Postpaid from './pages_v2/Postpaid';
import Feeders from './pages_v2/Feeders';
import AddMeter from './pages_v2/AddMeter';
import AddRole from './pages_v2/AddRole';
import AddUser from './pages_v2/AddUser';
import AddDataLogger from './pages_v2/AddDataLogger';
import SuperAdminDashboard from './pages_v2/SuperAdminDashboard';
import EditRole from './pages_v2/EditRole';
import EditUser from './pages_v2/EditUser';
import UserDetail from './pages_v2/UserDetail';
import RolesPermissions from './pages_v2/RolesPermissions';
import SubLogin from './pages_v2/SubLogin';
import DTRDetailPage from './pages/DTRDetailPage';
import IndividualDetailPage from './pages_v2/IndividualDetailPage';
import FilterStyleController from './components/global/FilterStyleController';
// import ConsumerVacantConfirmation from './pages/ConsumerVacantConfirmation';
// import ConfirmationDialogExamples from './pages/ConfirmationDialogExamples';
import Dashboard from './pages_v2/ConsumerDashboard';
import ConsumerDetailView from './pages_v2/ConsumerDetailView';
const App: React.FC = () => {
    return (
        <AppProvider>
            <AuthProvider>
                <FilterStyleProvider initialStyle="BRAND_GREEN">
                    <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} /> 
                        <Route path="/sub-login" element={<SubLogin />} />
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
                            <Route
                                path="/data-logger/:dataLoggerId"
                                element={<DataLoggerDashboard />}
                            />
                            <Route path='/consumer-detail-view/:consumerId' element={<ConsumerDetailView />} />
                            <Route path='/consumer-detail-view' element={<ConsumerDetailView />} />
                            <Route path="/meters" element={<Meters />} />
                            <Route path="/superadmin" element={<SuperAdminDashboard />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/asset-managment" element={<AssetManagment />} />
                            <Route path="/pagedemo" element={<PageDemo />} />
                            <Route path="/consumer-dashboard" element={<Dashboard />} />  
                            <Route path="/dtr-dashboard" element={<DTRDashboard />} />
                            <Route path="/dtr-detail/:dtrId" element={<DTRDetailPage/>}/>
                            <Route path="/individual-detail" element={<IndividualDetailPage/>}/>
                            <Route path="/apps" element={<AppManagement />} />
                            <Route path="/add-consumer" element={<AddConsumer />} />
                            <Route path="/components-documentation" element={<ComponentsDocumentation />} />
                            <Route path="/connect-consumer" element={<Connect />} />
                            <Route path="/add-ticket" element={<AddTicket/>} />
                            <Route path="/role-management" element={<RoleManagement/>} />
                            <Route path="/user-management" element={<UserManagement/>} />
                            <Route path="/all-tickets" element={<AllTickets/>} />
                            <Route path="/consumers" element={<Consumers />} />
                            <Route path="/consumers/high-usage" element={<Consumers />} />
                            <Route path="/consumers/add" element={<AddConsumer />} />
                            <Route path="/consumers/:consumerId" element={<ConsumerView />} />
                            <Route path="/meter-details/:meterSlNo" element={<MeterDetails />} />
                            <Route path="/dtr/:dtrId" element={<Feeders />} />
                            <Route path="/feeder/:feederId" element={<Feeders />} />
                            <Route path="/tickets/:ticketId" element={<TicketView />} />
                            <Route path="/" element={<DTRDashboard />} />
                            {/* <Route path="/prepaid" element={<Prepaid />} />
                            <Route path="/postpaid" element={<Postpaid />} /> */}
                            <Route path="/asset-managment" element={<AssetManagment />} />
                            <Route path="/add-meter" element={<AddMeter />} />
                            <Route path="/add-role" element={<AddRole />} />
                            <Route path="/edit-role/:roleId" element={<EditRole/>} />
                            <Route path="/add-user" element={<AddUser />} />
                            <Route path="/edit-user/:userId" element={<EditUser />} />
                            <Route path="/user-detail/:id" element={<UserDetail />} />
                            <Route path="/add-data-logger" element={<AddDataLogger />} />
                            <Route path="/roles-permissions" element={<RolesPermissions />} />
                            <Route path="/filter-style-controller" element={<FilterStyleController />} />
                            {/* <Route path="/consumer-vacant-confirmation" element={<ConsumerVacantConfirmation />} />
                            <Route path="/confirmation-dialog-examples" element={<ConfirmationDialogExamples />} /> */}
                            {/* <Route path="/meters-list" element={<MetersList />} /> */}
                        </Route>
                    </Routes>
                </Router>
                </FilterStyleProvider>
            </AuthProvider>
        </AppProvider>
    );
};

export default App;

