import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, MapPin, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import api from '../../services/api';

export default function UrgentOpenings() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [urgentJobs, setUrgentJobs] = useState<any[]>([]);

    useEffect(() => {
        const fetchUrgentJobs = async () => {
            try {
                const res = await api.get('/jobs/urgent');
                // Transform API data to match UI needs
                const formatted = res.data.map((job: any) => ({
                    id: job._id,
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    pay: job.salary,
                    time: 'Urgent' // Mock time left for now or calculate from createdAt
                }));
                setUrgentJobs(formatted);
            } catch (err) {
                console.error("Failed to fetch urgent jobs:", err);
            }
        };
        fetchUrgentJobs();
    }, []);

    if (urgentJobs.length === 0) return null;

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="bg-red-500 text-white p-1 rounded-md"><Zap className="h-4 w-4 fill-current" /></span>
                    Urgent Openings
                </h2>
                <Button variant="link" className="text-sm text-primary-600 h-auto p-0">View All</Button>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {urgentJobs.map((job, i) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="min-w-[240px] bg-white rounded-xl p-4 border border-red-100 shadow-sm snap-start hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                            URGENT
                        </div>

                        <div className="mb-2">
                            <h3 className="font-bold text-gray-900 truncate">{job.title}</h3>
                            <p className="text-xs text-gray-500">{job.company}</p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                            <span className="font-semibold text-emerald-600">{job.pay}</span>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                            <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {job.time}
                            </span>
                            <div className="h-6 w-6 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                                <ChevronRight className="h-4 w-4" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
