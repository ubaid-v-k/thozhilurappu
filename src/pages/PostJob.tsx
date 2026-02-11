import { useNavigate } from "react-router-dom";
import { CreatePost } from "../components/feed/CreatePost";
import { usePosts } from "../context/PostsContext";
import { useAuth } from "../context/AuthContext";

export default function PostJob() {
    const navigate = useNavigate();
    const { addPost } = usePosts();
    useAuth(); // Keeping hook for potential future use or side effects, or just remove if truly unused. 
    // Actually better to just remove the unused variable.

    const handleSubmit = async (data: any) => {
        // Data coming from CreatePost: { type, description, images, ...extraFields }
        // We need to shape it into our Post object

        const newPost: any = {
            id: Date.now(),
            type: data.type,
            title: data.title || (data.type === 'NORMAL' ? undefined : "Untitled"), // Normal posts might not have title
            description: data.description,
            location: data.location || "Remote", // Fallback
            postedAt: "Just now",
            verified: false,
            images: data.images,
            user: {
                id: "current-user",
                name: "You",
                role: "user" // In real app, get from auth context
            },
            ...data // Spread extra fields like company, salary, etc.
        };

        addPost(newPost);
        navigate('/jobs');
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h1>
            <CreatePost onSubmit={handleSubmit} />
        </div>
    );
}
