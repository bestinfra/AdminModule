import React, { useState, useMemo } from 'react';
import { AVAILABLE_MODULES } from '../../../types/module';
import { exportModules } from '../../../api/exportModules';
import { FaSearch, FaDownload } from 'react-icons/fa';
import Button from '../../../components/global/Button';
import { useNavigate, useLocation } from 'react-router-dom';

const ModuleSelection: React.FC = () => {
    const [selectedModules, setSelectedModules] = useState<Set<string>>(
        new Set()
    );
    const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
    const [isExporting, setIsExporting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const location = useLocation();
    let project = location.state?.project;
    if (!project) {
      const stored = sessionStorage.getItem('selectedProject');
      if (stored) {
        project = JSON.parse(stored);
      }
    }

    const filteredModules = useMemo(() => {
        if (!searchQuery) return AVAILABLE_MODULES;
        const query = searchQuery.toLowerCase();
        return AVAILABLE_MODULES.filter(
            (module) =>
                module.name.toLowerCase().includes(query) ||
                module.description.toLowerCase().includes(query) ||
                module.pages.some(
                    (page) =>
                        page.name.toLowerCase().includes(query) ||
                        page.description.toLowerCase().includes(query)
                )
        );
    }, [searchQuery]);

    const handleModuleToggle = (moduleId: string) => {
        const newSelectedModules = new Set(selectedModules);
        if (newSelectedModules.has(moduleId)) {
            newSelectedModules.delete(moduleId);
            const module = AVAILABLE_MODULES.find((m) => m.id === moduleId);
            if (module) {
                const newSelectedPages = new Set(selectedPages);
                module.pages.forEach((page) =>
                    newSelectedPages.delete(page.id)
                );
                setSelectedPages(newSelectedPages);
            }
        } else {
            newSelectedModules.add(moduleId);
        }
        setSelectedModules(newSelectedModules);
    };

    const handlePageToggle = (pageId: string) => {
        const newSelectedPages = new Set(selectedPages);
        if (newSelectedPages.has(pageId)) {
            newSelectedPages.delete(pageId);
        } else {
            newSelectedPages.add(pageId);
        }
        setSelectedPages(newSelectedPages);
    };

    const handleExport = async () => {
        try {
            setIsExporting(true);
            const selectedModuleData = AVAILABLE_MODULES.filter((module) =>
                selectedModules.has(module.id)
            ).map((module) => ({
                ...module,
                pages: module.pages.filter((page) =>
                    selectedPages.has(page.id)
                ),
            }));

            const zipBlob = await exportModules(selectedModuleData);
            const url = window.URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'nextjs-modules.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exporting modules:', error);
            alert('Failed to export modules. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleBack = () => {
        navigate('/apps/branding');
    };

    const navigate = useNavigate();
    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Select Modules to Export{project ? ` for ${project.name}` : ''}
                    </h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search modules..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredModules.map((module) => (
                        <div
                            key={module.id}
                            className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 ${
                                selectedModules.has(module.id)
                                    ? 'ring-2 ring-blue-500'
                                    : ''
                            }`}>
                            <div className="p-6">
                                <div className="flex items-start space-x-4">
                                    <div
                                        className={`p-3 rounded-lg ${module.color} text-white`}>
                                        <module.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold text-gray-800">
                                                {module.name}
                                            </h2>
                                            <input
                                                type="checkbox"
                                                id={`module-${module.id}`}
                                                checked={selectedModules.has(
                                                    module.id
                                                )}
                                                onChange={() =>
                                                    handleModuleToggle(
                                                        module.id
                                                    )
                                                }
                                                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                        </div>
                                        <p className="text-gray-600 mt-1">
                                            {module.description}
                                        </p>
                                    </div>
                                </div>

                                {selectedModules.has(module.id) && (
                                    <div className="mt-4 space-y-3 pl-14">
                                        {module.pages.map((page) => (
                                            <div
                                                key={page.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                                <div className="flex items-center space-x-3">
                                                    <page.icon className="w-5 h-5 text-gray-500" />
                                                    <div>
                                                        <span className="font-medium text-gray-800">
                                                            {page.name}
                                                        </span>
                                                        <p className="text-sm text-gray-500">
                                                            {page.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    id={`page-${page.id}`}
                                                    checked={selectedPages.has(
                                                        page.id
                                                    )}
                                                    onChange={() =>
                                                        handlePageToggle(
                                                            page.id
                                                        )
                                                    }
                                                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                <Button
              label="Back"
              onClick={handleBack}
              variant="primarysmall"
            />
                    <button
                        onClick={handleExport}
                        disabled={selectedModules.size === 0 || isExporting}
                        className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200">
                        <FaDownload className="mr-2" />
                        {isExporting
                            ? 'Exporting...'
                            : 'Export Selected Modules'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModuleSelection; 