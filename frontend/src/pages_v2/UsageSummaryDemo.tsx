import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UsageSummaryPage from '@components/Occupancy-Vacency/UsageSummartPage';

const UsageSummaryDemo: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Usage Summary Page Demo
                        </h1>
                        <p className="text-gray-600 mb-6">
                            This is a demonstration of the modern UsageSummaryPage component built with TypeScript and Tailwind CSS.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">Features:</h3>
                            <ul className="text-blue-700 space-y-1">
                                <li>• Modern TypeScript implementation with proper type safety</li>
                                <li>• Tailwind CSS styling with theme integration</li>
                                <li>• Editable meter readings with validation</li>
                                <li>• Expandable sections for advance amounts and other charges</li>
                                <li>• Responsive design with mobile optimization</li>
                                <li>• Loading states and error handling</li>
                                <li>• Confirmation checkbox for finalization</li>
                            </ul>
                        </div>
                        <Link 
                            to="/usage-summary/12345" 
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            View Usage Summary Demo
                        </Link>
                    </div>
                    
                    <Routes>
                        <Route 
                            path="/usage-summary/:meter_no" 
                            element={
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <UsageSummaryPage />
                                </div>
                            } 
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default UsageSummaryDemo; 