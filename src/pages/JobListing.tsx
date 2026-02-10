
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Search, MapPin, Filter, X, Briefcase, Wrench, Clock, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils/cn";
import { useSearchParams } from "react-router-dom";
import type { JobPost, ServicePost, PostType } from "../types";
import { usePosts } from "../context/PostsContext";

export default function JobListing() {
    const [searchParams] = useSearchParams();
    const typeFilter = searchParams.get("type");
    const searchQuery = searchParams.get("search");
    const [activeTab, setActiveTab] = useState<PostType>('JOB');
    const [showFilters, setShowFilters] = useState(false);

    const { getPostsByType } = usePosts();
    const posts = getPostsByType(activeTab);

    return (
        <div className="pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

            {/* Unified Feed Toggle */}
            <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-1 rounded-full inline-flex relative">
                    <button
                        onClick={() => setActiveTab('JOB')}
                        className={cn(
                            "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 relative z-10",
                            activeTab === 'JOB' ? "bg-white text-primary-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <Briefcase className="h-4 w-4" /> Find Jobs
                    </button>
                    <button
                        onClick={() => setActiveTab('SERVICE')}
                        className={cn(
                            "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 relative z-10",
                            activeTab === 'SERVICE' ? "bg-white text-secondary-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <Wrench className="h-4 w-4" /> Hire Workers
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className={cn("w-full lg:w-72 flex-shrink-0 bg-white lg:bg-transparent transition-all duration-300", showFilters ? "fixed inset-0 z-50 p-4 overflow-y-auto" : "hidden lg:block")}>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm sticky top-24 h-full lg:h-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Filters</h3>
                            <div className="flex items-center gap-2">
                                <Button variant="link" size="sm" className="h-auto p-0 text-gray-500">Clear</Button>
                                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setShowFilters(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">{activeTab === 'JOB' ? 'Job Type' : 'Service Category'}</h4>
                                <div className="space-y-2.5">
                                    {(activeTab === 'JOB'
                                        ? ['Full-time', 'Part-time', 'Freelance', 'Remote', 'Contract', 'Daily Wage']
                                        : ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'Photography']
                                    ).map(t => (
                                        <label key={t} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                                                defaultChecked={typeFilter === t}
                                            />
                                            {t}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">{activeTab === 'JOB' ? 'Salary Range' : 'Rate Range'}</h4>
                                <div className="flex items-center gap-2">
                                    <Input type="number" placeholder="Min" className="h-9 text-sm" />
                                    <span className="text-gray-400">-</span>
                                    <Input type="number" placeholder="Max" className="h-9 text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Feed */}
                <div className="flex-1 min-w-0">
                    {/* Search Bar */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-3 sticky top-20 z-30">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                className="pl-11 border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all h-11"
                                placeholder={activeTab === 'JOB' ? "Search by title, skill, or company..." : "Search services like 'plumber', 'driver'..."}
                                defaultValue={searchQuery || ""}
                            />
                        </div>
                        <div className="w-full md:w-1/3 relative">
                            <MapPin className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
                            <Input className="pl-11 border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all h-11" placeholder="Location" />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="lg:hidden h-11 w-11" onClick={() => setShowFilters(true)}>
                                <Filter className="h-5 w-5" />
                            </Button>
                            <Button className="h-11 px-6 shadow-md shadow-primary-200">Search</Button>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="grid gap-5">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
                                <div className="flex gap-5 items-start">
                                    {/* Thumbnail or Icon */}
                                    <div className="flex-shrink-0">
                                        {post.images && post.images.length > 0 ? (
                                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden relative bg-gray-100 border border-gray-100">
                                                <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                        ) : (
                                            <div className={cn(
                                                "w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shadow-inner",
                                                activeTab === 'JOB' ? "bg-blue-50 text-blue-600" : "bg-teal-50 text-teal-600"
                                            )}>
                                                {post.title.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors mb-1">
                                                    {post.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-2">
                                                    {activeTab === 'JOB' ? (
                                                        <span className="font-medium text-gray-700">{(post as JobPost).company}</span>
                                                    ) : (
                                                        <span className="font-medium text-teal-700">{(post as ServicePost).category}</span>
                                                    )}
                                                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {post.location}</span>
                                                </div>
                                            </div>
                                            {post.verified && (
                                                <Badge variant="verified" className="flex-shrink-0">Verified</Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 mt-1">
                                            <Badge variant={activeTab === 'JOB' ? 'secondary' : 'default'} className={activeTab === 'SERVICE' ? "bg-teal-100 text-teal-800 hover:bg-teal-200" : ""}>
                                                {activeTab === 'JOB' ? (post as JobPost).jobType : (post as ServicePost).rate}
                                            </Badge>
                                            {activeTab === 'JOB' && (
                                                <Badge variant="outline">{(post as JobPost).salary}</Badge>
                                            )}
                                        </div>

                                        {post.description && (
                                            <p className="text-sm text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                                                {post.description}
                                            </p>
                                        )}

                                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 font-medium">
                                            <div className="flex items-center gap-4">
                                                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Posted {post.postedAt}</span>
                                                {post.images && post.images.length > 0 && (
                                                    <span className="flex items-center gap-1 text-gray-500"><ImageIcon className="h-3.5 w-3.5" /> {post.images.length} Image(s)</span>
                                                )}
                                            </div>
                                            <Button size="sm" variant={activeTab === 'JOB' ? 'default' : 'secondary'} className={activeTab === 'SERVICE' ? "bg-teal-600 hover:bg-teal-700 text-white" : ""}>
                                                {activeTab === 'JOB' ? 'Apply Now' : 'Book Service'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
