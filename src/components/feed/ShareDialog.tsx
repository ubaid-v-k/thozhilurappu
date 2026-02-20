import { useState, useRef } from 'react';
import { X, Globe, Smile, MessageCircle, Link, Users, User, BookOpen, Smartphone } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

interface ShareDialogProps {
    isOpen: boolean;
    onClose: () => void;
    post: any;
}

const MOCK_FRIENDS = [
    { name: "John Doe", avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random" },
    { name: "Jane Smith", avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=random" },
    { name: "Michael Check", avatar: "https://ui-avatars.com/api/?name=Michael+Ch&background=random" },
    { name: "Emily White", avatar: "https://ui-avatars.com/api/?name=Emily+W&background=random" },
    { name: "Chris Green", avatar: "https://ui-avatars.com/api/?name=Chris+G&background=random" },
    { name: "Sarah Black", avatar: "https://ui-avatars.com/api/?name=Sarah+B&background=random" },
];

export function ShareDialog({ isOpen, onClose }: ShareDialogProps) {
    const { user } = useAuth();
    const [text, setText] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const emojiRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(emojiRef, () => setShowEmoji(false));

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setText(prev => prev + emojiData.emoji);
        // Don't close picker to allow multiple emojis
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 relative">
                    <h2 className="text-xl font-bold text-center w-full">Share</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 rounded-full h-9 w-9"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5 text-gray-600" />
                    </Button>
                </div>

                <div className="overflow-y-auto custom-scrollbar relative">
                    {/* Input Section */}
                    <div className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                                <img
                                    src={user?.avatar || "https://ui-avatars.com/api/?background=random"}
                                    alt={user?.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 leading-snug">{user?.name || "User"}</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1">
                                        Feed
                                    </span>
                                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1">
                                        <Globe className="h-3 w-3" /> Public
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="relative mb-4">
                            <textarea
                                placeholder="Say something about this..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full text-lg placeholder:text-gray-400 border-none focus:ring-0 resize-none min-h-[80px]"
                            />
                            <div className="absolute right-0 bottom-2" ref={emojiRef}>
                                <button
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                    onClick={() => setShowEmoji(!showEmoji)}
                                >
                                    <Smile className="h-6 w-6" />
                                </button>
                                {showEmoji && (
                                    <div className="absolute right-0 bottom-10 z-50 shadow-xl border border-gray-100 rounded-xl">
                                        <EmojiPicker
                                            onEmojiClick={onEmojiClick}
                                            lazyLoadEmojis={true}
                                            searchDisabled={false}
                                            skinTonesDisabled
                                            height={350}
                                            width={300}
                                            previewConfig={{ showPreview: false }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-8 w-full sm:w-auto">
                                Share now
                            </Button>
                        </div>
                    </div>

                    <div className="h-2 bg-gray-50 border-t border-b border-gray-100"></div>

                    {/* Send in Messenger */}
                    <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-4">Send in Messenger</h4>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                            {MOCK_FRIENDS.map((friend, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer group">
                                    <div className="h-14 w-14 rounded-full overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform duration-200">
                                        <img src={friend.avatar} alt={friend.name} className="h-full w-full object-cover" />
                                    </div>
                                    <span className="text-xs text-center text-gray-600 leading-tight line-clamp-2 w-full">
                                        {friend.name.split(' ')[0]}<br />{friend.name.split(' ')[1]}
                                    </span>
                                    <Button size="sm" variant="outline" className="h-7 text-xs px-3 rounded-full mt-1 border-gray-200">
                                        Send
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-2 bg-gray-50 border-t border-b border-gray-100"></div>

                    {/* Share to */}
                    <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-4">Share to</h4>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                            <ShareOption icon={<MessageCircle className="h-6 w-6" />} label="Messenger" />
                            <ShareOption icon={<Smartphone className="h-6 w-6" />} label="WhatsApp" />
                            <ShareOption icon={<BookOpen className="h-6 w-6" />} label="Your story" />
                            <ShareOption icon={<Link className="h-6 w-6" />} label="Copy link" />
                            <ShareOption icon={<Users className="h-6 w-6" />} label="Group" />
                            <ShareOption icon={<User className="h-6 w-6" />} label="Friend's profile" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ShareOption({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer group">
            <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 group-hover:bg-gray-200 transition-colors">
                {icon}
            </div>
            <span className="text-xs text-center text-gray-600 leading-tight max-w-[80px]">{label}</span>
        </div>
    );
}
