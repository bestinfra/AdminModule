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
import DTRDashboard from './pages/DTRDashboard';
import DTRDetailPage from './pages/DTRDetailPage';
import Feeders from './pages/Feeders';
import DTRTotalDTRs from './pages/DTRTotalDTRs';
import DTRTotalLTFeeders from './pages/DTRTotalLTFeeders';
import DTRTotalFuseBlown from './pages/DTRTotalFuseBlown';
import DTROverloadedFeeders from './pages/DTROverloadedFeeders';
import DTRUnderloadedFeeders from './pages/DTRUnderloadedFeeders';
import DTRLTSideFuseBlown from './pages/DTRLTSideFuseBlown';
import DTRUnbalancedDTRs from './pages/DTRUnbalancedDTRs';
import DTRPowerFailureFeeders from './pages/DTRPowerFailureFeeders';
import DTRHTSideFuseBlown from './pages/DTRHTSideFuseBlown';

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
                        <Route path="/dtr-dashboard" element={<DTRDashboard />} />
                        <Route path="/dtr/:id" element={<DTRDetailPage />} />
                        <Route path="/feeders/:id" element={<Feeders />} />
                        <Route path="/dtr-statistics/total-dtrs" element={<DTRTotalDTRs />} />
                        <Route path="/dtr-statistics/total-lt-feeders" element={<DTRTotalLTFeeders />} />
                        <Route path="/dtr-statistics/total-fuse-blown" element={<DTRTotalFuseBlown />} />
                        <Route path="/dtr-statistics/overloaded-feeders" element={<DTROverloadedFeeders />} />
                        <Route path="/dtr-statistics/underloaded-feeders" element={<DTRUnderloadedFeeders />} />
                        <Route path="/dtr-statistics/lt-side-fuse-blown" element={<DTRLTSideFuseBlown />} />
                        <Route path="/dtr-statistics/unbalanced-dtrs" element={<DTRUnbalancedDTRs />} />
                        <Route path="/dtr-statistics/power-failure-feeders" element={<DTRPowerFailureFeeders />} />
                        <Route path="/dtr-statistics/ht-side-fuse-blown" element={<DTRHTSideFuseBlown />} />
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
