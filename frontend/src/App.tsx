import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@context/AppContext';
import { AuthProvider } from '@context/AuthContext';
import { FilterStyleProvider } from '@contexts/FilterStyleContext';
import Tickets from '@pages/Tickets';
import ProtectedRoute from '@components/auth/ProtectedRoute';
import MainLayout from '@components/layout/MainLayout';
import PageDemo from '@/pages/PageDemo';
import Login from '@pages/Login';
import DataLogger from '@pages/DataLogger';
import DataLoggerDashboard from '@pages/DataLoggerDashboard';
import Meters from '@pages/Meters';
import Users from '@pages/Users';
import AssetManagment from '@pages/AssetManagement';
import DTRDashboard from '@pages/DTRDashboard';
import AppManagement from '@pages/Apps_module/AppManagement';
import AddConsumer from '@/pages/AddConsumer';
import ComponentsDocumentation from '@/pages/ComponentsDocumentation';
import Connect from '@pages/ConnectDisconnect';
import AddTicket from '@pages/AddTicket';
import RoleManagement from '@pages/RoleManagement';
import UserManagement from '@/pages/UserManagment';
import AllTickets from '@/pages/AllTickets';
import ConsumerView from '@pages/ConsumerView';
import Consumers from '@pages/Consumers';
import MeterDetails from '@pages/MeterDetails';
import TicketView from '@pages/TicketView';
import Prepaid from '@pages/Prepaid';   
import Postpaid from '@pages/Postpaid';
import Feeders from '@pages/Feeders';
import AddMeter from '@pages/AddMeter';
import AddRole from '@pages/AddRole';
import AddUser from '@pages/AddUser';
import AddDataLogger from '@pages/AddDataLogger';
import SuperAdminDashboard from '@pages/SuperAdminDashboard';
import EditRole from '@pages/EditRole';
import EditUser from '@pages/EditUser';
import UserDetail from '@pages/UserDetail';
import RolesPermissions from '@pages/RolesPermissions';
import SubLogin from '@pages/SubLogin';
import DTRDetailPage from '@/pages/DTRDetailPage';
import IndividualDetailPage from '@pages/IndividualDetailPage';
import FilterStyleController from '@components/global/FilterStyleController';
import Dashboard from '@pages/ConsumerDashboard';
import ConsumerDetailView from '@pages/ConsumerDetailView';
import Payment from '@components/Occupancy-Vacency/Payment';
import FreezeStatus from '@components/Occupancy-Vacency/FreezeStatus';
import UsageSummaryPage from '@components/Occupancy-Vacency/UsageSummartPage';
import DG_Dashboard from '@/pages/DG_Dashboard';
import DgDetailView from '@pages/DgDetailView';
import ConfirmationPage from '@components/Occupancy-Vacency/ConfirmationPage';
import OccupancyStatus from '@components/Occupancy-Vacency/OccupancyStatus';
import Error from '@components/Error/Error';
const App: React.FC = () => {
    return (
        <AppProvider>
            <AuthProvider>
                <FilterStyleProvider initialStyle="BRAND_GREEN">
                    <Router>
                   
                    <Routes>
                        <Route path="/login" element={<Login />} /> 
                        <Route path="/sub-login" element={<SubLogin />} />
                        <Route path="/occupancy-status" element={<OccupancyStatus />} />
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
                            <Route path='/error' element={<Error  message='this is an dummy error' />} />
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
                            <Route path="/prepaid" element={<Prepaid />} />
                            <Route path="/postpaid" element={<Postpaid />} />
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
                            <Route path="/payment" element={<Payment amount="100" />} />
                            <Route path="/freeze-status" element={<FreezeStatus />} />
                            <Route path="/confirmation" element={<ConfirmationPage />} />
                            <Route path="/usage-summary" element={<UsageSummaryPage />} />
                            <Route path="/dg-dashboard" element={<DG_Dashboard />} />
                            <Route path="/dg-detail/:dgId" element={<DgDetailView />} />
                        </Route>
                    </Routes>
                </Router>
                </FilterStyleProvider>
            </AuthProvider>
        </AppProvider>
    );
};

export default App;

