import React from 'react';
import Button from '@components/global/Button';
import type { CommonInputProps } from '@components/forms/types';

interface FileInputProps extends CommonInputProps {
  value: FileList | null;
  icon?: string;
  fileInputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>;
}

const FileInput: React.FC<FileInputProps> = ({ 
  value, icon, fileInputRefs, ...commonProps 
}) => {
  return (
    <div className="relative flex flex-col gap-5">
      <input 
        ref={(el) => { fileInputRefs.current[commonProps.name] = el; }} 
        type="file" 
        {...commonProps} 
        className="hidden" 
        accept="image/*,.pdf,.doc,.docx" 
      />
      <div className="flex items-center justify-between p-4 border border-[var(--color-primary-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-primary-dark-light)] rounded-xl">
        <div className="flex items-center space-x-3">
          <Button 
            onClick={() => fileInputRefs.current[commonProps.name]?.click()} 
            label="Choose File" 
          />
          <span className="text-sm text-[var(--color-light)] dark:text-[var(--color-neutral-light)] truncate max-w-[200px]">
            {value?.[0]?.name || 'No file chosen'}
          </span>
        </div>
        {icon && <img src={icon} alt="" className="w-5 h-5 text-gray-400" />}
      </div>
    </div>
  );
};

export default FileInput; 