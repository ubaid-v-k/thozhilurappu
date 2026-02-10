import { createContext, useContext, useState, type ReactNode } from 'react';
import type { JobPost, ServicePost, Post } from '../types';

const MOCK_JOBS: JobPost[] = [
    {
        id: 1,
        type: 'JOB',
        title: "Senior React Developer",
        company: "TechCorp",
        location: "Remote",
        jobType: "Full-time",
        salary: "₹25L - ₹35L",
        verified: true,
        postedAt: "2d ago",
        images: ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"],
        description: "Looking for an expert React developer..."
    },
    {
        id: 2,
        type: 'JOB',
        title: "Digital Marketing Specialist",
        company: "GrowthHacks",
        location: "Chennai, TN",
        jobType: "Part-time",
        salary: "₹15k - ₹25k / mo",
        verified: true,
        postedAt: "4h ago",
        images: ["https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80"]
    },
    {
        id: 3,
        type: 'JOB',
        title: "Site Supervisor",
        company: "City Construction",
        location: "Coimbatore, TN",
        jobType: "Contract",
        salary: "₹20k - ₹30k / mo",
        verified: false,
        postedAt: "1d ago",
        images: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"]
    },
    {
        id: 4,
        type: 'JOB',
        title: "UX/UI Designer",
        company: "Creative Studio",
        location: "Bangalore, KA",
        jobType: "Full-time",
        salary: "₹12L - ₹18L",
        verified: true,
        postedAt: "5h ago",
        images: ["https://images.unsplash.com/photo-1586717791821-3f44a5638d4f?auto=format&fit=crop&w=800&q=80"],
        description: "We need a creative designer to lead our new mobile app project."
    },
    {
        id: 5,
        type: 'JOB',
        title: "Restaurant Chef",
        company: "Spicy Treats",
        location: "Madurai, TN",
        jobType: "Full-time",
        salary: "₹25k - ₹35k / mo",
        verified: false,
        postedAt: "30m ago",
        images: ["https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=800&q=80"]
    },
    {
        id: 6,
        type: 'JOB',
        title: "കൂലിപ്പണി (Construction Worker)",
        company: "Kochi Constructions",
        location: "Kochi, Kerala",
        jobType: "Daily Wage",
        salary: "₹900 / day",
        verified: true,
        postedAt: "Just now",
        images: ["https://plus.unsplash.com/premium_photo-1664303847960-586318f59035?auto=format&fit=crop&w=800&q=80"],
        description: "Looking for daily wage workers for construction site. Food provided."
    },
    {
        id: 7,
        type: 'JOB',
        title: "Delivery Partner",
        company: "FastDelivery",
        location: "Trivandrum, KL",
        jobType: "Part-time",
        salary: "₹15k - ₹20k / mo",
        verified: true,
        postedAt: "2h ago",
        images: ["https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&w=800&q=80"]
    }
];

const MOCK_SERVICES: ServicePost[] = [
    {
        id: 101,
        type: 'SERVICE',
        title: "Professional Plumbing Services",
        rate: "₹500 / visit",
        category: "Plumbing",
        location: "Chennai, TN",
        verified: true,
        postedAt: "1h ago",
        images: ["https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80"],
        user: {
            id: "s1", name: "Ramesh Kumar", email: "ramesh@ex.com", role: "worker",
            avatar: "https://ui-avatars.com/api/?name=Ramesh+Kumar&background=0D9488&color=fff"
        }
    },
    {
        id: 102,
        type: 'SERVICE',
        title: "Home Electrical Repair",
        rate: "₹300 - ₹1000",
        category: "Electrical",
        location: "Salem, TN",
        verified: true,
        postedAt: "3h ago",
        description: "Expert in house wiring and appliance repair.",
        images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"]
    },
    {
        id: 103,
        type: 'SERVICE',
        title: "Wedding Photography",
        rate: "₹15k / event",
        category: "Photography",
        location: "Madurai, TN",
        verified: true,
        postedAt: "5d ago",
        images: ["https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"]
    },
    {
        id: 104,
        type: 'SERVICE',
        title: "AC Technician",
        rate: "₹400 / service",
        category: "Appliance Repair",
        location: "Trichy, TN",
        verified: false,
        postedAt: "6h ago",
        images: ["https://images.unsplash.com/photo-1621905252507-b35492ccba0b?auto=format&fit=crop&w=800&q=80"]
    }
];

interface PostsContextType {
    posts: Post[];
    addPost: (post: Post) => void;
    getPostsByType: (type: 'JOB' | 'SERVICE') => Post[];
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
    const [posts, setPosts] = useState<Post[]>([...MOCK_JOBS, ...MOCK_SERVICES]);

    const addPost = (newPost: Post) => {
        setPosts(prev => [newPost, ...prev]);
    };

    const getPostsByType = (type: 'JOB' | 'SERVICE') => {
        return posts.filter(p => p.type === type);
    };

    return (
        <PostsContext.Provider value={{ posts, addPost, getPostsByType }}>
            {children}
        </PostsContext.Provider>
    );
}

export function usePosts() {
    const context = useContext(PostsContext);
    if (context === undefined) {
        throw new Error('usePosts must be used within a PostsProvider');
    }
    return context;
}
