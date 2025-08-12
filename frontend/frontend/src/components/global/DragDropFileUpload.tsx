import React from "react";

interface DragDropFileUploadProps {
  id: string;
  name: string;
  label: string;
  preview?: string | null;
  isDragOver?: boolean;
  onFileChange: (file: File) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  browseLabel?: string;
  helperText?: string;
  containerClassName?: string;
  imgClassName?: string;
  iconClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  previewOnClick?: () => void;
}

const DragDropFileUpload: React.FC<DragDropFileUploadProps> = ({
  id,
  name,
  label,
  preview,
  isDragOver = false,
  onFileChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onChange,
  accept = "image/*",
  browseLabel = "browse",
  helperText = "PNG, SVG up to 5MB",
  containerClassName = "",
  imgClassName = "w-32 h-32 rounded-lg object-contain p-2",
  iconClassName = "w-8 h-8 filter dark:invert opacity-60",
  inputClassName = "hidden",
  labelClassName = "block text-sm font-medium text-main dark:text-white",
  previewOnClick,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
    // Call the form's onChange if provided
    onChange?.(e);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div
          className={`w-full border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-gray-300 dark:border-dark-border hover:border-primary"
          } ${containerClassName}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            type="file"
            id={id}
            name={name}
            accept={accept}
            onChange={handleInputChange}
            className={inputClassName}
          />
          <div className="flex flex-col items-center gap-2">
            {preview ? (
              <div
                className="w-full h-full cursor-pointer flex items-center justify-center"
                onClick={previewOnClick}
              >
                <img
                  src={preview}
                  alt="Preview"
                  className={imgClassName}
                />
              </div>
            ) : (
              <>
                <img
                  src="/icons/cloud-upload-alt.svg"
                  alt="Upload"
                  className={iconClassName}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Drag & drop file here or {" "}
                  <label
                    htmlFor={id}
                    className="text-primary cursor-pointer hover:underline"
                  >
                    {browseLabel}
                  </label>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {helperText}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragDropFileUpload; 
