import React, { useState } from "react";
import { Search, MapPin, Filter, ArrowRight } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "./Button";

interface SearchBarProps {
    onSearch: (query: string, location: string) => void;
    onFilterClick?: () => void;
    placeholder?: string;
    initialQuery?: string;
    initialLocation?: string;
    showLocation?: boolean;
    className?: string;
    rightSection?: React.ReactNode;
}

export function SearchBar({
    onSearch,
    onFilterClick,
    placeholder = "Search...",
    initialQuery = "",
    initialLocation = "",
    showLocation = true,
    className,
    rightSection,
}: SearchBarProps) {
    const [query, setQuery] = useState(initialQuery);
    const [location, setLocation] = useState(initialLocation);
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = () => {
        onSearch(query, location);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div
            className={cn(
                "relative flex gap-2 p-1.5 bg-white rounded-full border border-gray-200 shadow-sm transition-all duration-300 items-center",
                showLocation ? "flex-col md:flex-row" : "flex-row",
                isFocused ? "shadow-md ring-2 ring-primary-50 border-primary-200" : "hover:shadow-md",
                className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
                // Check if the new focus target is still within the component
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    setIsFocused(false);
                }
            }}
        >
            {/* Search Input */}
            <div className="flex-1 relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300">
                    <Search className="h-4 w-4" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full h-10 pl-10 pr-4 bg-transparent border-0 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:bg-gray-50/50 transition-all duration-200"
                />
            </div>

            {/* Separator (Desktop) */}
            {showLocation && (
                <div className="hidden md:block w-px h-6 my-auto bg-gray-200" />
            )}

            {/* Location Input */}
            {showLocation && (
                <div className="w-full md:w-1/3 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary-500 transition-colors duration-300">
                        <MapPin className="h-4 w-4" />
                    </div>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Location"
                        className="w-full h-10 pl-10 pr-4 bg-transparent border-0 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:bg-gray-50/50 transition-all duration-200"
                    />
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-1">
                {rightSection}

                {onFilterClick && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden h-10 w-10 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                        onClick={onFilterClick}
                    >
                        <Filter className="h-4 w-4" />
                    </Button>
                )}

                <Button
                    onClick={handleSearch}
                    className="h-10 px-5 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                >
                    <span className="hidden md:inline text-sm font-medium">Search</span>
                    <ArrowRight className="md:hidden h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
