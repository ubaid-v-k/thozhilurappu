import { useState, useRef } from 'react';
import { Image as ImageIcon, Briefcase, Wrench, X, Send, User, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import type { PostType } from '../../types';
import { cn } from '../../utils/cn';

interface CreatePostProps {
    onSubmit: (data: any) => Promise<void>;
    loading?: boolean;
}

const TEMPLATES = [
    { id: 'NORMAL', label: 'Regular Post', icon: User, color: 'text-gray-600', bg: 'bg-gray-100' },
    { id: 'JOB', label: 'Post a Job', icon: Briefcase, color: 'text-primary-600', bg: 'bg-primary-50' },
    { id: 'SERVICE', label: 'Offer Service', icon: Wrench, color: 'text-teal-600', bg: 'bg-teal-50' },
] as const;

export function CreatePost({ onSubmit, loading = false }: CreatePostProps) {
    const { user } = useAuth();
    const [selectedTemplate, setSelectedTemplate] = useState<PostType>('NORMAL');
    const [text, setText] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [extraFields, setExtraFields] = useState<any>({});
    const [showTemplates, setShowTemplates] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleFieldChange = (key: string, value: string) => {
        setExtraFields((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        if (!text && images.length === 0 && selectedTemplate === 'NORMAL') return;

        const data = {
            type: selectedTemplate,
            description: text,
            images,
            ...extraFields
        };

        // For job/service types, use title from extra fields or fallback to truncated text
        if (selectedTemplate !== 'NORMAL' && !data.title) {
            data.title = text.split('\n')[0].substring(0, 50);
        }

        onSubmit(data);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header / Template Selector */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold">
                                {user?.name?.[0] || 'U'}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{user?.name || 'Guest User'}</p>
                        <div className="relative">
                            <button
                                onClick={() => setShowTemplates(!showTemplates)}
                                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                <span>{TEMPLATES.find(t => t.id === selectedTemplate)?.label}</span>
                                <ChevronDown className="h-3 w-3" />
                            </button>

                            {/* Template Dropdown */}
                            {showTemplates && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowTemplates(false)} />
                                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                                        {TEMPLATES.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => {
                                                    setSelectedTemplate(t.id as PostType);
                                                    setShowTemplates(false);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors",
                                                    selectedTemplate === t.id ? "bg-gray-50 font-medium" : "text-gray-600"
                                                )}
                                            >
                                                <div className={cn("p-1.5 rounded-lg", t.bg, t.color)}>
                                                    <t.icon className="h-4 w-4" />
                                                </div>
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {/* Text Area */}
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={
                        selectedTemplate === 'JOB' ? "Describe the job role, requirements, and responsibilities..." :
                            selectedTemplate === 'SERVICE' ? "Describe the services you offer, your experience, and pricing..." :
                                "What's happening? Share a job update or achievement..."
                    }
                    className="w-full min-h-[200px] resize-none border-none focus:ring-0 text-gray-800 placeholder:text-gray-400 text-base p-0 bg-transparent"
                />

                {/* Dynamic Fields for Job/Service */}
                {selectedTemplate !== 'NORMAL' && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="md:col-span-2">
                            <Input
                                placeholder={selectedTemplate === 'JOB' ? "Job Title (e.g. React Developer)" : "Service Title (e.g. Pro Plumbing)"}
                                value={extraFields.title || ''}
                                onChange={(e) => handleFieldChange('title', e.target.value)}
                                className="bg-gray-50 border-gray-200"
                            />
                        </div>

                        <Input
                            placeholder="Location (e.g. Chennai)"
                            value={extraFields.location || ''}
                            onChange={(e) => handleFieldChange('location', e.target.value)}
                            className="bg-gray-50 border-gray-200"
                        />

                        {selectedTemplate === 'JOB' ? (
                            <>
                                <Input
                                    placeholder="Company Name"
                                    value={extraFields.company || ''}
                                    onChange={(e) => handleFieldChange('company', e.target.value)}
                                    className="bg-gray-50 border-gray-200"
                                />
                                <Input
                                    placeholder="Salary (e.g. ₹20k - ₹30k)"
                                    value={extraFields.salary || ''}
                                    onChange={(e) => handleFieldChange('salary', e.target.value)}
                                    className="bg-gray-50 border-gray-200"
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                                    <div className="flex gap-2">
                                        {['Urgent', 'Part-Time', 'Full-Time'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => handleFieldChange('jobType', type)}
                                                className={cn(
                                                    "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                                                    extraFields.jobType === type
                                                        ? "bg-primary-600 text-white border-primary-600"
                                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                                )}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Input
                                    placeholder="Category (e.g. Plumbing)"
                                    value={extraFields.category || ''}
                                    onChange={(e) => handleFieldChange('category', e.target.value)}
                                    className="bg-gray-50 border-gray-200"
                                />
                                <Input
                                    placeholder="Rate (e.g. ₹500/visit)"
                                    value={extraFields.rate || ''}
                                    onChange={(e) => handleFieldChange('rate', e.target.value)}
                                    className="bg-gray-50 border-gray-200"
                                />
                            </>
                        )}
                    </div>
                )}

                {/* Image Previews */}
                {images.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative group rounded-xl overflow-hidden h-24 w-24 border border-gray-200">
                                <img src={img} alt="Preview" className="h-full w-full object-cover" />
                                <button
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-gray-500 hover:text-green-600 hover:bg-green-50"
                        >
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Photo
                        </Button>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading || (!text && images.length === 0 && Object.keys(extraFields).length === 0)}
                        className={cn(
                            "px-6",
                            selectedTemplate === 'JOB' ? "bg-primary-600 hover:bg-primary-700" :
                                selectedTemplate === 'SERVICE' ? "bg-teal-600 hover:bg-teal-700" :
                                    "bg-gray-900 hover:bg-gray-800"
                        )}
                    >
                        {loading ? 'Posting...' : 'Post'}
                        <Send className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
