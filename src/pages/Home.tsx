import { useState } from "react";
import Feed from "../components/feed/Feed";
import UrgentJobsRail from "../components/feed/UrgentJobsRail";
import { Button } from "../components/ui/Button";
import { SlidersHorizontal } from "lucide-react";
import JobFilters from "../components/feed/JobFilters";
import { AnimatePresence, motion } from "framer-motion";
import { SearchBar } from "../components/ui/SearchBar";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="relative max-w-[600px] mx-auto pb-20">
            {/* Header & Search */}
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 mb-4">
                <div className="flex justify-between items-center mb-3 md:hidden">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">Thozhilurappu</h1>
                    <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(true)} className="-mr-2">
                        <SlidersHorizontal className="h-6 w-6 text-gray-600" />
                    </Button>
                </div>

                <SearchBar
                    placeholder="Search for jobs, services, or people..."
                    showLocation={false}
                    className="shadow-sm border-gray-200"
                    onSearch={(query) => {
                        navigate(`/jobs?search=${encodeURIComponent(query)}`);
                    }}
                />
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

            {/* Urgent Openings */}
            <UrgentJobsRail />

            {/* Main Feed */}
            <Feed />
        </div>
    );
}
