import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiGlobe, FiPlus, FiSettings, FiTrash2, FiExternalLink, FiShield, FiZap, FiDatabase, 
  FiWifi, FiCheckCircle, FiAlertTriangle, FiClock, FiStar, FiTrendingUp, FiDollarSign
} from 'react-icons/fi';
import Card from '../../../components/global/Card';
import Button from '../../../components/global/Button';
import Modules from './Modules';
import Branding from './Branding';

// Define the application interface
interface Application {
  id: number;
  name: string;
  description: string;
  category: string;
  status: 'connected' | 'disconnected' | 'error';
  icon: string;
  lastSync: string;
  dataPoints: string;
  provider: string;
  version: string;
  healthScore: number;
  monthlyUsage: string;
  cost: string;
}

// Define the available app interface
interface AvailableApp {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  provider: string;
  popular: boolean;
  rating: number;
  cost: string;
  features: string[];
}

const defaultProjects = [
  { name: 'GMR', logo: '🛫', details: 'GMR Group Project' },
  { name: 'Railways', logo: '🚆', details: 'Indian Railways Project' },
  { name: 'TGMPDCL', logo: '⚡', details: 'Telangana Power Project' },
  { name: 'LA', logo: '🏛️', details: 'Local Authority Project' },
];

const Applications: React.FC = () => {
  const [applications] = useState<Application[]>([
    {
      id: 1,
      name: 'Google Analytics 4',
      description: 'Advanced web analytics with AI-powered insights and cross-platform tracking',
      category: 'Analytics',
      status: 'connected',
      icon: '📊',
      lastSync: '2024-01-20 14:30',
      dataPoints: '156,234 events',
      provider: 'Google',
      version: '4.0',
      healthScore: 98,
      monthlyUsage: '2.4M requests',
      cost: '$0/month'
    },
    {
      id: 2,
      name: 'Mailchimp Pro',
      description: 'Email marketing automation with advanced segmentation and A/B testing',
      category: 'Marketing',
      status: 'connected',
      icon: '📧',
      lastSync: '2024-01-20 12:15',
      dataPoints: '12,847 subscribers',
      provider: 'Mailchimp',
      version: '3.2',
      healthScore: 95,
      monthlyUsage: '45K emails sent',
      cost: '$99/month'
    },
    {
      id: 3,
      name: 'Stripe Payments',
      description: 'Secure payment processing with support for global currencies and methods',
      category: 'E-commerce',
      status: 'disconnected',
      icon: '💳',
      lastSync: '2024-01-15 09:45',
      dataPoints: '$124,450 processed',
      provider: 'Stripe',
      version: '2024.1',
      healthScore: 0,
      monthlyUsage: '0 transactions',
      cost: '2.9% + 30¢'
    },
    {
      id: 4,
      name: 'Slack Business+',
      description: 'Team communication with unlimited message history and advanced security',
      category: 'Communication',
      status: 'connected',
      icon: '💬',
      lastSync: '2024-01-20 16:20',
      dataPoints: '45 channels, 127 members',
      provider: 'Slack',
      version: '1.8',
      healthScore: 92,
      monthlyUsage: '12K messages',
      cost: '$12.50/user'
    },
    {
      id: 5,
      name: 'Cloudflare Pro',
      description: 'CDN, security, and performance optimization with advanced analytics',
      category: 'Infrastructure',
      status: 'connected',
      icon: '☁️',
      lastSync: '2024-01-20 18:00',
      dataPoints: '99.9% uptime',
      provider: 'Cloudflare',
      version: '2024.1',
      healthScore: 99,
      monthlyUsage: '1.2TB bandwidth',
      cost: '$20/month'
    },
    {
      id: 6,
      name: 'Facebook Pixel',
      description: 'Social media advertising tracking and conversion optimization',
      category: 'Marketing',
      status: 'error',
      icon: '📱',
      lastSync: '2024-01-18 10:30',
      dataPoints: '8,923 events tracked',
      provider: 'Meta',
      version: '2.1',
      healthScore: 45,
      monthlyUsage: 'Limited data',
      cost: '$0/month'
    }
  ]);

  const [availableApps] = useState<AvailableApp[]>([
    {
      id: 7,
      name: 'Zapier Professional',
      description: 'Advanced workflow automation connecting 5000+ apps with premium features',
      category: 'Automation',
      icon: '⚡',
      provider: 'Zapier',
      popular: true,
      rating: 4.8,
      cost: '$49/month',
      features: ['Multi-step Zaps', 'Premium Apps', 'Priority Support']
    },
    {
      id: 8,
      name: 'HubSpot CRM Suite',
      description: 'Complete customer relationship management with sales pipeline and marketing automation',
      category: 'CRM',
      icon: '🤝',
      provider: 'HubSpot',
      popular: false,
      rating: 4.6,
      cost: '$45/month',
      features: ['Contact Management', 'Deal Pipeline', 'Email Templates']
    },
    {
      id: 9,
      name: 'Shopify Plus',
      description: 'Enterprise e-commerce platform with advanced customization and B2B features',
      category: 'E-commerce',
      icon: '🛒',
      provider: 'Shopify',
      popular: true,
      rating: 4.9,
      cost: '$2000/month',
      features: ['Unlimited Staff', 'Advanced Reports', 'Script Editor']
    }
  ]);

  const [projects, setProjects] = useState(() => {
    const stored = sessionStorage.getItem('projects');
    return stored ? JSON.parse(stored) : defaultProjects;
  });
  const [selectedProject, setSelectedProject] = useState(projects[0]?.name || '');

  useEffect(() => {
    const stored = sessionStorage.getItem('projects');
    if (stored) setProjects(JSON.parse(stored));
  }, []);

  const projectDetails = projects.find((p: any) => p.name === selectedProject);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Analytics':
        return <FiDatabase className="text-blue-600" size={20} />;
      case 'Marketing':
        return <FiZap className="text-purple-600" size={20} />;
      case 'Infrastructure':
        return <FiShield className="text-green-600" size={20} />;
      case 'E-commerce':
        return <FiGlobe className="text-orange-600" size={20} />;
      default:
        return <FiGlobe className="text-gray-600" size={20} />;
    }
  };

  const categories = ['Branding', 'Modules'];
  const [selectedCategory, setSelectedCategory] = useState('Branding');

  const filteredApps = selectedCategory === 'All' 
    ? applications 
    : applications.filter(app => app.category === selectedCategory);

  const stats = {
    total: applications.length,
    active: applications.filter(app => app.status === 'connected').length,
    monthlySpend: '$201',
    avgHealth: '88%'
  };

  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen">

        {/* Dropdown for project selection */}
        <div className="mb-6 w-full max-w-xs">
          <label htmlFor="projectDropdown" className="block text-sm font-medium text-gray-700 mb-1">Select Project</label>
          <select
            id="projectDropdown"
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
          >
            {projects.map((project: any) => (
              <option key={project.name} value={project.name}>{project.name}</option>
            ))}
          </select>
        </div>

      {/* Header */}
      <div className="bg-white rounded-lg py-2 mb-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications Management</h1>
          <p className="text-gray-600">Manage organization projects, configure branding, and enable application modules with ease.</p>
        </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              label="Create Project"
              onClick={() => navigate('/apps/create-project')}
              variant="primary"
            />
          </div>
        </div>
      </div>
      
      {/* Project Boxes */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Project</h2>

        {/* Show selected project details */}
        {projectDetails && (
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200 mb-6 relative min-h-[220px] flex justify-between items-center">
          {/* Left Content */}
          <div className="flex items-start gap-4">
            <div className="text-5xl">{projectDetails.logo}</div>
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-1">{projectDetails.name}</h2>
              <p className="text-gray-600 text-sm mb-1">{projectDetails.details}</p>
            </div>
          </div>

          {/* Right Button */}
          <div className="absolute bottom-4 right-4">
              <Button
                  label="Next"
                  onClick={() => {
                    sessionStorage.setItem('selectedProject', JSON.stringify(projectDetails));
                    navigate('/apps/branding');
                  }}
                  variant="primary"
                />
                </div>
              </div>
            )}

      </div>
    </div>
  );
};

export default Applications; 