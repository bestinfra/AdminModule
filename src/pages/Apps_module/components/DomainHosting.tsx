import React, { useState } from 'react';
import {
  FiServer, FiGlobe, FiShield, FiZap, FiAlertTriangle, FiCheckCircle, FiClock, FiSettings, FiPlus, FiTrash2
} from 'react-icons/fi';
import Button from '../../../components/global/Button';

// Define the domain interface
interface Domain {
  id: number;
  domain: string;
  status: 'active' | 'expired' | 'pending';
  ssl: boolean;
  provider: string;
  expiryDate: string;
  autoRenew: boolean;
  dnsRecords: number;
  isPrimary: boolean;
}

const DomainHosting: React.FC = () => {
  const [domains] = useState<Domain[]>([
    {
      id: 1,
      domain: 'gmr-utility.com',
      status: 'active',
      ssl: true,
      provider: 'AWS Route 53',
      expiryDate: '2025-12-31',
      autoRenew: true,
      dnsRecords: 15,
      isPrimary: true
    },
    {
      id: 2,
      domain: 'portal.gmr-utility.com',
      status: 'active',
      ssl: true,
      provider: 'AWS Route 53',
      expiryDate: '2025-12-31',
      autoRenew: true,
      dnsRecords: 10,
      isPrimary: false
    },
    {
      id: 3,
      domain: 'api.gmr-utility.com',
      status: 'active',
      ssl: true,
      provider: 'Cloudflare',
      expiryDate: '2025-10-15',
      autoRenew: true,
      dnsRecords: 7,
      isPrimary: false
    },
    {
      id: 4,
      domain: 'legacy.gmr-utility.net',
      status: 'expired',
      ssl: false,
      provider: 'GoDaddy',
      expiryDate: '2023-08-01',
      autoRenew: false,
      dnsRecords: 4,
      isPrimary: false
    }
  ]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDomainSettings = (domain: Domain) => {
    console.log('Opening settings for domain:', domain);
    // Here you would typically open domain settings
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Domains List */}
      <div className="py-6">
          <h2 className="text-xl font-semibold text-gray-900">Domains</h2>
        </div>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8 overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Domain</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">SSL</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Provider</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {domains.map((domain) => (
                <tr key={domain.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-semibold text-gray-900">{domain.domain}</div>
                      {domain.isPrimary && (
                        <div className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded w-fit">Primary Domain</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(domain.status)}`}>
                      {domain.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {domain.ssl ? (
                      <FiCheckCircle className="text-green-500" size={20} />
                    ) : (
                      <FiAlertTriangle className="text-red-500" size={20} />
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{domain.provider}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        className="text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 p-2 rounded transition-colors duration-200"
                        onClick={() => handleDomainSettings(domain)}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DomainHosting; 