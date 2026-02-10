import { useState } from "react";
import { Bell, Briefcase, MessageSquare, CheckCircle, Clock } from "lucide-react";
import { Button } from "../components/ui/Button";

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        type: 'job_alert',
        title: "New Job Alert: React Developer",
        message: "3 new jobs match your preferences for 'React Developer' in Chennai.",
        time: "2h ago",
        read: false,
        icon: Briefcase,
        color: "bg-blue-100 text-blue-600"
    },
    {
        id: 2,
        type: 'message',
        title: "New Message from Sarah Jenkins",
        message: "Hey, I saw your profile and would like to carry out a short interview...",
        time: "5h ago",
        read: true,
        icon: MessageSquare,
        color: "bg-purple-100 text-purple-600"
    },
    {
        id: 3,
        type: 'application',
        title: "Application Viewed",
        message: "TechCorp Inc. viewed your application for Senior React Developer.",
        time: "1d ago",
        read: true,
        icon: CheckCircle,
        color: "bg-green-100 text-green-600"
    },
    {
        id: 4,
        type: 'system',
        title: "Profile Incomplete",
        message: "Complete your profile to increase your chances of getting hired.",
        time: "2d ago",
        read: true,
        icon: Clock,
        color: "bg-orange-100 text-orange-600"
    }
];

export default function Notifications() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    return (
        <div className="max-w-2xl mx-auto pb-20 p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>Mark all as read</Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setNotifications([])}>Clear all</Button>
                </div>
            </div>

            <div className="space-y-3">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`flex gap-4 p-4 rounded-xl border transition-all cursor-pointer ${notification.read ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-100'}`}
                        onClick={() => markAsRead(notification.id)}
                    >
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.color}`}>
                            <notification.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className={`text-sm font-semibold ${notification.read ? 'text-gray-900' : 'text-blue-900'}`}>{notification.title}</h3>
                                <span className="text-xs text-gray-500">{notification.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{notification.message}</p>
                        </div>
                        {!notification.read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                    </div>
                ))}
            </div>

            {notifications.length === 0 && (
                <div className="text-center py-10">
                    <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-gray-900 font-medium">No notifications yet</h3>
                    <p className="text-gray-500 text-sm mt-1">We'll notify you when something important happens.</p>
                </div>
            )}
        </div>
    );
}
