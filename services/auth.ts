import { Account, Client } from "react-native-appwrite";

// Ensure environment variables are loaded
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';

if (!PROJECT_ID) {
    console.error('EXPO_PUBLIC_APPWRITE_PROJECT_ID is not defined');
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID || '');

const account = new Account(client);

export const createAccount = async (email: string, password: string, name: string) => {
    try {
        // First attempt: Let Appwrite generate the user ID automatically
        const response = await account.create(
            'unique()', // Use Appwrite's unique() function to generate a valid ID
            email,
            password,
            name
        );
        // After creating account, create a session
        await account.createSession(email, password);
        return response;
    } catch (error: any) {
        console.log('Create account error:', error);
        
        // If the first attempt fails, try with a simpler approach
        if (error.code === 400 || error.message?.includes('userId')) {
            try {
                console.log('Retrying with alternative user ID generation...');
                // Generate a simple, valid user ID
                const simpleId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
                const response = await account.create(
                    simpleId,
                    email,
                    password,
                    name
                );
                await account.createSession(email, password);
                return response;
            } catch (retryError) {
                console.log('Retry failed:', retryError);
                throw retryError;
            }
        }
        
        throw error;
    }
};

export const loginAccount = async (email: string, password: string) => {
    try {
        const response = await account.createSession(email, password);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const logoutAccount = async () => {
    try {
        const response = await account.deleteSessions();
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await account.get();
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
};