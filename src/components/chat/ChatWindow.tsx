import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ArrowLeft, Send, Phone, Video, Loader2, Image as ImageIcon, Mic, Smile, MoreVertical, ThumbsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
    id: string;
    text?: string;
    content?: string; // URL for image/audio/sticker
    type: 'text' | 'image' | 'audio' | 'sticker';
    isMe: boolean;
    time: string;
}

interface ChatWindowProps {
    conversation: {
        id: number;
        user: { name: string; avatar: string; role: string; online: boolean };
    } | null;
    onBack?: () => void;
}

// Mock initial messages for demonstration
const MOCK_MESSAGES_DATA: Record<number, Message[]> = {
    1: [
        { id: '1', text: "Hi! I saw your application for the React Developer role.", type: 'text', isMe: false, time: "10:00 AM" },
        { id: '2', text: "Hello Sarah! Thanks for reaching out. Yes, I'm very interested.", type: 'text', isMe: true, time: "10:05 AM" },
        { id: '3', text: "Great! Your portfolio looks impressive. Especially the e-commerce project.", type: 'text', isMe: false, time: "10:15 AM" },
        { id: '4', content: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", type: 'image', isMe: false, time: "10:16 AM" },
        { id: '5', text: "When are you available for a quick call?", type: 'text', isMe: false, time: "10:30 AM" },
    ],
    2: [
        { id: '1', text: "Thanks for applying! We will review your profile.", type: 'text', isMe: false, time: "Yesterday" },
    ],
    3: [
        { id: '1', text: "Your application status has been updated.", type: 'text', isMe: false, time: "2d ago" },
    ]
};

const STICKERS = ["👍", "👋", "❤️", "😂", "😮", "😢", "🎉", "🔥"];

export default function ChatWindow({ conversation, onBack }: ChatWindowProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [showStickers, setShowStickers] = useState(false);

    useEffect(() => {
        if (conversation) {
            setLoading(true);
            setTimeout(() => {
                setMessages(MOCK_MESSAGES_DATA[conversation.id] || []);
                setLoading(false);
            }, 600);
        }
    }, [conversation]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isRecording]);

    const handleSend = async (type: 'text' | 'image' | 'audio' | 'sticker' = 'text', content: string = input) => {
        if (!content.trim() && type === 'text') return;
        if (!conversation) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: type === 'text' ? content : undefined,
            content: type !== 'text' ? content : undefined,
            type: type,
            isMe: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        if (type === 'text') setInput("");
        setShowStickers(false);

        // Echo response
        setTimeout(() => {
            if (Math.random() > 0.7) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString() + '_echo',
                    text: "Sounds good!",
                    type: 'text',
                    isMe: false,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }
        }, 2000);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create object URL for preview
            const imageUrl = URL.createObjectURL(file);
            handleSend('image', imageUrl);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            // Stop recording and send mock audio
            setIsRecording(false);
            handleSend('audio', 'mock-audio-url');
        } else {
            setIsRecording(true);
        }
    };

    if (!conversation) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white">
                <div className="h-24 w-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <MessageCircleIcon className="h-10 w-10 text-primary-200" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your Messages</h3>
                <p className="max-w-xs text-center text-sm text-gray-500">Select a chat from the sidebar to start messaging or finding new jobs.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center shadow-sm z-20 bg-white/90 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden -ml-2 text-primary-600">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    )}
                    <div className="relative group cursor-pointer">
                        <div className="h-10 w-10 rounded-full overflow-hidden relative ring-2 ring-gray-100">
                            <img src={conversation.user.avatar} alt={conversation.user.name} className="h-full w-full object-cover" />
                        </div>
                        {conversation.user.online && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-[15px] leading-tight cursor-pointer hover:underline">{conversation.user.name}</h3>
                        <p className="text-xs text-gray-500 font-medium">{conversation.user.online ? 'Active now' : conversation.user.role}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Phone className="h-6 w-6 text-primary-600 cursor-pointer hover:text-primary-700 transition-colors" />
                    <Video className="h-6 w-6 text-primary-600 cursor-pointer hover:text-primary-700 transition-colors" />
                    <MoreVertical className="h-6 w-6 text-primary-600 cursor-pointer hover:text-primary-700 transition-colors" />
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white scrollbar-thin scrollbar-thumb-gray-200">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                        <img src={conversation.user.avatar} className="h-20 w-20 rounded-full mb-2" />
                        <div>
                            <p className="text-lg font-medium text-gray-900">{conversation.user.name}</p>
                            <p className="text-sm text-gray-500">You're friends on Thozhilurappu</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, idx) => {
                            const isSequence = idx > 0 && messages[idx - 1].isMe === msg.isMe;
                            return (
                                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} group mb-1`}>
                                    {!msg.isMe && !isSequence && (
                                        <img src={conversation.user.avatar} className="h-7 w-7 rounded-full mr-2 self-end mb-1" />
                                    )}
                                    {!msg.isMe && isSequence && <div className="w-9" />} {/* Spacer for avatar alignment */}

                                    <div className={`max-w-[70%] ${msg.type === 'text' ? `px-4 py-2 text-[15px]` : 'p-0 overflow-hidden'} rounded-[20px] shadow-sm relative transition-all duration-200 
                                        ${msg.isMe
                                            ? 'bg-primary-600 text-white rounded-br-sm'
                                            : 'bg-gray-100 text-gray-900 rounded-bl-sm'}
                                        ${msg.type === 'sticker' ? 'bg-transparent shadow-none !p-0 !text-4xl' : ''}
                                    `}>
                                        {msg.type === 'text' && <p>{msg.text}</p>}

                                        {msg.type === 'image' && (
                                            <div className="relative group cursor-pointer">
                                                <img src={msg.content} alt="Attachment" className="max-w-full h-auto rounded-lg" />
                                            </div>
                                        )}

                                        {msg.type === 'audio' && (
                                            <div className={`flex items-center gap-2 p-2 min-w-[150px] ${msg.isMe ? 'text-primary-100' : 'text-gray-600'}`}>
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${msg.isMe ? 'bg-white/20' : 'bg-gray-200'}`}>
                                                    <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-current border-b-4 border-b-transparent ml-1"></div>
                                                </div>
                                                <div className="flex-1 h-1 bg-current/20 rounded-full overflow-hidden">
                                                    <div className="h-full w-1/3 bg-current rounded-full"></div>
                                                </div>
                                                <span className="text-xs">0:12</span>
                                            </div>
                                        )}

                                        {msg.type === 'sticker' && (
                                            <div className="text-6xl animate-bounce-in">
                                                {msg.content}
                                            </div>
                                        )}
                                    </div>

                                    {/* Timestamp tooltips could go here */}
                                </div>
                            );
                        })}
                        {isRecording && (
                            <div className="flex justify-end mt-2">
                                <div className="bg-primary-600 text-white px-4 py-2 rounded-2xl rounded-br-none animate-pulse flex items-center gap-2">
                                    <Mic className="h-4 w-4 animate-pulse" />
                                    <span className="text-sm">Recording...</span>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100 sticky bottom-0 z-30">
                {showStickers && (
                    <div className="absolute bottom-full left-4 mb-2 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 grid grid-cols-4 gap-4 animate-in slide-in-from-bottom-2">
                        {STICKERS.map(sticker => (
                            <button
                                key={sticker}
                                onClick={() => handleSend('sticker', sticker)}
                                className="text-3xl hover:scale-125 transition-transform"
                            >
                                {sticker}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex items-end gap-2 max-w-4xl mx-auto">
                    <div className="flex gap-1 mb-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-primary-600 hover:bg-primary-50"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <ImageIcon className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-primary-600 hover:bg-primary-50"
                            onClick={() => setShowStickers(!showStickers)}
                        >
                            <Smile className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-full hover:bg-primary-50 transition-all ${isRecording ? 'bg-red-50 text-red-600 animate-pulse' : 'text-primary-600'}`}
                            onClick={toggleRecording}
                        >
                            <Mic className="h-6 w-6" />
                        </Button>
                    </div>

                    <div className="flex-1 relative bg-gray-100 rounded-2xl flex items-center">
                        <Input
                            placeholder="Aa"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            className="bg-transparent border-none focus:ring-0 shadow-none py-3 px-4 text-[15px] placeholder-gray-500 w-full"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mr-1 text-gray-400 hover:text-gray-600"
                        >
                            <Smile className="h-5 w-5" />
                        </Button>
                    </div>

                    {input.trim() ? (
                        <Button
                            size="icon"
                            onClick={() => handleSend()}
                            className="rounded-full bg-primary-600 hover:bg-primary-700 text-white h-10 w-10 mb-1 shadow-md transition-transform active:scale-95"
                        >
                            <Send className="h-5 w-5 ml-0.5" />
                        </Button>
                    ) : (
                        <Button
                            size="icon"
                            onClick={() => handleSend('sticker', '👍')}
                            className="rounded-full bg-transparent text-primary-600 hover:bg-blue-50 h-10 w-10 mb-1"
                        >
                            <ThumbsUp className="h-6 w-6" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Icon helper
function MessageCircleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
    )
}
