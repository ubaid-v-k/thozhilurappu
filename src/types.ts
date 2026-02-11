export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    bio?: string;
    location?: string;
    title?: string;
    skills?: string[];
    verified?: boolean;
}

export type PostType = 'JOB' | 'SERVICE' | 'NORMAL';

export interface Group {
    id: string;
    name: string;
    description: string;
    image?: string;
    banner?: string;
    members: number; // For mock simplicity
    joined?: boolean; // For current user context
}

export interface BasePost {
    id: number | string;
    title: string;
    description?: string;
    location: string;
    postedAt: string;
    verified?: boolean;
    images?: string[]; // Array of image URLs
    type: PostType;
    user?: User; // Author
    group?: Group; // Optional group link
}

export interface JobPost extends BasePost {
    type: 'JOB';
    company: string;
    jobType: string; // Full-time, etc.
    salary: string;
}

export interface ServicePost extends BasePost {
    type: 'SERVICE';
    rate: string; // e.g. "₹500/hr"
    category: string; // e.g. "Plumbing"
    availability?: string; // e.g. "Weekends"
}

export interface NormalPost extends BasePost {
    type: 'NORMAL';
    tags?: string[];
}

export type Post = JobPost | ServicePost | NormalPost;
