import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from '@components/global/Button';
import Form from '@components/Form/Form';
import type { FormInputConfig, FormInputValue } from '@components/Form/types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  showCloseIcon?: boolean;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
  backdropClosable?: boolean;
  className?: string;
  modalId?: string;
  showConfirmButton?: boolean;
  confirmButtonLabel?: string;
  onConfirm?: () => void;
  message?: string;
  warningMessage?: string;
  // Form props for edit/add role
  showForm?: boolean;
  formFields?: FormInputConfig[];
  onSave?: (formData: Record<string, FormInputValue>) => void;
  saveButtonLabel?: string;
  cancelButtonLabel?: string;
  cancelButtonVariant?: 'primary' | 'secondary' | 'outline';
  confirmButtonVariant?: 'primary' | 'secondary' | 'outline' | 'danger';
  formInitialData?: Record<string, FormInputValue>;
  formErrorMessages?: Record<string, string>;
  formId?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  showCloseIcon = true,
  children,
  size = 'md',
  centered = false,
  backdropClosable = true,
  className = '',
  modalId,
  showConfirmButton = false,
  confirmButtonLabel = 'Confirm',
  onConfirm,
  message,
  warningMessage,
  showForm = false,
  formFields = [],
  onSave,
  saveButtonLabel = 'Save',
  cancelButtonLabel = 'Cancel',
  cancelButtonVariant = 'secondary',
  confirmButtonVariant = 'primary',
  formInitialData,
  formErrorMessages,
  formId
}) => {
  const uniqueModalId = modalId || `modal-${Math.random().toString(36).substr(2, 9)}`;
  
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      previousActiveElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (backdropClosable && event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleFormSubmit = (formData: Record<string, FormInputValue>) => {
    if (onSave) {
      onSave(formData);
    }
  };

  const sizeClasses = {
    sm: 'max-w-sm w-full mx-4',
    md: 'max-w-md w-full mx-4',
    lg: 'max-w-lg w-full mx-4',
    xl: 'max-w-xl w-full mx-4'
  };

  if (!isOpen) return null;

  return (
    <>
      {createPortal(
        <section
          className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-labelledby={title ? `${uniqueModalId}-title` : undefined}
          aria-describedby={`${uniqueModalId}-description`}
          role="dialog"
          aria-modal="true"
          id={uniqueModalId}
        >
          <button
            className={`fixed inset-0  bg-opacity-60 backdrop-blur-md transition-all duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleBackdropClick}
            aria-hidden="true"
            type="button"
          />

          <main className={`flex min-h-full items-center justify-center p-4 ${centered ? '' : 'pt-16'}`}>
            <article
              ref={modalRef}
              className={`relative w-full ${sizeClasses[size]} bg-white hover:bg-brand-blue-dark dark:bg-primary-dark-light rounded-xl shadow-2xl border border-primary-border dark:border-primary-dark-light transform transition-all duration-300 ease-out ${
                isOpen 
                  ? 'scale-100 opacity-100 translate-y-0' 
                  : 'scale-95 opacity-0 translate-y-4'
              } ${className}`}
              tabIndex={-1}
              role="document"
            >
              {(title || showCloseIcon) && (
                <header className="flex items-center justify-between p-6  border-b  border-primary-border dark:border-primary-dark-light bg-white dark:bg-primary-dark rounded-t-xl ">
                  {title && (
                    <h2
                      id={`${uniqueModalId}-title`}
                      className="text-lg font-semibold text-main dark:text-white text-grey"
                    >
                      {title}
                    </h2>
                  )}
                  {showCloseIcon && (
                    <span
                      onClick={onClose}
                      className="w-8 h-8 rounded-full bg-background-secondary dark:bg-dark-secondary flex justify-center items-center relative transition-colors duration-300 cursor-pointer"
                      aria-label="Close modal"
                    >
                      <img
                        src="icons/close.svg "
                        alt="Close"
                        className="w-5 h-5"
                      />
                    </span>
                  )}
                </header>
              )}

              <main className="px-6 py-6 dark:bg-primary-dark text-main dark:text-white">
                <section id={`${uniqueModalId}-description`} className="space-y-4">
                  {children || (
                    <>
                      {showForm && formFields.length > 0 ? (
                        <Form
                          inputs={formFields.map(field => ({
                            ...field,
                            col: 1,
                            colSpan: 3
                          }))}
                          onSubmit={handleFormSubmit}
                          submitLabel={saveButtonLabel}
                          cancelLabel={cancelButtonLabel}
                          formId={formId || `${uniqueModalId}-form`}
                          initialData={formInitialData}
                          errorMessages={formErrorMessages}
                          showFormActions={false}
                          formBackground=""
                          padding="p-0"
                          border="none"
                          gridLayout={{
                            gridRows: formFields.length,
                            gridColumns: 3,
                            gap: "gap-4"
                          }}
                        />
                      ) : (
                        <>
                          {message && (
                            <p className="text-gray-600">
                              {message}
                            </p>
                          )}
                          {warningMessage && (
                            <p className="text-sm text-gray-500">
                              {warningMessage}
                            </p>
                          )}
                        </>
                      )}
                    </>
                  )}
                </section>
              </main>

              {(showConfirmButton || (showForm && formFields.length > 0)) && (
                <footer className="flex justify-end gap-3 px-6 py-4 border-t border-primary-border dark:border-primary-dark-light bg-white dark:bg-primary-dark rounded-b-xl">
                  {showForm && formFields.length > 0 ? (
                    <>
                      <Button
                        label={cancelButtonLabel}
                        variant={cancelButtonVariant}
                        onClick={onClose}
                      />
                      <Button
                        label={saveButtonLabel}
                        onClick={() => {
                          // Trigger form submission
                          const formElement = document.getElementById(formId || `${uniqueModalId}-form`) as HTMLFormElement;
                          if (formElement) {
                            formElement.requestSubmit();
                          }
                        }}
                      />
                    </>
                  ) : (
                    <Button
                      label={confirmButtonLabel}
                      onClick={onConfirm}
                      variant={confirmButtonVariant}
                    />
                  )}
                </footer>
              )}
            </article>
          </main>
        </section>,
        document.body
      )}
    </>
  );
};

export default Modal;
