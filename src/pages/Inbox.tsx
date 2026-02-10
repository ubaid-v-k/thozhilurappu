import { useState } from "react";
import { Search } from "lucide-react";
import ChatWindow from "../components/chat/ChatWindow";

const MOCK_CONVERSATIONS = [
    {
        id: 1,
        user: { name: "Sarah Jenkins", avatar: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0D9488&color=fff", role: "HR @ TechFlow", online: true },
        lastMessage: "When are you available for a quick call?",
        time: "10:30 AM",
        unread: 2
    },
    {
        id: 2,
        user: { name: "David Chen", avatar: "https://ui-avatars.com/api/?name=David+Chen&background=4F46E5&color=fff", role: "Recruiter", online: false },
        lastMessage: "Thanks for applying! We will review your profile.",
        time: "Yesterday",
        unread: 0
    },
    {
        id: 3,
        user: { name: "TechCorp Hiring", avatar: "https://ui-avatars.com/api/?name=TechCorp&background=random", role: "Company", online: false },
        lastMessage: "Your application status has been updated.",
        time: "2d ago",
        unread: 0
    }
];

export default function Inbox() {
    const [selectedChat, setSelectedChat] = useState<number | null>(null);

    const activeChat = MOCK_CONVERSATIONS.find(c => c.id === selectedChat) || null;

    return (
        <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-4rem)] flex bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm m-4 md:m-0">
            {/* Sidebar / Chat List */}
            <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col bg-white ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Chats</h1>
                        <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                            <Search className="h-4 w-4 text-gray-600" />
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Messenger"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all text-gray-700 placeholder-gray-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-2">
                    {MOCK_CONVERSATIONS.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={`p-3 flex gap-3 cursor-pointer rounded-xl transition-all duration-200 group ${selectedChat === chat.id ? 'bg-blue-50' : 'hover:bg-gray-100/80'}`}
                        >
                            <div className="relative flex-shrink-0">
                                <img src={chat.user.avatar} alt={chat.user.name} className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm" />
                                {chat.user.online && <div className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full"></div>}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex justify-between items-center mb-0.5">
                                    <h3 className={`font-semibold text-[15px] truncate ${chat.unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>{chat.user.name}</h3>
                                    <span className={`text-xs whitespace-nowrap ml-2 ${chat.unread > 0 ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>{chat.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className={`text-[13px] truncate pr-2 ${chat.unread > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                                        {chat.lastMessage}
                                    </p>
                                    {chat.unread > 0 && (
                                        <div className="h-4 w-4 bg-primary-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0 shadow-sm shadow-primary-200">
                                            {chat.unread}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                <ChatWindow
                    conversation={activeChat}
                    onBack={() => setSelectedChat(null)}
                />
            </div>
        </div>
    );
}
