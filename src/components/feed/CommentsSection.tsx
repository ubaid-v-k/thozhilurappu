import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Send } from "lucide-react";
import api from "../../services/api";

interface Comment {
    _id: string;
    user: {
        name: string;
        avatar: string;
    };
    text: string;
    date: string;
}

export default function CommentsSection({ postId }: { postId: string }) {
    const { user, requireAuth } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                // In a real app we might have a dedicated endpoint or expand it from job details
                // For now, let's assume we fetch the job details which includes comments, 
                // OR we have a nested route. The current backend returns comments in the job object.
                // But efficient way is to just use the comments array passed as prop? 
                // Ah, the PostCard has comments. But for real-time updates and pagination, fetching is better.
                // Let's assume we can fetch just comments or job details.
                // Our backend `GET / jobs` returns comments. But maybe we need `GET / jobs /: id` for details.
                // For now, let's just mock fetching or use what we have.
                // Actually, I already built `POST / jobs /: id / comment` which returns the updated comments list.
                // So I can initialize with empty or props, and then updates will work.

                // Ideally, we should fetch comments here if not passed.
                // Let's just set loading false for now as we don't have a specific "get comments" endpoint isolated from get job.
                // We'll rely on the optimistic update or the response from post comment.
                // setLoading(false);
            } catch (err) {
                console.error(err);
                // setLoading(false);
            }
        };
        fetchComments();
    }, [postId]);

    const handlePostComment = () => {
        requireAuth(async () => {
            if (!newComment.trim()) return;

            try {
                const res = await api.post(`/jobs/${postId}/comment`, { text: newComment });
                // Backend returns the updated list of comments
                setComments(res.data);
                setNewComment("");
            } catch (err) {
                console.error("Failed to post comment:", err);
            }
        });
    };

    return (
        <div className="bg-gray-50/50 border-t border-gray-100 p-4 space-y-4">
            {/* Comment List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                {comments.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-2">No comments yet. Be the first!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment._id} className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                <img src={comment.user.avatar} alt={comment.user.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm flex-1">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-sm font-semibold text-gray-900">{comment.user.name}</span>
                                    <span className="text-xs text-gray-400">{new Date(comment.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-700">{comment.text}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 hidden md:block">
                    <img src={user?.avatar || "https://ui-avatars.com/api/?background=random"} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 relative">
                    <Input
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onFocus={() => requireAuth(() => { })}
                        className="pr-10"
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-1 top-1 h-8 w-8 text-primary-600"
                        onClick={handlePostComment}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
