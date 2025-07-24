import React from 'react';

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

interface ChatInputProps {
    chatMessage: string;
    setChatMessage: (message: string) => void;
    handleSendMessage: () => void;
    isSubmittingResponse: boolean;
    conversation?: ChatMessage[];
    className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
    chatMessage, 
    setChatMessage, 
    handleSendMessage, 
    isSubmittingResponse,
    conversation = [],
    className = ''
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

    return (
        <div className={`bg-white rounded-lg shadow h-96 flex flex-col ${className}`}>
            {/* Chat Messages Area */}
            <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
                <div className="flex justify-start">
                    <div className="bg-white rounded-lg p-4 max-w-xs shadow-sm">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-neutral-darker">Airborne General Store</p>
                                <p className="text-xs text-neutral">07/14/2025, 05:24 PM</p>
                            </div>
                        </div>
                        <p className="text-sm text-neutral">test the ticket</p>
                    </div>
                </div>
            </div>

            {/* Message Input Bar */}
            <div className="bg-accent rounded-b-lg p-4">
                <div className="flex items-center space-x-3">
                    {/* Attachment Icon */}
                    <button className="p-2 text-white hover:bg-accent-light rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>
                    
                    {/* Text Input */}
                    <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-1 px-4 py-3 bg-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-neutral-darker placeholder-neutral"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        disabled={isSubmittingResponse}
                    />
                    
                    {/* Send Button */}
                    <button
                        onClick={handleSendMessage}
                        disabled={!chatMessage.trim() || isSubmittingResponse}
                        className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInput; 