import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { icons } from '@/constants/icons';
import { Image } from 'react-native';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const router = useRouter();

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await signUp(email, password, name);
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="bg-primary flex-1 px-10 justify-center">
            <View className="items-center mb-10">
                <Image source={icons.logo} className="w-16 h-12 mb-5" />
                <Text className="text-white text-2xl font-bold">Create Account</Text>
            </View>

            <View className="space-y-4">
                <TextInput
                    className="bg-gray-800 text-white p-4 rounded-lg"
                    placeholder="Full Name"
                    placeholderTextColor="#666"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    className="bg-gray-800 text-white p-4 rounded-lg"
                    placeholder="Email"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    className="bg-gray-800 text-white p-4 rounded-lg"
                    placeholder="Password"
                    placeholderTextColor="#666"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    className="bg-blue-600 p-4 rounded-lg items-center"
                    onPress={handleSignup}
                    disabled={loading}
                >
                    <Text className="text-white font-bold text-lg">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="items-center mt-4"
                    onPress={() => router.push('/login')}
                >
                    <Text className="text-gray-400">
                        Already have an account? <Text className="text-blue-500">Sign In</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Signup;