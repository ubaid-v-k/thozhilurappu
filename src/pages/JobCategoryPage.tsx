import { useParams } from "react-router-dom";
import Feed from "../components/feed/Feed";
import { Button } from "../components/ui/Button";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import JobFilters from "../components/feed/JobFilters";

export default function JobCategoryPage() {
    const { type } = useParams();
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Format title from slug (e.g. "full-time" -> "Full Time Jobs")
    const title = type
        ? type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + " Jobs"
        : "Jobs";

    // Map slug to filter type expected by Feed
    const filterType = type === 'remote' ? 'Remote'
        : type === 'full-time' ? 'Full-time'
            : type === 'part-time' ? 'Part-time'
                : undefined;

    return (
        <div className="relative">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 p-4 flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <Link to="/">
                        <Button variant="ghost" size="icon" className="-ml-2">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </Button>
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900">{title}</h1>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(true)} className="md:hidden">
                    <SlidersHorizontal className="h-5 w-5 text-gray-600" />
                </Button>
            </div>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
                {showMobileFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 md:hidden"
                            onClick={() => setShowMobileFilters(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-80 bg-white z-50 md:hidden overflow-y-auto shadow-2xl"
                        >
                            <div className="p-4">
                                <JobFilters onClose={() => setShowMobileFilters(false)} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Only show Urgent for some categories or maybe all? Let's hide for categories to declutter */}
            {/* <UrgentOpenings /> */}

            <Feed filterType={filterType} />
        </div>
    );
}
