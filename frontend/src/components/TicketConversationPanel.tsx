import { useState, useEffect, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageC from '@/components/global/PageC';
import type { ChatMessage, ChatUser } from './ChatApplication';

interface Ticket {
    id: number;
    ticketNumber: string;
    subject: string;
    status: string;
}

export default function TicketConversationPanel() {
    const navigate = useNavigate();
    const { ticketId } = useParams<{ ticketId: string }>();
    
    // State management
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sample chat data
    const currentUser: ChatUser = {
        id: '1',
        name: 'Support Agent',
        avatar: 'https://via.placeholder.com/40/blue',
        status: 'online',
        role: 'Support Agent',
    };

    const participants: ChatUser[] = [
        {
            id: '1',
            name: 'Support Agent',
            avatar: 'https://via.placeholder.com/40/blue',
            status: 'online',
            role: 'Support Agent',
        },
        {
            id: '2',
            name: 'Airborne General Store',
            avatar: 'https://via.placeholder.com/40',
            status: 'online',
            role: 'Customer',
        },
    ];

    // Fetch ticket data
    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const response = await fetch(`/api/tickets/${ticketId}`);
                const data = await response.json();
                
                if (data.success) {
                    setTicket(data.data);
                } else {
                    // Fallback to dummy data
                    setTicket({
                        id: 336,
                        ticketNumber: '336',
                        subject: 'Connection Issue with Meter',
                        status: 'Open'
                    });
                }
            } catch (error) {
                console.error('Failed to fetch ticket data:', error);
                // Fallback to dummy data
                setTicket({
                    id: 336,
                    ticketNumber: '336',
                    subject: 'Connection Issue with Meter',
                    status: 'Open'
                });
            } finally {
                setLoading(false);
            }
        };

        if (ticketId) {
            fetchTicketData();
        }
    }, [ticketId]);

    // Initialize empty messages
    useEffect(() => {
        if (ticket) {
            setMessages([]);
        }
    }, [ticket]);

    const handleSendMessage = async (message: string, attachments: File[]) => {
        setIsSubmitting(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const newMessage: ChatMessage = {
                id: Date.now().toString(),
                sender_type: 'admin',
                sender_name: currentUser.name,
                sender_avatar: currentUser.avatar,
                message,
                timestamp: new Date().toISOString(),
                status: 'sent',
                attachments: attachments.map((file, index) => ({
                    id: `attachment-${Date.now()}-${index}`,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    file,
                })),
            };

            setMessages(prev => [...prev, newMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileUpload = async (file: File): Promise<string> => {
        // Simulate file upload
        await new Promise(resolve => setTimeout(resolve, 2000));
        return `https://example.com/uploads/${file.name}`;
    };

    const handleMessageRead = (messageId: string) => {
        setMessages(prev =>
            prev.map(msg =>
                msg.id === messageId ? { ...msg, status: 'read' as const } : msg
            )
        );
    };

    const handleTyping = (isTyping: boolean) => {
        console.log('Agent is typing:', isTyping);
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleUserClick = (user: ChatUser) => {
        console.log('User clicked:', user.name);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PageC
                sections={[
                    // Page Header Section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                        },
                        components: [
                            {
                                name: 'SummaryInfo',
                                props: {
                                    title: `Issue Details`,
                                    className:'bg-background-secondary',
                                    titleClassName: 'text-xl',
                                    data: {
                                        leftColumn: [],
                                        rightColumn: [],
                                    },
                                    rightStatus: {
                                        text: "Open",
                                        variant: "default",
                                    }
                                },
                            },
                        ],
                    },
                    // Chat Application Section
                    {
                        layout: {
                            type: 'row',
                            className: 'w-full h-full',
                        },
                        components: [
                            {
                                name: 'ChatApplication',
                                props: {
                                    messages,
                                    currentUser,
                                    participants,
                                    onSendMessage: handleSendMessage,
                                    onFileUpload: handleFileUpload,
                                    onMessageRead: handleMessageRead,
                                    onTyping: handleTyping,
                                    title: `Ticket #${ticket?.ticketNumber}`,
                                    subtitle: ticket?.subject,
                                    enableFileUpload: true,
                                    enableEmojiPicker: true,
                                    enableVoiceMessages: false,
                                    enableReadReceipts: true,
                                    enableTypingIndicator: true,
                                    isSubmitting,
                                    onBackClick: handleBackClick,
                                    onUserClick: handleUserClick,
                                },
                            },
                        ],
                    },
                ]}
            />
        </Suspense>
    );
} 