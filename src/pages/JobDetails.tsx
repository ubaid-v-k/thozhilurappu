import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Briefcase, DollarSign, Clock, Building2, Share2, Bookmark } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    description: string;
    requirements: string[];
    postedAt: string;
    logo?: string;
}

const MOCK_JOBS: Record<string, Job> = {
    "1": {
        _id: "1",
        title: "Senior React Developer",
        company: "TechCorp Inc.",
        location: "Chennai, TN",
        salary: "₹12L - ₹18L",
        type: "Full-Time",
        postedAt: new Date().toISOString(),
        description: `We are looking for an experienced Senior React Developer to join our dynamic team. You will be responsible for building high-performance, scalable web applications using React, TypeScript, and Tailwind CSS.
        
You will work closely with product managers and designers to deliver high-quality user experiences.`,
        requirements: [
            "5+ years of experience with React and modern JavaScript",
            "Strong understanding of TypeScript and state management (Redux/Zustand)",
            "Experience with REST APIs and GraphQL",
            "Familiarity with CI/CD pipelines and testing frameworks"
        ],
        logo: "https://ui-avatars.com/api/?name=TechCorp+Inc&background=0D9488&color=fff"
    },
    "2": {
        _id: "2",
        title: "Product Designer (UI/UX)",
        company: "Designify",
        location: "Remote / WFH",
        salary: "₹10L - ₹15L",
        type: "Remote",
        postedAt: new Date(Date.now() - 86400000).toISOString(),
        description: `We are seeking a creative Product Designer to craft intuitive and beautiful user interfaces. You will be involved in the entire design process from user research to high-fidelity prototyping.`,
        requirements: [
            "3+ years of product design experience",
            "Proficiency in Figma and prototyping tools",
            "Strong portfolio showcasing web and mobile apps",
            "Experience with design systems"
        ],
        logo: "https://ui-avatars.com/api/?name=Designify&background=4F46E5&color=fff"
    },
    // Fallback for other IDs
    "default": {
        _id: "default",
        title: "Software Engineer",
        company: "Generic Tech",
        location: "Bangalore",
        salary: "₹15L - ₹25L",
        type: "Full-Time",
        postedAt: new Date().toISOString(),
        description: "This is a mock job posting for demonstration purposes.",
        requirements: ["Proficiency in coding", "Good communication skills"],
        logo: "https://ui-avatars.com/api/?name=Generic+Tech&background=random"
    }
};

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { requireAuth } = useAuth();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true);
            setTimeout(() => {
                if (id && MOCK_JOBS[id]) {
                    setJob(MOCK_JOBS[id]);
                } else if (id) {
                    // In a real app 404, here just show default or 404
                    // For demo let's show default if not found to avoid empty screens
                    setJob({ ...MOCK_JOBS["default"], _id: id });
                } else {
                    setError("Job ID missing");
                }
                setLoading(false);
            }, 500);
        };
        fetchJob();
    }, [id]);

    const handleApply = () => {
        requireAuth(() => {
            // Implement apply logic or show success message
            api.post(`/jobs/${id}/apply`)
                .then(() => alert("Applied successfully!"))
                .catch((err: any) => console.error("Failed to apply", err));
        });
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (error || !job) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold truncate flex-1">{job.title}</h1>
                <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5 text-gray-500" />
                </Button>
            </div>

            <div className="max-w-3xl mx-auto p-4 space-y-6">
                {/* Job Header Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start gap-4">
                        <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                            <img
                                src={job.logo || `https://ui-avatars.com/api/?name=${job.company}&background=random`}
                                alt={job.company}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                                <Building2 className="h-4 w-4" />
                                <span className="font-medium">{job.company}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Badge variant="secondary" className="flex gap-1 items-center px-3 py-1">
                            <MapPin className="h-3 w-3" /> {job.location}
                        </Badge>
                        <Badge variant="outline" className="flex gap-1 items-center px-3 py-1 border-blue-200 bg-blue-50 text-blue-700">
                            <Briefcase className="h-3 w-3" /> {job.type}
                        </Badge>
                        <Badge variant="outline" className="flex gap-1 items-center px-3 py-1 border-green-200 bg-green-50 text-green-700">
                            <DollarSign className="h-3 w-3" /> {job.salary}
                        </Badge>
                        <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto">
                            <Clock className="h-3 w-3" /> {new Date(job.postedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                    <h3 className="font-bold text-lg text-gray-900">Job Description</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>

                    {job.requirements && job.requirements.length > 0 && (
                        <>
                            <h3 className="font-bold text-lg text-gray-900 mt-6">Requirements</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-600">
                                {job.requirements.map((req, i) => (
                                    <li key={i}>{req}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 items-center z-20 md:hidden">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl">
                    <Bookmark className="h-5 w-5" />
                </Button>
                <Button className="flex-1 h-12 rounded-xl text-base" onClick={handleApply}>
                    Apply Now
                </Button>
            </div>
            {/* Desktop Action Bar floating or static? reuse mostly */}
            <div className="hidden md:flex fixed bottom-8 right-8 gap-4 z-20">
                <Button variant="outline" size="lg" className="rounded-full shadow-lg bg-white">
                    <Bookmark className="h-5 w-5 mr-2" /> Save
                </Button>
                <Button size="lg" className="rounded-full shadow-lg px-8" onClick={handleApply}>
                    Apply Now
                </Button>
            </div>
        </div>
    );
}
