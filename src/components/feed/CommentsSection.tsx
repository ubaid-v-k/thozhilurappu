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
        <div className={cn("flex gap-2 relative group items-start", comment.isPinned && "bg-blue-50/30 p-2 rounded-lg -mx-2")}>
            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 mt-0.5">
                <img src={comment.user.avatar} alt={comment.user.name} className="h-full w-full object-cover" />
            </div>

            <div className="flex-1 max-w-[85%]">
                {/* Bubble */}
                <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-tl-none inline-block">
                    <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-xs font-bold text-gray-900">{comment.user.name}</span>
                        {comment.isPinned && <Pin className="h-3 w-3 text-blue-500 fill-current rotate-45" />}
                    </div>
                    <p className="text-sm text-gray-800 leading-snug">{comment.text}</p>
                </div>

                {/* Thread Actions */}
                <div className="flex items-center gap-4 mt-1 ml-1">
                    <span className="text-xs text-gray-500">{new Date(comment.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    <button
                        onClick={() => onLike(comment._id)}
                        className={cn("text-xs font-bold hover:underline transition-colors", comment.isLiked ? "text-blue-600" : "text-gray-500")}
                    >
                        Like {comment.likes > 0 && <span>({comment.likes})</span>}
                    </button>
                    <button className="text-xs font-bold text-gray-500 hover:scale-105 transition-transform hover:underline">Reply</button>
                </div>
            </div>

            {/* Menu */}
            <div className="absolute right-0 top-2 opacity-0 group-hover:opacity-100 transition-opacity" ref={menuRef}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
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

export default function CommentsSection({ postId, isPage = false }: { postId: string, isPage?: boolean }) {
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
        <div className={cn("bg-transparent space-y-4", !isPage ? "p-4 border-t border-gray-100" : "")}>
            {/* Comment List */}
            <div className={cn("space-y-4 pr-2 scrollbar-thin", isPage ? "max-h-none" : "max-h-80 overflow-y-auto")}>
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
            {isPage ? (
                // Sticky Footer Input for Mobile Page
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-2 md:relative md:border-none md:p-0 z-50">
                    <div className="flex gap-2 items-center max-w-2xl mx-auto">
                        <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 hidden md:block">
                            <img src={user?.avatar || "https://ui-avatars.com/api/?background=random"} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 relative bg-gray-100 rounded-full flex items-center px-2">
                            <Input
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onFocus={() => requireAuth(() => { })}
                                className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 h-10 w-full"
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-primary-600 hover:bg-gray-200 rounded-full"
                                onClick={handlePostComment}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                // Inline Input
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
                            className="rounded-full bg-gray-100 border-none px-4"
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-1 top-1 h-8 w-8 text-primary-600 rounded-full hover:bg-gray-200"
                            onClick={handlePostComment}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
