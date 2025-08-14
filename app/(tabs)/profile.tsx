import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { icons } from '@/constants/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

const Profile = () => {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace('/login');
        } catch (error) {
            Alert.alert('Error', 'Failed to sign out');
        }
    };

    if (!user) {
        return (
            <View className='bg-primary flex-1 px-10 justify-center items-center'>
                <Image source={icons.person} className="size-10 mb-4" tintColor="#666" />
                <Text className='text-gray-500 text-base mb-4'>Please sign in to view profile</Text>
                <TouchableOpacity
                    className="bg-blue-600 p-4 rounded-lg"
                    onPress={() => router.push('/login')}
                >
                    <Text className="text-white font-bold">Sign In</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className='bg-primary flex-1 px-10'>
            <View className='flex-1 justify-center items-center'>
                <Image source={icons.person} className="size-20 mb-6" tintColor="#fff" />
                
                <Text className='text-white text-2xl font-bold mb-2'>{user.name}</Text>
                <Text className='text-gray-400 text-base mb-8'>{user.email}</Text>

                <View className="w-full space-y-4">
                    <TouchableOpacity
                        className="bg-gray-800 p-4 rounded-lg"
                        onPress={() => router.push('/saved')}
                    >
                        <Text className="text-white text-center font-semibold">View Saved Movies</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-red-600 p-4 rounded-lg"
                        onPress={handleSignOut}
                    >
                        <Text className="text-white text-center font-semibold">Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Profile; 