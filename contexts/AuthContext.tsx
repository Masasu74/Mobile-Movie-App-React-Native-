import { createAccount, getCurrentUser, loginAccount, logoutAccount } from '@/services/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: any;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            await loginAccount(email, password);
            await checkUser();
        } catch (error: any) {
            console.log('Sign in error:', error);
            
            // Provide more specific error messages
            if (error.code === 401) {
                throw new Error('Invalid email or password. Please check your credentials.');
            } else if (error.code === 404) {
                throw new Error('Account not found. Please check your email or sign up.');
            } else if (error.message) {
                throw new Error(error.message);
            } else {
                throw new Error('Sign in failed. Please try again.');
            }
        }
    };

    const signUp = async (email: string, password: string, name: string) => {
        try {
            await createAccount(email, password, name);
            await checkUser();
        } catch (error: any) {
            console.log('Sign up error:', error);
            
            // Provide more specific error messages
            if (error.code === 409) {
                throw new Error('An account with this email already exists. Please sign in instead.');
            } else if (error.code === 400) {
                throw new Error('Invalid input. Please check your email and password.');
            } else if (error.message) {
                throw new Error(error.message);
            } else {
                throw new Error('Sign up failed. Please try again.');
            }
        }
    };

    const signOut = async () => {
        try {
            await logoutAccount();
            setUser(null);
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};