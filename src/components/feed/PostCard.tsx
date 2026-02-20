import { useState, useRef } from 'react';
import { MoreHorizontal, MessageCircle, ThumbsUp, ThumbsDown, Share2, MapPin, CheckCircle2, Building2, Wrench, Check, X, Clock, Flag, UserX, Bookmark, Bell, Info, Code, PlusCircle, MinusCircle } from 'lucide-react';
import type { Post, JobPost, ServicePost } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { ShareDialog } from './ShareDialog';
import CommentsSection from './CommentsSection';

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const isJob = post.type === 'JOB';
    const isService = post.type === 'SERVICE';
    const isNormal = post.type === 'NORMAL';

    // Local state for interactions (Mock)
    const [liked, setLiked] = useState(false);
    const [followed, setFollowed] = useState(false);
    const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 50) + 5);
    const [showMenu, setShowMenu] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(menuRef, () => setShowMenu(false));

    const handleLike = () => {
        setLiked(!liked);
        setLikesCount(prev => liked ? prev - 1 : prev + 1);
    };

    const toggleConnect = () => {
        setFollowed(!followed);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden relative">
            {/* Header */}
            <div className="p-4 flex items-start justify-between">
                <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200 cursor-pointer">
                        {post.user?.avatar ? (
                            <img src={post.user.avatar} alt={post.user.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm font-bold">
                                {post.user?.name?.[0] || 'U'}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex flex-col">
                            {post.group ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-900 text-sm hover:underline cursor-pointer">
                                            {post.group.name}
                                        </span>
                                        {/* Join Button for Group */}
                                        {!post.group.joined && (
                                            <button
                                                onClick={() => console.log('Join group', post.group?.id)} // Use context to join in real app
                                                className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full"
                                            >
                                                Join
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <span>{post.user?.name}</span>
                                        {post.user?.verified && <CheckCircle2 className="h-3 w-3 text-blue-500 fill-blue-50" />}
                                        <span>•</span>
                                        <span>{post.postedAt}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-gray-900 text-sm hover:underline cursor-pointer">{post.user?.name || "Unknown User"}</h3>
                                    {post.user?.verified && <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 fill-blue-50" />}

                                    {/* Connect Button */}
                                    <button
                                        onClick={toggleConnect}
                                        className={cn(
                                            "text-xs font-semibold transition-colors duration-200 ml-1 flex items-center gap-0.5",
                                            followed ? "text-green-600" : "text-blue-600 hover:text-blue-800"
                                        )}
                                    >
                                        {followed ? <><Check className="h-3 w-3" /> Connected</> : "• Connect"}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                            {post.user?.role && (
                                <span className={cn(
                                    "hidden sm:inline-block px-1.5 py-0.5 rounded-full font-medium border mr-1",
                                    post.user.role === 'worker' ? "bg-teal-50 text-teal-700 border-teal-100" :
                                        post.user.role === 'employer' ? "bg-purple-50 text-purple-700 border-purple-100" :
                                            "bg-gray-50 text-gray-600 border-gray-100"
                                )}>
                                    {post.user.role}
                                </span>
                            )}
                            {!post.group && <span>{post.postedAt}</span>}
                            {post.location && (
                                <>
                                    <span>•</span>
                                    <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {post.location}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="relative" ref={menuRef}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-gray-600 relative z-10"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <MoreHorizontal className="h-5 w-5" />
                    </Button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                            <div className="py-2">
                                {/* Interest Group */}
                                <div className="px-2 pb-2 border-b border-gray-100">
                                    <div className="rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                                        <div className="flex items-start gap-3 p-2">
                                            <PlusCircle className="h-5 w-5 text-gray-800 mt-0.5" strokeWidth={2.5} />
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900">Interested</h4>
                                                <p className="text-xs text-gray-500">More of your posts will be like this.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group mt-1">
                                        <div className="flex items-start gap-3 p-2">
                                            <MinusCircle className="h-5 w-5 text-gray-800 mt-0.5" strokeWidth={2.5} />
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900">Not interested</h4>
                                                <p className="text-xs text-gray-500">Fewer of your posts will be like this.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Group */}
                                <div className="px-2 py-2 border-b border-gray-100">
                                    <button className="w-full text-left flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Bookmark className="h-5 w-5 text-gray-800 mt-0.5 fill-current" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900">Save Post</h4>
                                            <p className="text-xs text-gray-500">Add this to your saved items.</p>
                                        </div>
                                    </button>
                                    <button className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors mt-1">
                                        <Bell className="h-5 w-5 text-gray-800 fill-current" />
                                        <h4 className="text-sm font-semibold text-gray-900">Turn on notifications for this post</h4>
                                    </button>
                                    <button className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors mt-1">
                                        <Info className="h-5 w-5 text-gray-800 fill-current" />
                                        <h4 className="text-sm font-semibold text-gray-900">Why am I seeing this post?</h4>
                                    </button>
                                    <button className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors mt-1">
                                        <Code className="h-5 w-5 text-gray-800" />
                                        <h4 className="text-sm font-semibold text-gray-900">Embed</h4>
                                    </button>
                                </div>

                                {/* Moderation Group */}
                                <div className="px-2 pt-2 bg-gray-50/50">
                                    <button className="w-full text-left flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="bg-gray-800 rounded-sm p-0.5">
                                            <X className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900">Hide post</h4>
                                            <p className="text-xs text-gray-500">See fewer posts like this.</p>
                                        </div>
                                    </button>
                                    <button className="w-full text-left flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors mt-1">
                                        <Clock className="h-5 w-5 text-gray-800 mt-0.5 fill-current" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900">Snooze {post.user?.name || 'User'} for 30 days</h4>
                                            <p className="text-xs text-gray-500">Temporarily stop seeing posts.</p>
                                        </div>
                                    </button>
                                    <button className="w-full text-left flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors mt-1">
                                        <div className="bg-gray-800 rounded-sm p-0.5">
                                            <X className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900">Unfollow {post.user?.name || 'User'}</h4>
                                            <p className="text-xs text-gray-500">Stop seeing posts but stay friends.</p>
                                        </div>
                                    </button>
                                    <button className="w-full text-left flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors mt-1">
                                        <Flag className="h-5 w-5 text-gray-800 mt-0.5 fill-current" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900">Report post</h4>
                                            <p className="text-xs text-gray-500">We won't let {post.user?.name || 'User'} know.</p>
                                        </div>
                                    </button>
                                    <button className="w-full text-left flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors mt-1">
                                        <UserX className="h-5 w-5 text-gray-800 mt-0.5 fill-current" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900">Block {post.user?.name || 'User'}'s profile</h4>
                                            <p className="text-xs text-gray-500">You won't be able to see or contact each other.</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-2">
                {/* Title & Badges for structured posts */}
                {!isNormal && (
                    <div className="mb-3">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 leading-tight mb-1">{post.title}</h2>
                                {isJob && (
                                    <p className="flex items-center gap-1.5 text-sm text-gray-600">
                                        <Building2 className="h-4 w-4 text-gray-400" />
                                        {(post as JobPost).company}
                                    </p>
                                )}
                                {isService && (
                                    <p className="flex items-center gap-1.5 text-sm text-teal-700 font-medium">
                                        <Wrench className="h-4 w-4" />
                                        {(post as ServicePost).category}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant={isJob ? 'secondary' : 'default'} className={isService ? "bg-teal-100 text-teal-800" : ""}>
                                {isJob ? (post as JobPost).jobType : (post as ServicePost).rate}
                            </Badge>
                            {isJob && <Badge variant="outline" className="text-gray-600 border-gray-200">{(post as JobPost).salary}</Badge>}
                        </div>
                    </div>
                )}

                {/* Normal Post Title/Text */}
                {isNormal && post.title && (
                    <h2 className="text-base font-medium text-gray-900 mb-2">{post.title}</h2>
                )}

                {/* Description */}
                {post.description && (
                    <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed mb-3">
                        {post.description}
                    </p>
                )}
            </div>

            {/* Images */}
            {post.images && post.images.length > 0 && (
                <div className={cn("mt-2", post.images.length > 1 ? "grid grid-cols-2 gap-0.5" : "")}>
                    {post.images.map((img, idx) => (
                        <div key={idx} className={cn("relative bg-gray-100", post.images!.length === 1 ? "aspect-video" : "aspect-square")}>
                            <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}

            {/* Likes Count (FB Style) */}
            <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <div className="bg-blue-500 rounded-full p-1 text-white">
                        <ThumbsUp className="h-2 w-2 fill-white" />
                    </div>
                    <span>{likesCount} likes</span>
                </div>
                <span>2 comments</span>
            </div>

            {/* Footer / Actions */}
            <div className="px-2 py-1 border-t border-gray-100 flex items-center justify-between mt-0">
                <div className="flex gap-1 flex-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLike}
                        className={cn(
                            "flex-1 gap-2 hover:bg-gray-50 transition-colors",
                            liked ? "text-blue-600 font-medium" : "text-gray-600"
                        )}
                    >
                        <ThumbsUp className={cn("h-5 w-5", liked && "fill-current")} />
                        <span className="text-sm font-medium">Like</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            if (liked) {
                                setLiked(false);
                                setLikesCount(prev => prev - 1);
                            }
                            // Toggle dislike state (if we tracked it) - for now just UI
                            // Let's add local state for disliked if we want it to be toggleable
                            // But request just said "add post unlike option".
                            // Usually "Unlike" means removing the like. 
                            // But user also said "add post unlike option" in the context of "like and unlike option" 
                            // AND "add post unlike option" at the end. 
                            // If they mean "Dislike" button:
                        }}
                        className="flex-1 gap-2 text-gray-600 hover:bg-gray-50"
                    >
                        {/* Re-reading request: "add post unlike option" 
                             This could mean "Dislike" button. 
                             Or it could mean just the ability to unlike. 
                             Given "like and unlike option" for comments, and "post unlike option", 
                             I'll add a Dislike button (ThumbsDown) as planned. 
                         */}
                        <ThumbsDown className="h-5 w-5" />
                        <span className="text-sm font-medium">Dislike</span>
                    </Button>

                    {/* Comment Button - Desktop (Toggle) */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn("hidden md:flex flex-1 gap-2 hover:bg-gray-50", showComments ? "text-blue-600 bg-blue-50" : "text-gray-600")}
                        onClick={() => setShowComments(!showComments)}
                    >
                        <MessageCircle className={cn("h-5 w-5", showComments && "fill-current")} />
                        <span className="text-sm font-medium">Comment</span>
                    </Button>

                    {/* Comment Button - Mobile (Navigate) */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex md:hidden flex-1 gap-2 text-gray-600 hover:bg-gray-50"
                        onClick={() => window.location.href = `/post/${post.id}`}
                    >
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Comment</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 gap-2 text-gray-600 hover:bg-gray-50"
                        onClick={() => setShowShareDialog(true)}
                    >
                        <Share2 className="h-5 w-5" />
                        <span className="text-sm font-medium">Share</span>
                    </Button>
                </div>
            </div>

            {/* Action Buttons for Job/Service (Separate Row or Integrated? Keeping separate for emphasis) */}
            {(isJob || isService) && (
                <div className="p-3 pt-0 flex justify-end">
                    {isJob && (
                        <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm px-5 rounded-full w-full sm:w-auto">
                            Apply Now
                        </Button>
                    )}
                    {isService && (
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm px-5 rounded-full w-full sm:w-auto">
                            Contact
                        </Button>
                    )}
                </div>
            )}

            <ShareDialog isOpen={showShareDialog} onClose={() => setShowShareDialog(false)} post={post} />

            {/* Comments Section */}
            {showComments && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                    <CommentsSection postId={post.id.toString()} />
                </div>
            )}
        </div>
    );
}
