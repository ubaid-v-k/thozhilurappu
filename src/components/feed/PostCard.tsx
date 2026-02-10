import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Heart, MessageCircle, Share2, MoreHorizontal, Briefcase, MapPin, Bookmark, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";
import CommentsSection from "./CommentsSection";
import api from "../../services/api";
import type { Post, JobPost, ServicePost } from "../../types";

export default function PostCard({ post }: { post: Post }) {
    const { requireAuth } = useAuth();
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [likes, setLikes] = useState(42); // Mock stats
    const [comments] = useState(12); // Mock stats
    const [showComments, setShowComments] = useState(false);

    const isJob = post.type === 'JOB';
    const jobPost = isJob ? (post as JobPost) : null;
    const servicePost = !isJob ? (post as ServicePost) : null;

    const handleLike = () => {
        requireAuth(async () => {
            try {
                setLiked(!liked);
                setLikes(prev => liked ? prev - 1 : prev + 1);
                await api.post(`/posts/${post.id}/like`);
            } catch (err) {
                console.error("Failed to like post:", err);
                setLiked(!liked);
                setLikes(prev => liked ? prev + 1 : prev - 1);
            }
        });
    };

    const handleSave = () => {
        requireAuth(() => {
            setSaved(!saved);
        });
    };

    const handleAction = () => {
        requireAuth(() => {
            console.log(isJob ? "Applying to job:" : "Booking service:", post.title);
        });
    };

    const handleComment = () => {
        setShowComments(!showComments);
    };

    const handleShare = () => {
        console.log("Sharing");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-4 hover:shadow-md transition-all"
        >
            {/* Header */}
            <div className="p-5 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 shadow-sm relative group cursor-pointer">
                        {post.user?.avatar ? (
                            <img src={post.user.avatar} alt={post.user.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold">
                                {post.user?.name?.charAt(0) || "U"}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-gray-900 text-sm">{post.user?.name || (isJob ? jobPost?.company : "Service Provider")}</h3>
                            {post.user?.verified && <Badge variant="verified" className="h-4 px-1.5 text-[10px] bg-blue-50 text-blue-600 border-blue-100">Verified</Badge>}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{post.user?.role || (isJob ? "Employer" : "Worker")} • {post.postedAt}</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-gray-50 rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>

            {/* Content */}
            <div className="px-5 pb-3">
                <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors cursor-pointer">{post.title}</h2>
                <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-600">
                    {isJob ? (
                        <>
                            <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-100"><Briefcase className="h-3 w-3 text-gray-400" /> {jobPost?.jobType}</span>
                            <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-100">{jobPost?.salary}</span>
                        </>
                    ) : (
                        <>
                            <span className="flex items-center gap-1 bg-teal-50 text-teal-700 px-2.5 py-1 rounded-md text-xs font-medium border border-teal-100"><Wrench className="h-3 w-3" /> {servicePost?.category}</span>
                            <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-100">{servicePost?.rate}</span>
                        </>
                    )}
                    <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-100"><MapPin className="h-3 w-3 text-gray-400" /> {post.location}</span>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.description}
                </p>

                {/* Images */}
                {post.images && post.images.length > 0 && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-gray-100">
                        <img src={post.images[0]} alt="Post content" className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleLike}
                        className={cn("flex items-center gap-2 text-sm font-medium transition-all group p-1 rounded-lg hover:bg-red-50", liked ? "text-red-500" : "text-gray-500 hover:text-red-500")}
                    >
                        <Heart className={cn("h-5 w-5 transition-transform group-active:scale-75", liked && "fill-current")} />
                        <span>{likes}</span>
                    </button>
                    <button
                        onClick={handleComment}
                        className={cn("flex items-center gap-2 text-sm font-medium transition-all p-1 rounded-lg hover:bg-blue-50", showComments ? "text-primary-600" : "text-gray-500 hover:text-primary-600")}
                    >
                        <MessageCircle className={cn("h-5 w-5", showComments && "fill-current")} />
                        <span>{comments}</span>
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors p-1 rounded-lg hover:bg-gray-100"
                    >
                        <Share2 className="h-5 w-5" />
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        className={cn("text-gray-400 hover:text-gray-900 transition-all p-2 rounded-full hover:bg-gray-100", saved && "text-primary-600 fill-current")}
                    >
                        <Bookmark className={cn("h-5 w-5", saved && "fill-current")} />
                    </button>
                    <Button size="sm" onClick={handleAction} className={cn("rounded-lg px-5 h-9 shadow-lg transition-all", isJob ? "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/20" : "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20")}>
                        {isJob ? "Apply Now" : "Book Service"}
                    </Button>
                </div>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <CommentsSection postId={post.id.toString()} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
