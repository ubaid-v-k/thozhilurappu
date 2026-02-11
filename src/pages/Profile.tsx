import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { MapPin, Briefcase, Calendar, Edit2, LogOut, CheckCircle2, Camera, X, Save, Users, Plus } from "lucide-react";
import { usePosts } from "../context/PostsContext";

export default function Profile() {
    const { user, logout, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({});

    if (!user) {
        return <div className="p-8 text-center">Please login to view profile.</div>;
    }

    const handleEdit = () => {
        setFormData({
            name: user.name,
            title: user.title,
            location: user.location,
            bio: user.bio,
            avatar: user.avatar
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        updateProfile(formData);
        setIsEditing(false);
    };

    const handleImageChange = () => {
        // Mock image change
        const newAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || user.name)}&background=${Math.floor(Math.random() * 16777215).toString(16)}`;
        setFormData({ ...formData, avatar: newAvatar });
    };

    const { createGroup } = usePosts();
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', description: '', image: '' });

    const handleCreateGroup = () => {
        if (!newGroup.name || !newGroup.description) return;
        createGroup({
            name: newGroup.name,
            description: newGroup.description,
            image: newGroup.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(newGroup.name)}&background=random`
        });
        setShowCreateGroup(false);
        setNewGroup({ name: '', description: '', image: '' });
        alert("Group created successfully! You are now a member.");
    };

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-4rem)] pb-20 md:pb-8">
            {/* Cover Image */}
            <div className="h-32 md:h-48 bg-gradient-to-r from-primary-600 to-secondary-600 relative">
                {isEditing && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Button variant="ghost" className="text-white hover:bg-white/20">
                            <Camera className="h-6 w-6 mr-2" /> Change Cover
                        </Button>
                    </div>
                )}
            </div>

            {/* Profile Info */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                        <div className="relative group">
                            <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md relative">
                                <img
                                    src={isEditing ? formData.avatar : user.avatar}
                                    alt={user.name}
                                    className="h-full w-full object-cover"
                                />
                                {isEditing && (
                                    <div
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity"
                                        onClick={handleImageChange}
                                    >
                                        <Camera className="h-8 w-8 text-white opacity-80" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1 border-2 border-white">
                                <CheckCircle2 className="h-3 w-3 text-white" />
                            </div>
                        </div>

                        <div className="flex-1 space-y-2 mb-2 w-full">
                            <div>
                                {isEditing ? (
                                    <div className="space-y-3 max-w-md">
                                        <Input
                                            value={formData.name || ""}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Full Name"
                                            label="Full Name"
                                        />
                                        <Input
                                            value={formData.title || ""}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Professional Title"
                                            label="Title (e.g. UX Designer)"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                            {user.name}
                                            {user.verified && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100 font-medium">Verified</span>}
                                        </h1>
                                        <p className="text-gray-600">{user.title || user.role}</p>
                                    </>
                                )}
                            </div>

                            {!isEditing && (
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    {user.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {user.location}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Briefcase className="h-4 w-4" />
                                        Member
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Joined Recently
                                    </div>
                                </div>
                            )}

                            {isEditing && (
                                <div className="mt-2">
                                    <Input
                                        value={formData.location || ""}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="Location (e.g. Chennai)"
                                        label="Location"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 w-full md:w-auto self-start mt-4 md:mt-0">
                            {isEditing ? (
                                <>
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                                        <X className="h-4 w-4 mr-2" /> Cancel
                                    </Button>
                                    <Button onClick={handleSave} className="bg-primary-600 text-white">
                                        <Save className="h-4 w-4 mr-2" /> Save Changes
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline" className="flex-1 md:flex-none" onClick={handleEdit}>
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                    <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
                                        <LogOut className="h-5 w-5" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Bio & Skills */}
                    <div className="mt-8 grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                            <h3 className="font-semibold text-gray-900">About</h3>
                            {isEditing ? (
                                <textarea
                                    className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Tell us about yourself..."
                                    value={formData.bio || ""}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                />
                            ) : (
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                    {user.bio || "No bio added yet."}
                                </p>
                            )}
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {(user.skills || ['React', 'JavaScript']).map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-gray-200 mb-6">
                    {['Activity', 'Jobs', 'Saved'].map((tab, i) => (
                        <button
                            key={tab}
                            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${i === 0 ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content Feed (Placeholder) */}
                <div className="space-y-4">
                    <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500">
                        <p>No recent activity.</p>
                        <Button variant="link" className="text-primary-600 mt-2">Browse Jobs</Button>
                    </div>
                </div>
            </div>

            {/* Create Group Modal/Section */}
            {showCreateGroup && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Create a New Group</h2>
                            <button onClick={() => setShowCreateGroup(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                                <Input
                                    placeholder="e.g. Kerala Electricians"
                                    value={newGroup.name}
                                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 min-h-[100px]"
                                    placeholder="What is this group about?"
                                    value={newGroup.description}
                                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                                />
                            </div>
                            <Button className="w-full bg-primary-600 hover:bg-primary-700" onClick={handleCreateGroup}>
                                Create Group
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Action Button for Create Group (or placed elsewhere) */}
            <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-30">
                <Button
                    className="rounded-full shadow-lg h-14 w-14 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center"
                    onClick={() => setShowCreateGroup(true)}
                    title="Create Group"
                >
                    <Users className="h-6 w-6" />
                    <span className="sr-only">Create Group</span>
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                        <Plus className="h-4 w-4 text-indigo-600" />
                    </div>
                </Button>
            </div>
        </div>
    );
}
