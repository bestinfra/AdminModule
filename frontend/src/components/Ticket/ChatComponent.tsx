import React, { useState } from 'react';

// Interfaces
interface ChatMessage {
    sender_type: 'user' | 'admin';
    sender_name: string;
    message: string;
    timestamp: string;
    attachments?: FileAttachment[];
    metadata?: {
        role: string;
        department: string;
        isInternal: boolean;
    };
}

interface FileAttachment {
    name: string;
    size: number;
    type: string;
    url?: string;
    file?: File;
    path?: string;
}

interface ChatComponentProps {
    messages: ChatMessage[];
    onSendMessage: (message: string, attachments: File[]) => void;
    isSubmitting?: boolean;
    currentUserName?: string;
    isAdmin?: boolean;
    className?: string;
}

// Message Bubble Component
const MessageBubble: React.FC<{ message: ChatMessage; isOwnMessage: boolean }> = ({
    message,
    isOwnMessage,
}) => {
    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-3 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isOwnMessage ? 'bg-accent' : 'bg-neutral-light'
                    }`}>
                        <svg
                            className={`w-4 h-4 ${isOwnMessage ? 'text-white' : 'text-neutral'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>

                    {/* Message Content */}
                    <div className={`flex-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        {/* Sender Info */}
                        <div className={`mb-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                            <p className={`text-sm font-medium ${isOwnMessage ? 'text-accent' : 'text-neutral-darker'}`}>
                                {message.sender_name}
                            </p>
                            <p className="text-xs text-neutral">
                                {formatDate(message.timestamp)}
                            </p>
                        </div>

                        {/* Message Bubble */}
                        <div className={`inline-block rounded-lg px-4 py-3 max-w-full ${
                            isOwnMessage 
                                ? 'bg-accent text-white' 
                                : 'bg-neutral-light text-neutral-darker'
                        }`}>
                            <p className="text-sm leading-relaxed break-words">
                                {message.message}
                            </p>

                            {/* Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {message.attachments.map((attachment, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center space-x-2 p-2 rounded border ${
                                                isOwnMessage 
                                                    ? 'bg-accent-light border-accent' 
                                                    : 'bg-white border-neutral-light'
                                            }`}>
                                            <svg
                                                className="w-4 h-4 text-neutral"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                />
                                            </svg>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-medium truncate ${
                                                    isOwnMessage ? 'text-white' : 'text-neutral-darker'
                                                }`}>
                                                    {attachment.name}
                                                </p>
                                                <p className={`text-xs ${
                                                    isOwnMessage ? 'text-accent-light' : 'text-neutral'
                                                }`}>
                                                    {formatFileSize(attachment.size)}
                                                </p>
                                            </div>
                                            <button
                                                className={`p-1 rounded hover:bg-opacity-20 ${
                                                    isOwnMessage 
                                                        ? 'hover:bg-white text-white' 
                                                        : 'hover:bg-neutral text-neutral'
                                                }`}>
                                                <svg
                                                    className="w-3 h-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Chat Input Component
const ChatInput: React.FC<{
    message: string;
    setMessage: (message: string) => void;
    onSend: () => void;
    onAttach: (files: File[]) => void;
    isSubmitting?: boolean;
    className?: string;
}> = ({ message, setMessage, onSend, onAttach, isSubmitting = false, className = '' }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0) {
            onAttach(files);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className={`bg-accent rounded-lg p-4 ${className}`}>
            <div className="flex items-center space-x-2">
                {/* Attachment Button */}
                <label className="p-2 text-white hover:bg-accent-light rounded-lg cursor-pointer transition-colors">
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                    />
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                    </svg>
                </label>

                {/* Message Input */}
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="flex-1 px-4 py-3 bg-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-neutral-darker placeholder-neutral"
                    disabled={isSubmitting}
                />

                {/* Send Button */}
                <button
                    onClick={onSend}
                    disabled={!message.trim() || isSubmitting}
                    className="px-4 py-3 bg-accent-light text-white rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors">
                    {isSubmitting ? (
                        <svg
                            className="w-5 h-5 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    ) : (
                        'Send'
                    )}
                </button>
            </div>
        </div>
    );
};

// Main Chat Component
const ChatComponent: React.FC<ChatComponentProps> = ({
    messages,
    onSendMessage,
    isSubmitting = false,
    currentUserName = 'User',
    // isAdmin = false,
    className = '',
}) => {
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);

    const handleSend = () => {
        if (!message.trim() && attachments.length === 0) return;
        
        onSendMessage(message, attachments);
        setMessage('');
        setAttachments([]);
    };

    const handleAttach = (files: File[]) => {
        setAttachments(prev => [...prev, ...files]);
    };

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center py-8 text-neutral">
                        <svg
                            className="w-12 h-12 mx-auto mb-4 text-neutral-light"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <MessageBubble
                            key={`${msg.timestamp}-${index}`}
                            message={msg}
                            isOwnMessage={msg.sender_name === currentUserName}
                        />
                    ))
                )}
            </div>

            {/* Chat Input */}
            <div className="p-4">
                <ChatInput
                    message={message}
                    setMessage={setMessage}
                    onSend={handleSend}
                    onAttach={handleAttach}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
};

export default ChatComponent;
export type { ChatMessage, FileAttachment, ChatComponentProps }; 