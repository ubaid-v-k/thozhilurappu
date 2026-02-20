import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Send, MoreHorizontal, Flag, X, Pin } from "lucide-react";
import { cn } from "../../utils/cn";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

interface Comment {
    _id: string;
    user: {
        name: string;
        avatar: string;
    };
    text: string;
    date: string;
    likes: number;
    isLiked: boolean;
    isPinned?: boolean;
    isHidden?: boolean;
}

interface CommentItemProps {
    comment: Comment;
    onLike: (id: string) => void;
    onPin: (id: string) => void;
    onHide: (id: string) => void;
    onReport: (id: string) => void;
}

function CommentItem({ comment, onLike, onPin, onHide, onReport }: CommentItemProps) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(menuRef, () => setShowMenu(false));

    if (comment.isHidden) return null;

    return (
        <div className={cn("flex gap-3 relative group", comment.isPinned && "bg-blue-50/50 p-2 rounded-lg -mx-2")}>
            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                <img src={comment.user.avatar} alt={comment.user.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
                <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm relative">
                    <div className="flex justify-between items-baseline mb-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{comment.user.name}</span>
                            {comment.isPinned && <Pin className="h-3 w-3 text-blue-500 fill-current rotate-45" />}
                        </div>
                        <span className="text-xs text-gray-400">{new Date(comment.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-1 ml-1">
                    <button
                        onClick={() => onLike(comment._id)}
                        className={cn("text-xs font-semibold flex items-center gap-1 hover:text-blue-600 transition-colors", comment.isLiked ? "text-blue-600" : "text-gray-500")}
                    >
                        Like {comment.likes > 0 && <span>({comment.likes})</span>}
                    </button>
                    <button className="text-xs font-semibold text-gray-500 hover:text-gray-700">Reply</button>
                </div>
            </div>

            {/* Menu */}
            <div className="absolute right-0 top-2 opacity-0 group-hover:opacity-100 transition-opacity" ref={menuRef}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowMenu(!showMenu)}
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>

                {showMenu && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-10 overflow-hidden py-1">
                        <button
                            onClick={() => { onPin(comment._id); setShowMenu(false); }}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <Pin className="h-3.5 w-3.5" /> {comment.isPinned ? "Unpin" : "Pin"}
                        </button>
                        <button
                            onClick={() => { onHide(comment._id); setShowMenu(false); }}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <X className="h-3.5 w-3.5" /> Hide
                        </button>
                        <button
                            onClick={() => { onReport(comment._id); setShowMenu(false); }}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                            <Flag className="h-3.5 w-3.5" /> Report
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CommentsSection({ postId }: { postId: string }) {
    const { user, requireAuth } = useAuth();
    // Mock data initialization for demo purposes since backend doesn't support these fields yet
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                // Mock fetch
                const mockComments: Comment[] = [
                    {
                        _id: "1",
                        user: { name: "Alice", avatar: "https://ui-avatars.com/api/?name=Alice&background=random" },
                        text: "Great opportunity!",
                        date: "2023-10-27T10:00:00Z",
                        likes: 5,
                        isLiked: false
                    },
                    {
                        _id: "2",
                        user: { name: "Bob", avatar: "https://ui-avatars.com/api/?name=Bob&background=random" },
                        text: "Is this remote?",
                        date: "2023-10-27T10:30:00Z",
                        likes: 0,
                        isLiked: false
                    }
                ];
                setComments(mockComments);
            } catch (err) {
                console.error(err);
            }
        };
        fetchComments();
    }, [postId]);

    const handlePostComment = () => {
        requireAuth(async () => {
            if (!newComment.trim()) return;

            try {
                // Mock post
                const newCommentObj: Comment = {
                    _id: Date.now().toString(),
                    user: { name: user?.name || "User", avatar: user?.avatar || "https://ui-avatars.com/api/?background=random" },
                    text: newComment,
                    date: new Date().toISOString(),
                    likes: 0,
                    isLiked: false
                };

                setComments(prev => [...prev, newCommentObj]);
                setNewComment("");

                // await api.post(`/jobs/${postId}/comment`, { text: newComment });
            } catch (err) {
                console.error("Failed to post comment:", err);
            }
        });
    };

    const handleLike = (id: string) => {
        setComments(prev => prev.map(c => {
            if (c._id === id) {
                return {
                    ...c,
                    likes: c.isLiked ? c.likes - 1 : c.likes + 1,
                    isLiked: !c.isLiked
                };
            }
            return c;
        }));
    };

    const handlePin = (id: string) => {
        setComments(prev => {
            const updated = prev.map(c => c._id === id ? { ...c, isPinned: !c.isPinned } : c);
            // Sort pinned to top
            return [...updated].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
        });
    };

    const handleHide = (id: string) => {
        setComments(prev => prev.map(c => c._id === id ? { ...c, isHidden: true } : c));
    };

    const handleReport = (id: string) => {
        console.log("Reported comment:", id);
        alert("Comment reported to admins.");
    };

    return (
        <div className="bg-gray-50/50 border-t border-gray-100 p-4 space-y-4">
            {/* Comment List */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                {comments.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-2">No comments yet. Be the first!</p>
                ) : (
                    comments.map(comment => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            onLike={handleLike}
                            onPin={handlePin}
                            onHide={handleHide}
                            onReport={handleReport}
                        />
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
