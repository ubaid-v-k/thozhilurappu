import { createContext, useContext, useState, type ReactNode } from 'react';
import type { JobPost, ServicePost, NormalPost, Post, PostType, Group } from '../types';

const MOCK_GROUPS: Group[] = [
    {
        id: 'g1',
        name: 'Kerala Plumbers Association',
        description: 'A community for professional plumbers in Kerala to share work and tips.',
        members: 1250,
        image: 'https://images.unsplash.com/photo-1581578731117-104f2a417954?auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 'g2',
        name: 'IT Jobs Chennai',
        description: 'Latest tech job openings and discussions for Chennai techies.',
        members: 5000,
        image: 'https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&w=200&q=80',
        joined: true
    },
    {
        id: 'g3',
        name: 'Construction Workers Union',
        description: 'Rights, safety, and job opportunities for construction workers.',
        members: 3200,
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=200&q=80'
    }
];

const MOCK_NORMAL_POSTS: NormalPost[] = [
    {
        id: 201,
        type: 'NORMAL',
        title: "Just completed my plumbing certification!",
        description: "Happy to announce that I am now a certified plumber. Looking forward to taking up new projects in Chennai.",
        location: "Chennai, TN",
        postedAt: "1h ago",
        verified: true,
        images: ["https://images.unsplash.com/photo-1581578731117-104f2a417954?auto=format&fit=crop&w=800&q=80"],
        tags: ["certification", "plumbing"],
        user: {
            id: "u1", name: "Ravi Kumar", email: "ravi@ex.com", role: "worker",
            avatar: "https://ui-avatars.com/api/?name=Ravi+Kumar&background=0D9488&color=fff"
        },
        group: MOCK_GROUPS[0]
    },
    {
        id: 202,
        type: 'NORMAL',
        title: "Looking for part-time delivery jobs",
        description: "I have a bike and valid license. Available for evening shifts in Kochi area.",
        location: "Kochi, KL",
        postedAt: "3h ago",
        images: [],
        tags: ["jobsearch", "delivery"],
        user: {
            id: "u2", name: "Arun V", email: "arun@ex.com", role: "seeker",
            avatar: "https://ui-avatars.com/api/?name=Arun+V&background=random"
        }
    }
];

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
        description: "Looking for an expert React developer...",
        group: MOCK_GROUPS[1]
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
        description: "Looking for daily wage workers for construction site. Food provided.",
        group: MOCK_GROUPS[2]
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
        },
        group: MOCK_GROUPS[0]
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
    groups: Group[];
    addPost: (post: Post) => void;
    getPostsByType: (type: PostType | 'ALL') => Post[];
    createGroup: (group: Omit<Group, 'id' | 'members'>) => void;
    joinGroup: (groupId: string) => void;
    getPostById: (id: string) => Post | undefined;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
    const [posts, setPosts] = useState<Post[]>([...MOCK_NORMAL_POSTS, ...MOCK_JOBS, ...MOCK_SERVICES].sort(() => Math.random() - 0.5));
    const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);

    const addPost = (newPost: Post) => {
        setPosts(prev => [newPost, ...prev]);
    };

    const getPostsByType = (type: PostType | 'ALL') => {
        if (type === 'ALL') return posts;
        return posts.filter(p => p.type === type);
    };

    const createGroup = (newGroupData: Omit<Group, 'id' | 'members'>) => {
        const newGroup: Group = {
            ...newGroupData,
            id: `g${Date.now()}`,
            members: 1,
            joined: true
        };
        setGroups(prev => [...prev, newGroup]);
    };

    const joinGroup = (groupId: string) => {
        setGroups(prev => prev.map(g =>
            g.id === groupId
                ? { ...g, joined: !g.joined, members: g.joined ? g.members - 1 : g.members + 1 }
                : g
        ));
    };

    const getPostById = (id: string) => {
        return posts.find(p => p.id.toString() === id);
    };

    return (
        <PostsContext.Provider value={{ posts, groups, addPost, getPostsByType, createGroup, joinGroup, getPostById }}>
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
