import { Search } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Topbar() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">

                    {/* Mobile Menu Trigger & Logo Area (Visible on Mobile) */}
                    <div className="flex items-center gap-2 md:hidden">
                        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">Thozhilurappu</span>
                    </div>

                    {/* Search Bar - Central */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-lg relative hidden md:block">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search jobs, companies, or skills..."
                            className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    {/* Quick Page Switches & Actions */}
                    <div className="flex items-center gap-2 md:gap-6">
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                            <Link to="/jobs?type=Remote" className="hover:text-primary-600 transition-colors">Remote</Link>
                            <Link to="/jobs?type=Part-time" className="hover:text-primary-600 transition-colors">Part-time</Link>
                            <Link to="/about" className="hover:text-primary-600 transition-colors">About Us</Link>
                            <Link to="/contact" className="hover:text-primary-600 transition-colors">Contact</Link>
                        </nav>

                        {/* Mobile: Search Icon Toggle could go here if needed, but for now kept simple */}
                        <div className="flex md:hidden">
                            <Button variant="ghost" size="icon">
                                <Search className="h-5 w-5 text-gray-600" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Sub-header for Categories (Optional, if requested 'switch pages on top bar') */}
                <div className="md:hidden py-2 flex gap-3 overflow-x-auto scrollbar-hide border-t border-gray-50">
                    <Link to="/jobs?type=Remote" className="px-3 py-1 bg-gray-50 rounded-full text-xs font-medium text-gray-600 whitespace-nowrap">Remote</Link>
                    <Link to="/jobs?type=Part-time" className="px-3 py-1 bg-gray-50 rounded-full text-xs font-medium text-gray-600 whitespace-nowrap">Part-time</Link>
                    <Link to="/about" className="px-3 py-1 bg-gray-50 rounded-full text-xs font-medium text-gray-600 whitespace-nowrap">About</Link>
                    <Link to="/contact" className="px-3 py-1 bg-gray-50 rounded-full text-xs font-medium text-gray-600 whitespace-nowrap">Contact</Link>
                </div>
            </div>
        </header>
    );
}
