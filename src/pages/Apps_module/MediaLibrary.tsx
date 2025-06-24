import React, { useState, useRef, useCallback } from 'react';
import {
  FiImage, FiUpload, FiTrash2, FiDownload, FiSearch, FiGrid, FiList, FiEye, FiFile, FiVideo, FiEdit3, FiStar, FiFolder, FiX, FiCloud, FiPlay
} from 'react-icons/fi';
import Card from '../../components/global/Card';
import Button from '../../components/global/Button';
import LoadingSpinner from '../../components/global/LoadingSpinner';
import Input from '../../components/forms/Input';

// Define the media file type
interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  uploadDate: string;
  dimensions: string;
  url: string;
  favorite: boolean;
  tags: string[];
  category: string;
  file?: File; // Store the actual file for preview
}

// Define view mode type
type ViewMode = 'grid' | 'list';

// Define filter type
type FilterType = 'all' | 'images' | 'videos' | 'documents';

const initialFiles: MediaFile[] = [
  {
    id: '1',
    name: 'hero-banner.jpg',
    type: 'image',
    size: '2.4 MB',
    uploadDate: '2024-01-20',
    dimensions: '1920x1080',
    url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    favorite: true,
    tags: ['hero', 'banner', 'landing'],
    category: 'banners'
  },
  {
    id: '2',
    name: 'about-team.png',
    type: 'image',
    size: '1.8 MB',
    uploadDate: '2024-01-19',
    dimensions: '1200x800',
    url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    favorite: false,
    tags: ['team', 'about', 'people'],
    category: 'team'
  },
  {
    id: '3',
    name: 'product-demo.mp4',
    type: 'video',
    size: '15.2 MB',
    uploadDate: '2024-01-18',
    dimensions: '1080p',
    url: '#',
    favorite: true,
    tags: ['demo', 'product', 'video'],
    category: 'videos'
  },
  {
    id: '4',
    name: 'company-logo.svg',
    type: 'image',
    size: '45 KB',
    uploadDate: '2024-01-17',
    dimensions: '300x300',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    favorite: false,
    tags: ['logo', 'brand', 'company'],
    category: 'logos'
  },
  {
    id: '5',
    name: 'presentation.pdf',
    type: 'document',
    size: '3.7 MB',
    uploadDate: '2024-01-16',
    dimensions: 'A4',
    url: '#',
    favorite: false,
    tags: ['presentation', 'pdf', 'business'],
    category: 'documents'
  },
  {
    id: '6',
    name: 'gallery-01.jpg',
    type: 'image',
    size: '1.2 MB',
    uploadDate: '2024-01-15',
    dimensions: '800x600',
    url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    favorite: true,
    tags: ['gallery', 'photo', 'art'],
    category: 'gallery'
  }
];

const MediaLibrary: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>(initialFiles);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image':
        return <FiImage size={20} className="text-green-600" />;
      case 'video':
        return <FiVideo size={20} className="text-purple-600" />;
      case 'document':
        return <FiFile size={20} className="text-orange-600" />;
      default:
        return <FiFile size={20} className="text-gray-600" />;
    }
  };

  const getFileTypeColor = (type: MediaFile['type']): string => {
    switch (type) {
      case 'image':
        return '#10B981';
      case 'video':
        return '#8B5CF6';
      case 'document':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (file: File): 'image' | 'video' | 'document' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const getImageDimensions = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          resolve(`${img.width}x${img.height}`);
        };
        img.onerror = () => {
          resolve('Unknown');
        };
        img.src = URL.createObjectURL(file);
      } else {
        resolve('N/A');
      }
    });
  };

  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    setUploadingFiles(prev => [...prev, ...fileArray]);

    // Process each file
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      
      // Get image dimensions if it's an image
      const dimensions = await getImageDimensions(file);
      
      setTimeout(() => {
        const newFile: MediaFile = {
          id: Date.now().toString() + i,
          name: file.name,
          type: getFileType(file),
          size: formatFileSize(file.size),
          uploadDate: new Date().toISOString().split('T')[0],
          dimensions: dimensions,
          url: URL.createObjectURL(file),
          favorite: false,
          tags: [],
          category: 'uploads',
          file: file
        };

        setUploadedFiles(prev => [newFile, ...prev]);
        setUploadingFiles(prev => prev.filter(f => f !== file));
      }, 1000 + i * 500); // Simulate upload delay
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
      setIsUploadModalOpen(false); // Close modal after successful drop
    }
  }, [handleFileUpload]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
    // Reset the input value to allow selecting the same file again
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilePreview = (file: MediaFile) => {
    setPreviewFile(file);
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  const handleToggleFavorite = (fileId: string) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { ...file, favorite: !file.favorite }
          : file
      )
    );
  };

  const filteredFiles = uploadedFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' ? true :
      selectedFilter === 'images' ? file.type === 'image' :
      selectedFilter === 'videos' ? file.type === 'video' :
      selectedFilter === 'documents' ? file.type === 'document' :
      file.category === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const handleFileSelect = (fileId: string): void => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleBulkAction = (action: string): void => {
    console.log(`${action} selected files:`, selectedFiles);
    if (action === 'delete') {
      setUploadedFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
    }
    setSelectedFiles([]);
  };

  const stats = {
    total: uploadedFiles.length,
    images: uploadedFiles.filter(f => f.type === 'image').length,
    videos: uploadedFiles.filter(f => f.type === 'video').length,
    documents: uploadedFiles.filter(f => f.type === 'document').length,
    favorites: uploadedFiles.filter(f => f.favorite).length,
    storage: '52.8 MB'
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Library</h1>
          <p className="text-gray-600">Organize and manage your digital assets</p>
        </div>
        <div className="flex gap-3">
          <Button
            label="Upload Files"
            onClick={() => setIsUploadModalOpen(true)}
            variant="primary"
          />
        </div>
      </div>

      {/* Stats Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title="Total Files"
          value={stats.total}
          icon="/icons/folder.svg"
        />
        <Card
          title="Images"
          value={stats.images}
          icon="/icons/image.svg"
        />
        <Card
          title="Videos"
          value={stats.videos}
          icon="/icons/video.svg"
        />
        <Card
          title="Documents"
          value={stats.documents}
          icon="/icons/file.svg"
        />
      </div> */}

      {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Input
                placeholder="Search files..."
                onSearch={setSearchTerm}
                className="w-full"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as FilterType)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white min-w-[150px]"
            >
              <option value="all">All Files</option>
              <option value="images">Images</option>
              <option value="videos">Videos</option>
              <option value="documents">Documents</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                title="Grid View"
              >
                <FiGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                title="List View"
              >
                <FiList size={20} />
              </button>
            </div>
          </div>
        </div>

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-900">
                {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                label="Download Selected"
                onClick={() => handleBulkAction('download')}
                variant="primary"
              />
              <Button
                label="Delete Selected"
                onClick={() => handleBulkAction('delete')}
                variant="danger"
              />
            </div>
          </div>
        </div>
      )}

      {/* Media Grid/List */}
      {filteredFiles.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group ${selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handleFileSelect(file.id)}
              >
                <div className="relative">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {file.type === 'image' ? (
                      <img 
                        src={file.url} 
                        alt={file.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    {file.type === 'video' ? (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <div className="text-center">
                          <FiPlay size={32} className="text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">Video File</p>
                        </div>
                      </div>
                    ) : null}
                    {file.type === 'document' ? (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <div className="text-center">
                          <FiFile size={32} className="text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">Document</p>
                        </div>
                      </div>
                    ) : null}
                    
                    {/* Fallback for broken images */}
                    <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <FiImage size={32} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Image</p>
                      </div>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                        <button 
                          className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200" 
                          title="Preview"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFilePreview(file);
                          }}
                        >
                          <FiEye size={16} className="text-gray-700" />
                        </button>
                        <button 
                          className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200" 
                          title="Download"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Download:', file.name);
                          }}
                        >
                          <FiDownload size={16} className="text-gray-700" />
                        </button>
                        <button 
                          className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200" 
                          title="Edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Edit:', file.name);
                          }}
                        >
                          <FiEdit3 size={16} className="text-gray-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Favorite Badge */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(file.id);
                    }}
                    className={`absolute top-2 right-2 p-1 rounded-full transition-all duration-200 ${
                      file.favorite 
                        ? 'bg-yellow-400 text-white shadow-lg' 
                        : 'bg-white bg-opacity-80 text-gray-400 hover:bg-yellow-400 hover:text-white'
                    }`}
                    title={file.favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <FiStar size={12} className={file.favorite ? 'fill-current' : ''} />
                  </button>
                  
                  {/* File Type Badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-white shadow-sm" style={{ backgroundColor: getFileTypeColor(file.type) }}>
                    {file.type}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate mb-1" title={file.name}>{file.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {file.size} • {file.dimensions}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {file.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{tag}</span>
                    ))}
                    {file.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">+{file.tags.length - 2}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Size</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Dimensions</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Upload Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 truncate">{file.name}</span>
                              {file.favorite && <FiStar size={14} className="text-yellow-400 flex-shrink-0 fill-current" />}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {file.tags.slice(0, 2).map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium" style={{ color: getFileTypeColor(file.type) }}>
                          {file.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{file.size}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{file.dimensions}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{file.uploadDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors duration-200" 
                            title="Preview"
                            onClick={() => handleFilePreview(file)}
                          >
                            <FiEye size={16} />
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-800 p-1 rounded transition-colors duration-200" 
                            title="Download"
                            onClick={() => console.log('Download:', file.name)}
                          >
                            <FiDownload size={16} />
                          </button>
                          <button 
                            className="text-yellow-600 hover:text-yellow-800 p-1 rounded transition-colors duration-200" 
                            title="Edit"
                            onClick={() => console.log('Edit:', file.name)}
                          >
                            <FiEdit3 size={16} />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800 p-1 rounded transition-colors duration-200" 
                            title="Delete"
                            onClick={() => {
                              setUploadedFiles(prev => prev.filter(f => f.id !== file.id));
                            }}
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
        )
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <FiImage size={64} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedFilter !== 'all' ? 'Try adjusting your search or filter criteria.' : 'Upload your first file to get started.'}
          </p>
          <Button
            label="Upload Files"
            onClick={() => setIsUploadModalOpen(true)}
            variant="primary"
          />
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Upload Files</h2>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                  isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FiCloud size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Drop files here or click to browse</h3>
                <p className="text-gray-600 mb-4">Support for images, videos, and documents up to 10MB each</p>
                <Button
                  label="Browse Files"
                  onClick={handleBrowseClick}
                  variant="primary"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                />
              </div>

              {/* Upload Progress */}
              {uploadingFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Uploading...</h4>
                  <div className="space-y-3">
                    {uploadingFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {getFileIcon(getFileType(file))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <div className="mt-2">
                            <LoadingSpinner className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{previewFile.name}</h2>
                <button
                  onClick={handleClosePreview}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              {previewFile.type === 'image' ? (
                <div className="text-center">
                  <img 
                    src={previewFile.url} 
                    alt={previewFile.name} 
                    className="max-w-full max-h-[60vh] object-contain mx-auto rounded-lg shadow-lg" 
                  />
                </div>
              ) : previewFile.type === 'video' ? (
                <div className="text-center">
                  <video 
                    src={previewFile.url} 
                    controls 
                    className="max-w-full max-h-[60vh] mx-auto rounded-lg shadow-lg"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiFile size={64} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Preview not available for this file type</p>
                </div>
              )}
              
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Size:</span> {previewFile.size}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Dimensions:</span> {previewFile.dimensions}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Upload Date:</span> {previewFile.uploadDate}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Type:</span> {previewFile.type}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;