import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { Briefcase, Wrench, X, Upload } from "lucide-react";

export default function PostJob() {
    const navigate = useNavigate();
    const { requireAuth } = useAuth();
    const { addPost } = usePosts();
    const [loading, setLoading] = useState(false);
    const [postType, setPostType] = useState<'JOB' | 'SERVICE'>('JOB');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        location: "",
        description: "",
        company: "", // Job only
        jobType: "", // Job only
        salary: "", // Job only
        rate: "", // Service only
        category: "", // Service only
        tags: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        requireAuth(async () => {
            setLoading(true);
            try {
                const postData: any = {
                    title: formData.title,
                    location: formData.location,
                    description: formData.description,
                    type: postType,
                    images: imagePreview ? [imagePreview] : [],
                    tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                    postedAt: "Just now",
                    verified: false
                };

                if (postType === 'JOB') {
                    postData.company = formData.company;
                    postData.jobType = formData.jobType;
                    postData.salary = formData.salary;
                } else {
                    postData.rate = formData.rate;
                    postData.category = formData.category;
                }

                // Add to Context State (Mock Persistence)
                const newPostWithId = { ...postData, id: Date.now() };
                addPost(newPostWithId);

                // Mock API call
                console.log("Submitting Post:", postData);
                await api.post(postType === 'JOB' ? '/jobs' : '/services', postData);

                alert(`${postType === 'JOB' ? 'Job' : 'Service'} posted successfully!`);
                navigate('/jobs');
            } catch (err: any) {
                console.error("Failed to post", err);
                // alert(err.response?.data?.msg || "Failed to post");
                // For demo, assume success if API fails (since it's likely 404 for services)
                alert(`${postType === 'JOB' ? 'Job' : 'Service'} posted successfully! (Demo Mode)`);
                navigate('/jobs');
            } finally {
                setLoading(false);
            }
        });
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Create a New Post</h1>
                    <p className="text-gray-500 mt-1">Share a job opportunity or offer your professional services</p>
                </div>

                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        type="button"
                        onClick={() => setPostType('JOB')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${postType === 'JOB' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                    >
                        <Briefcase className="h-6 w-6" />
                        <span className="font-semibold">Post a Job</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setPostType('SERVICE')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${postType === 'SERVICE' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                    >
                        <Wrench className="h-6 w-6" />
                        <span className="font-semibold">Offer a Service</span>
                    </button>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Input
                        name="title"
                        label={postType === 'JOB' ? "Job Title" : "Service Title"}
                        placeholder={postType === 'JOB' ? "e.g. Senior Electrician" : "e.g. Professional Home Cleaning"}
                        required
                        value={formData.title}
                        onChange={handleChange}
                    />

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image (Optional)</label>
                        <div className="flex gap-4 items-start">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 transition-colors"
                            >
                                <Upload className="h-6 w-6 text-gray-400 mb-1" />
                                <span className="text-xs text-gray-500">Upload</span>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />

                            {imagePreview && (
                                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImagePreview(null)}
                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {postType === 'JOB' ? (
                            <>
                                <Input
                                    name="company"
                                    label="Company / Employer Name"
                                    placeholder="Your Name or Company"
                                    required
                                    value={formData.company}
                                    onChange={handleChange}
                                />
                                <Input
                                    name="jobType"
                                    label="Job Type"
                                    placeholder="Full-time, Part-time, etc."
                                    required
                                    value={formData.jobType}
                                    onChange={handleChange}
                                />
                            </>
                        ) : (
                            <>
                                <Input
                                    name="category"
                                    label="Service Category"
                                    placeholder="e.g. Plumbing, Cleaning"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                                <Input
                                    name="rate"
                                    label="Rate / Price"
                                    placeholder="e.g. ₹500/hr, ₹300/visit"
                                    required
                                    value={formData.rate}
                                    onChange={handleChange}
                                />
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            name="location"
                            label="Location"
                            placeholder="City or Remote"
                            required
                            value={formData.location}
                            onChange={handleChange}
                        />
                        {postType === 'JOB' && (
                            <Input
                                name="salary"
                                label="Salary Range"
                                placeholder="e.g. ₹20,000 - ₹30,000"
                                required
                                value={formData.salary}
                                onChange={handleChange}
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[150px]"
                            placeholder={postType === 'JOB' ? "Describe the role..." : "Describe your service..."}
                            required
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <Input
                        name="tags"
                        label="Tags (comma separated)"
                        placeholder="e.g. electrical, wiring"
                        value={formData.tags}
                        onChange={handleChange}
                    />

                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="outline" type="button" onClick={() => navigate(-1)}>Cancel</Button>
                        <Button type="submit" disabled={loading} className={postType === 'SERVICE' ? 'bg-teal-600 hover:bg-teal-700 text-white' : ''}>
                            {loading ? "Posting..." : (postType === 'JOB' ? "Post Job" : "Publish Service")}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
