import { useRef } from "react";
import { ChevronLeft, ChevronRight, Zap, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

const URGENT_JOBS = [
    {
        id: 1,
        title: "Senior React Developer",
        company: "TechCorp Inc.",
        location: "Chennai, TN",
        salary: "₹12L - ₹18L",
        posted: "2h ago",
        bg: "bg-gradient-to-br from-indigo-500 to-purple-600",
        logo: "TC"
    },
    {
        id: 2,
        title: "Sales Executive",
        company: "Growth Co.",
        location: "Bangalore",
        salary: "₹4L - ₹6L",
        posted: "1h ago",
        bg: "bg-gradient-to-br from-emerald-500 to-teal-600",
        logo: "GC"
    },
    {
        id: 3,
        title: "Digital Marketer",
        company: "Creative Studio",
        location: "Remote",
        salary: "₹5L - ₹8L",
        posted: "4h ago",
        bg: "bg-gradient-to-br from-orange-500 to-red-600",
        logo: "CS"
    },
    {
        id: 4,
        title: "UI/UX Designer",
        company: "Designify",
        location: "Hyderabad",
        salary: "₹8L - ₹12L",
        posted: "5h ago",
        bg: "bg-gradient-to-br from-pink-500 to-rose-600",
        logo: "D"
    }
];

export default function UrgentJobsRail() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="relative mb-6 group">
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                    <h2 className="text-lg font-bold text-gray-900">Urgent Openings</h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-1.5 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary-600 transition-colors hidden md:flex"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-1.5 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary-600 transition-colors hidden md:flex"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            >
                {URGENT_JOBS.map((job) => (
                    <Link
                        to={`/job/${job.id}`}
                        key={job.id}
                        className="min-w-[280px] md:min-w-[300px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 snap-center hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 -mr-10 -mt-10 pointer-events-none ${job.bg}`}></div>

                        <div className="flex items-start justify-between mb-3">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md ${job.bg}`}>
                                {job.logo}
                            </div>
                            <span className="text-[10px] font-semibold bg-red-50 text-red-600 px-2 py-1 rounded-full border border-red-100">
                                Urgent
                            </span>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-1 truncate">{job.title}</h3>
                        <p className="text-sm text-gray-500 mb-3">{job.company}</p>

                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {job.posted}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                            <span className="font-semibold text-primary-700 text-sm">{job.salary}</span>
                            <Button size="sm" className="h-8 text-xs rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 border-primary-100 shadow-none">
                                Apply Now
                            </Button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
