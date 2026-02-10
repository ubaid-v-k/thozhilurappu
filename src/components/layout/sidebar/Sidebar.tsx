import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Briefcase,
    Home,
    Compass,
    MessageSquare,
    Bell,
    User,
    PlusCircle,
    Clock,
    Globe,
    Zap,
} from "lucide-react";
import { cn } from "../../../utils/cn";
import { Button } from "../../ui/Button";
import { useAuth } from "../../../context/AuthContext";

const NAV_ITEMS = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Zap, label: "Urgent Openings", path: "/jobs/urgent" },
    { icon: Briefcase, label: "Full-Time Jobs", path: "/jobs/full-time" },
    { icon: Clock, label: "Part-Time Jobs", path: "/jobs/part-time" },
    { icon: Globe, label: "Remote Jobs", path: "/jobs/remote" },
    { icon: Compass, label: "Explore All", path: "/jobs" },
];

const AUTH_ITEMS = [
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: User, label: "Profile", path: "/profile" },
];

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, openAuthModal } = useAuth();

    const handlePostJob = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            openAuthModal();
            return;
        }
        navigate("/post-job");
    };

    const handleAuthItemClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            openAuthModal();
        }
    };

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-gray-100 p-4 shadow-soft-xl z-40">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 mb-8 px-2 group">
                <div className="bg-primary-600 p-2 rounded-lg text-white group-hover:bg-primary-700 transition-colors">
                    <Briefcase className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                    Thozhilurappu
                </span>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
                {/* Discover */}
                <div className="mb-6">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Discover
                    </p>

                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group",
                                    isActive
                                        ? "bg-primary-50 text-primary-700 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "h-5 w-5 transition-colors",
                                        isActive
                                            ? "text-primary-600"
                                            : "text-gray-400 group-hover:text-gray-600"
                                    )}
                                />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Personal */}
                <div>
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Personal
                    </p>

                    {AUTH_ITEMS.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={handleAuthItemClick}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group",
                                    isActive
                                        ? "bg-primary-50 text-primary-700 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "h-5 w-5 transition-colors",
                                        isActive
                                            ? "text-primary-600"
                                            : "text-gray-400 group-hover:text-gray-600"
                                    )}
                                />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Post Job */}
            <div className="pt-4 mt-4 border-t border-gray-100">
                <Button
                    onClick={handlePostJob}
                    className="w-full justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <PlusCircle className="h-5 w-5" />
                    Post a Job
                </Button>
            </div>
        </aside>
    );
}
