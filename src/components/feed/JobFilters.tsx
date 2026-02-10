import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Search, MapPin, X } from "lucide-react";

interface JobFiltersProps {
    className?: string;
    onClose?: () => void;
}

export default function JobFilters({ className, onClose }: JobFiltersProps) {
    return (
        <div className={`bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-6 ${className}`}>
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Filters</h3>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Search */}
            <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search user, job title..." className="pl-9 bg-gray-50 border-gray-200" />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Location" className="pl-9 bg-gray-50 border-gray-200" />
                </div>
            </div>

            {/* Job Type */}
            <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Job Type</h4>
                <div className="space-y-2">
                    {['Full-Time', 'Part-Time', 'Freelance', 'Internship', 'Contract'].map(type => (
                        <label key={type} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                            {type}
                        </label>
                    ))}
                </div>
            </div>

            {/* Work Mode */}
            <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Work Mode</h4>
                <div className="space-y-2">
                    {['On-Site', 'Remote', 'Hybrid'].map(mode => (
                        <label key={mode} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                            {mode}
                        </label>
                    ))}
                </div>
            </div>

            {/* Salary Range */}
            <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Salary Range</h4>
                <div className="flex items-center gap-2">
                    <Input type="number" placeholder="Min" className="h-9 text-xs" />
                    <span className="text-gray-400">-</span>
                    <Input type="number" placeholder="Max" className="h-9 text-xs" />
                </div>
            </div>

            {/* Experience */}
            <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Experience</h4>
                <div className="space-y-2">
                    {['Fresher', '1-3 Years', '3-5 Years', '5+ Years'].map(exp => (
                        <label key={exp} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                            <input type="radio" name="experience" className="border-gray-300 text-primary-600 focus:ring-primary-500" />
                            {exp}
                        </label>
                    ))}
                </div>
            </div>

            <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white">Apply Filters</Button>
        </div>
    );
}
