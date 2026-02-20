
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { SearchBar } from "../components/ui/SearchBar";
import { CreatePost } from "../components/feed/CreatePost";
import { PostCard } from "../components/feed/PostCard";
import { Briefcase, Wrench, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils/cn";
import { useSearchParams } from "react-router-dom";
import type { JobPost, ServicePost, PostType } from "../types";
import { usePosts } from "../context/PostsContext";

export default function JobListing() {
    const [searchParams, setSearchParams] = useSearchParams();
    const typeFilter = searchParams.get("type");
    const searchQuery = searchParams.get("search");
    const [activeTab, setActiveTab] = useState<PostType | 'ALL'>('ALL');
    const [showFilters, setShowFilters] = useState(false);

    const { posts: allPostsRaw, getPostsByType } = usePosts();
    // If 'ALL' (or 'NORMAL' treated as all), get all posts. Otherwise filter.
    // Actually getPostsByType('NORMAL') currently returns only Normal posts. 
    // We want the default view to show EVERYTHING.
    // Let's modify logic to use 'allPostsRaw' if 'ALL'.
    const displayedPosts = activeTab === 'ALL' ? allPostsRaw : getPostsByType(activeTab as PostType);

    const posts = displayedPosts.filter(post => {
        // Filter by text search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchesTitle = post.title.toLowerCase().includes(q);
            const matchesLocation = post.location.toLowerCase().includes(q);
            // Check specific fields if they exist
            const matchesCompany = 'company' in post && (post as JobPost).company.toLowerCase().includes(q);
            const matchesCategory = 'category' in post && (post as ServicePost).category.toLowerCase().includes(q);
            const matchesUser = post.user?.name.toLowerCase().includes(q);
            const matchesGroup = post.group?.name.toLowerCase().includes(q);

            if (!matchesTitle && !matchesLocation && !matchesCompany && !matchesCategory && !matchesUser && !matchesGroup) {
                return false;
            }
        }

        // Filter by location search
        const locationQuery = searchParams.get("location");
        if (locationQuery) {
            if (!post.location.toLowerCase().includes(locationQuery.toLowerCase())) {
                return false;
            }
        }

        return true;
    });

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
                <div className="flex-1 min-w-0 w-full">
                    {/* Search Bar */}
                    <div className="sticky top-0 md:top-20 z-30 mb-6 bg-gray-50/80 backdrop-blur-md pb-2 pt-1 -mx-4 px-4 md:mx-0 md:px-0 md:bg-transparent md:backdrop-blur-none">
                        <SearchBar
                            className="shadow-sm border-gray-200"
                            placeholder="Search jobs, services, or people..."
                            initialQuery={searchQuery || ""}
                            showLocation={false}
                            onSearch={(query, location) => {
                                setSearchParams(prev => {
                                    const newParams = new URLSearchParams(prev);
                                    if (query) newParams.set('search', query); else newParams.delete('search');
                                    if (location) newParams.set('location', location); else newParams.delete('location');
                                    return newParams;
                                });
                            }}
                            onFilterClick={() => setShowFilters(true)}
                        />
                    </div>

                    {/* Quick Post Composer (Hidden on mobile, maybe? Or keep it) */}
                    <div className="mb-8">
                        <CreatePost onSubmit={async (data) => {
                            // Mock submit
                            console.log("New Post:", data);
                            // In real app, call API
                            alert("Post created!");
                        }} />
                    </div>

                    {/* Feed Tabs */}
                    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setActiveTab('ALL')}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                                activeTab === 'ALL' ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            )}
                        >
                            All Posts
                        </button>
                        <button
                            onClick={() => setActiveTab('JOB')}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                                activeTab === 'JOB' ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            )}
                        >
                            Jobs
                        </button>
                        <button
                            onClick={() => setActiveTab('SERVICE')}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                                activeTab === 'SERVICE' ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            )}
                        >
                            Services
                        </button>
                    </div>

                    {/* Results Grid */}
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
