import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from '@/components/global/Button';

// Interfaces
export interface ChatMessage {
    id: string;
    sender_type: 'user' | 'admin' | 'system';
    sender_name: string;
    sender_avatar?: string;
    message: string;
    timestamp: string;
    attachments?: FileAttachment[];
    metadata?: {
        role: string;
        department: string;
        isInternal: boolean;
        readBy?: string[];
    };
    status?: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface FileAttachment {
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
    file?: File;
    path?: string;
    thumbnail?: string;
}

export interface ChatUser {
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'offline' | 'away' | 'busy';
    lastSeen?: string;
    role: string;
}

export interface ChatApplicationProps {
    // Core props
    messages: ChatMessage[];
    currentUser: ChatUser;
    participants: ChatUser[];
    
    // Event handlers
    onSendMessage: (message: string, attachments: File[]) => Promise<void>;
    onFileUpload?: (file: File) => Promise<string>;
    onMessageRead?: (messageId: string) => void;
    onTyping?: (isTyping: boolean) => void;
    
    // UI customization
    title?: string;
    subtitle?: string;
    className?: string;
    theme?: 'light' | 'dark';
    
    // Features
    enableFileUpload?: boolean;
    enableEmojiPicker?: boolean;
    enableVoiceMessages?: boolean;
    enableReadReceipts?: boolean;
    enableTypingIndicator?: boolean;
    
    // Loading states
    isSubmitting?: boolean;
    isLoading?: boolean;
    
    // Callbacks
    onBackClick?: () => void;
    onUserClick?: (user: ChatUser) => void;
}

// Message bubble component
const MessageBubble: React.FC<{
    message: ChatMessage;
    isOwnMessage: boolean;
    onFileDownload?: (attachment: FileAttachment) => void;
}> = ({ message, isOwnMessage, onFileDownload }) => {
    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return '';
        if (type.startsWith('video/')) return '';
        if (type.startsWith('audio/')) return '';
        if (type.includes('pdf')) return '';
        if (type.includes('word') || type.includes('document')) return '';
        if (type.includes('excel') || type.includes('spreadsheet')) return '';
        return '📎';
    };

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 group`}>
            <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-3 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isOwnMessage ? 'bg-primary' : 'bg-primary-light'
                    }`}>
                        {message.sender_avatar ? (
                            <img 
                                src={message.sender_avatar} 
                                alt={message.sender_name}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : isOwnMessage ? (
                            // BI Logo for sender (own messages)
                            <img 
                                src="/icons/bi-logo.svg" 
                                alt="BI Logo"
                                className="w-6 h-6 object-contain"
                            />
                        ) : (
                            // User profile icon for receiver (other messages)
                            <img 
                                src="/icons/user-profile.svg" 
                                alt="User Profile"
                                className="w-5 h-5 object-contain"
                            />
                        )}
                    </div>

                    {/* Message Content */}
                    <div className={`flex-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        {/* Sender Info */}
                        <div className={`mb-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                            <div className="flex items-center gap-2">
                                <p className={`text-sm font-medium ${isOwnMessage ? 'text-primary' : 'text-neutral-darker'}`}>
                                    {message.sender_name}
                                </p>
                                <p className="text-xs text-neutral">
                                    {formatDate(message.timestamp)}
                                </p>
                            </div>
                        </div>

                        {/* Message Bubble */}
                        <div className={`inline-block rounded-lg px-4 py-3 max-w-full ${
                            isOwnMessage 
                                ? 'bg-primary text-white' 
                                : 'bg-neutral-light text-neutral-darker'
                        }`}>
                            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                {message.message}
                            </p>

                            {/* Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {message.attachments.map((attachment) => (
                                        <div
                                            key={attachment.id}
                                            className={`flex items-center space-x-2 p-2 rounded border border-primary-border cursor-pointer hover:bg-opacity-10 ${
                                                isOwnMessage 
                                                    ? 'bg-accent-light hover:bg-white' 
                                                    : 'bg-white hover:bg-neutral-light'
                                            }`}
                                            onClick={() => onFileDownload?.(attachment)}
                                        >
                                            <span className="text-lg">{getFileIcon(attachment.type)}</span>
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

                            {/* Message Status */}
                            {isOwnMessage && message.status && (
                                <div className="mt-1 text-right">
                                    <span className="text-xs opacity-70">
                                        {message.status === 'sent' && '✓'}
                                        {message.status === 'delivered' && '✓✓'}
                                        {message.status === 'read' && '✓✓'}
                                        {message.status === 'failed' && '⚠️'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Typing indicator component
const TypingIndicator: React.FC<{ users: string[] }> = ({ users }) => {
    if (users.length === 0) return null;

    return (
        <div className="flex justify-start mb-4">
            <div className="max-w-xs">
                <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-neutral-light rounded-full flex items-center justify-center">
                        <img 
                            src="/icons/user-profile.svg" 
                            alt="User Profile"
                            className="w-5 h-5 object-contain"
                        />
                    </div>
                    <div className="bg-neutral-light rounded-lg px-4 py-3">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-neutral rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-neutral rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-neutral rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <p className="text-xs text-neutral mt-1">
                            {users.length === 1 ? `${users[0]} is typing...` : `${users.join(', ')} are typing...`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Chat Application Component
const ChatApplication: React.FC<ChatApplicationProps> = ({
    messages,
    currentUser,
    // participants,
    // onSendMessage,
    // onFileUpload,
    // onMessageRead,
    onTyping,
    // title = 'Chat',
    // subtitle,
    className = '',
    // theme = 'light',
    enableFileUpload = true,
    //  enableEmojiPicker = true,
    enableVoiceMessages = false,
    // enableReadReceipts = true,
    enableTypingIndicator = true,
    isSubmitting = false,
    isLoading = false,
    // onBackClick,
    // onUserClick,
}) => {
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [typingUsers, _setTypingUsers] = useState<string[]>([]);
    const [_isTyping, setIsTyping] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Handle typing indicator
    const handleTyping = useCallback((typing: boolean) => {
        setIsTyping(typing);
        onTyping?.(typing);
    }, [onTyping]);

    const handleMessageChange = (value: string) => {
        setMessage(value);
        handleTyping(value.length > 0);
        
        // Clear typing indicator after 2 seconds of no typing
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        if (value.length > 0) {
            typingTimeoutRef.current = setTimeout(() => {
                handleTyping(false);
            }, 2000);
        } else {
            handleTyping(false);
        }
    };

    const handleSend = async () => {
        if ((!message.trim() && attachments.length === 0) || isSubmitting) return;
        
        try {
            // await onSendMessage(message, attachments);
            setMessage('');
            setAttachments([]);
            handleTyping(false);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0) {
            setAttachments(prev => [...prev, ...files]);
        }
        // Reset input value to allow selecting the same file again
        if (event.target) {
            event.target.value = '';
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };



    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileDownload = (attachment: FileAttachment) => {
        if (attachment.url) {
            window.open(attachment.url, '_blank');
        } else if (attachment.file) {
            const url = URL.createObjectURL(attachment.file);
            const a = document.createElement('a');
            a.href = url;
            a.download = attachment.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className={`flex flex-col w-full  bg-white border border-primary-border rounded-lg  ${className}`}>
            {/* Header */}

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center py-8 text-gray-500">
                        <div>
                            <svg
                                className="w-12 h-12 mx-auto text-gray-300"
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
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                isOwnMessage={msg.sender_name === currentUser.name}
                                onFileDownload={handleFileDownload}
                            />
                        ))}
                        {enableTypingIndicator && typingUsers.length > 0 && (
                            <TypingIndicator users={typingUsers} />
                        )}
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Attachments Preview */}
            {attachments.length > 0 && (
                <div className="bg-gray-50 p-3 border-t border-primary-border">
                    <div className="flex flex-wrap gap-2">
                        {attachments.map((file, index) => (
                            <div key={index} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-primary-border">
                                <span className="text-sm text-gray-700 truncate max-w-32">{file.name}</span>
                                <button
                                    onClick={() => removeAttachment(index)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-primary-border bg-background-secondary rounded-b-lg">
                <div className="flex items-center space-x-3">
                    {/* File Upload */}
                    {enableFileUpload && (
                        <label className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={isSubmitting}
                            />
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </label>
                    )}



                    {/* Voice Message */}
                    {enableVoiceMessages && (
                        <span className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </span>
                    )}

                    {/* Message Input */}
                    <div className="flex-1 relative">
                        <textarea
                            value={message}
                            onChange={(e) => handleMessageChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message here..."
                            className="w-full px-4 py-3 bg-white border border-primary-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            rows={1}
                            disabled={isSubmitting}
                            style={{ minHeight: '44px', maxHeight: '120px' }}
                        />
                    </div>

                    {/* Send Button */}
                    <Button
                        label="Send"
                        onClick={handleSend}
                        disabled={(!message.trim() && attachments.length === 0) || isSubmitting}
                        loading={isSubmitting}
                        size="small"
                        icon={
                            !isSubmitting && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatApplication; 