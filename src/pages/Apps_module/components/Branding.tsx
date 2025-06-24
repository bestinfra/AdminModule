import React, { useState } from 'react';
import {
  FiUpload, FiSave, FiEye, FiType, FiImage, FiCode, FiSettings
} from 'react-icons/fi';
import Button from '../../../components/global/Button';
import { useNavigate, useLocation } from 'react-router-dom';

// Define the brand settings interface
interface BrandSettings {
  logo: {
    primary: string;
    secondary: string;
    favicon: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSize: string;
    lineHeight: string;
  };
  spacing: {
    containerWidth: string;
    sectionPadding: string;
    elementSpacing: string;
  };
  customCSS: string;
}

// Define color preset interface
interface ColorPreset {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const Branding: React.FC = () => {
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({
    logo: {
      primary: '',
      secondary: '',
      favicon: ''
    },
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: '1rem',
      lineHeight: '1.6'
    },
    spacing: {
      containerWidth: '75rem',
      sectionPadding: '5rem',
      elementSpacing: '1.5rem'
    },
    customCSS: `/* Custom CSS */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-primary {
  background: var(--primary-color);
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-0.125rem);
  box-shadow: 0 0.5rem 1.5625rem rgba(0,0,0,0.15);
}`
  });

  const colorPresets: ColorPreset[] = [
    { name: 'Ocean Blue', colors: { primary: '#3B82F6', secondary: '#06B6D4', accent: '#8B5CF6' } },
    { name: 'Forest Green', colors: { primary: '#10B981', secondary: '#059669', accent: '#F59E0B' } },
    { name: 'Sunset Orange', colors: { primary: '#F97316', secondary: '#EF4444', accent: '#8B5CF6' } },
    { name: 'Purple Haze', colors: { primary: '#8B5CF6', secondary: '#EC4899', accent: '#F59E0B' } },
    { name: 'Monochrome', colors: { primary: '#1F2937', secondary: '#6B7280', accent: '#F59E0B' } }
  ];

  const fontOptions = [
    'Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins', 'Lato', 'Source Sans Pro', 'Nunito'
  ];

  const updateColor = (key: string, value: string) => {
    setBrandSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value
      }
    }));
  };

  const applyColorPreset = (preset: ColorPreset) => {
    setBrandSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        ...preset.colors
      }
    }));
  };

  const handleSaveChanges = () => {
    console.log('Saving brand settings:', brandSettings);
    // Here you would typically save to your backend
  };

  const handlePreview = () => {
    console.log('Previewing brand settings:', brandSettings);
    // Here you would typically show a preview modal
  };

  const location = useLocation();
  const navigate = useNavigate();
  let project = location.state?.project;
  if (!project) {
    const stored = sessionStorage.getItem('selectedProject');
    if (stored) {
      project = JSON.parse(stored);
    }
  }

  const handleBack = () => {
    navigate('/apps/applications');
  };

  const handleNext = () => {
    navigate('/apps/modules');
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg py-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Branding {project ? `for ${project.name}` : ''}
            </h1>
            <p className="text-gray-600">Customize your website's visual identity and brand elements</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              label="Preview"
              onClick={handlePreview}
              variant="primarysmall"
            />
            <Button
              label="Save Changes"
              onClick={handleSaveChanges}
              variant="primary"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo & Assets */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b-2 border-blue-500 flex items-center gap-2">
            <FiImage size={20} />
            Logo & Assets
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Primary Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors duration-200 cursor-pointer">
                <FiUpload size={32} className="text-gray-400 mx-auto mb-3" />
                <p className="text-gray-900 font-medium mb-1">Upload your primary logo</p>
                <p className="text-gray-600 text-sm">PNG, JPG or SVG (recommended)</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Secondary Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors duration-200 cursor-pointer">
                <FiUpload size={32} className="text-gray-400 mx-auto mb-3" />
                <p className="text-gray-900 font-medium mb-1">Upload your secondary logo</p>
                <p className="text-gray-600 text-sm">For dark backgrounds</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Favicon</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200 cursor-pointer">
                <FiUpload size={24} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-900 font-medium mb-1">Upload favicon</p>
                <p className="text-gray-600 text-sm">32x32 px ICO or PNG</p>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b-2 border-blue-500">
            Color Palette
          </h2>
          <div className="space-y-6">
            {/* Color Presets */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Color Presets</label>
              <div className="grid grid-cols-2 gap-3">
                {colorPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => applyColorPreset(preset)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: preset.colors.primary }}></div>
                        <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: preset.colors.secondary }}></div>
                        <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: preset.colors.accent }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{preset.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Custom Colors</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brandSettings.colors.primary}
                      onChange={(e) => updateColor('primary', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={brandSettings.colors.primary}
                      onChange={(e) => updateColor('primary', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Secondary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brandSettings.colors.secondary}
                      onChange={(e) => updateColor('secondary', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={brandSettings.colors.secondary}
                      onChange={(e) => updateColor('secondary', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brandSettings.colors.accent}
                      onChange={(e) => updateColor('accent', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={brandSettings.colors.accent}
                      onChange={(e) => updateColor('accent', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Text Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brandSettings.colors.text}
                      onChange={(e) => updateColor('text', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={brandSettings.colors.text}
                      onChange={(e) => updateColor('text', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b-2 border-blue-500 flex items-center gap-2">
            <FiType size={20} />
            Typography
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Heading Font</label>
                <select
                  value={brandSettings.typography.headingFont}
                  onChange={(e) => setBrandSettings(prev => ({
                    ...prev,
                    typography: { ...prev.typography, headingFont: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Body Font</label>
                <select
                  value={brandSettings.typography.bodyFont}
                  onChange={(e) => setBrandSettings(prev => ({
                    ...prev,
                    typography: { ...prev.typography, bodyFont: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Base Font Size</label>
                <select
                  value={brandSettings.typography.fontSize}
                  onChange={(e) => setBrandSettings(prev => ({
                    ...prev,
                    typography: { ...prev.typography, fontSize: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="0.875rem">Small (14px)</option>
                  <option value="1rem">Medium (16px)</option>
                  <option value="1.125rem">Large (18px)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Line Height</label>
                <select
                  value={brandSettings.typography.lineHeight}
                  onChange={(e) => setBrandSettings(prev => ({
                    ...prev,
                    typography: { ...prev.typography, lineHeight: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1.4">Tight (1.4)</option>
                  <option value="1.6">Normal (1.6)</option>
                  <option value="1.8">Relaxed (1.8)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* Footer */}
      <div className="bg-white rounded-lg py-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-end gap-4">
          <div className="flex gap-3 flex-wrap">
            <Button
              label="Back"
              onClick={handleBack}
              variant="primarysmall"
            />
            <Button
              label="Next"
              onClick={handleNext}
              variant="primary"
            />
          </div>
        </div>
      </div>


    </div>
  );
};

export default Branding; 