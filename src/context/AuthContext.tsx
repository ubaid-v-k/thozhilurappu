import React, { createContext, useContext, useState, useEffect } from "react";
import AuthModal from "../components/auth/AuthModal";
import type { User } from "../types";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, userData: User) => void;
    register: (userData: User) => void;
    logout: () => void;
    updateProfile: (data: Partial<User>) => void;
    loading: boolean;
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    requireAuth: (action: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token === 'mock-token' && storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse user data", e);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } else if (token === 'mock-token') {
                // Fallback if token exists but no user data (dev/reset state)
                setUser({
                    id: "1",
                    name: "Test User",
                    email: "test@example.com",
                    role: "jobseeker",
                    avatar: "https://ui-avatars.com/api/?name=Test+User&background=random",
                    title: "Full Stack Developer",
                    location: "Chennai, India",
                    verified: true
                });
            }
            else if (token) {
                // If there's a real token (from old backend), clear it as it's invalid now
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthModalOpen(false);
    };

    const register = (userData: User) => {
        const token = 'mock-token';
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthModalOpen(false);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateProfile = (data: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    const requireAuth = (action: () => void) => {
        if (user) {
            action();
        } else {
            openAuthModal();
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            updateProfile,
            loading,
            isAuthModalOpen,
            openAuthModal,
            closeAuthModal,
            requireAuth
        }}>
            {children}
            <AuthModal />
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
