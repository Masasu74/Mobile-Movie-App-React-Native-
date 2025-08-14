import { icons } from '@/constants/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
            router.replace('/(tabs)');
        } catch (error: any) {
            console.log('Login error:', error);
            let errorMessage = 'Login failed. Please try again.';
            
            if (error.message) {
                errorMessage = error.message;
            } else if (error.code) {
                switch (error.code) {
                    case 401:
                        errorMessage = 'Invalid email or password.';
                        break;
                    case 409:
                        errorMessage = "Account already exists.";
                        break;
                    default:
                        errorMessage = `Error: ${error.code}`;
                }
            }
            
            Alert.alert('Login Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="bg-primary flex-1 px-10 justify-center">
            <View className="items-center mb-10">
                <Image source={icons.logo} className="w-16 h-12 mb-5" />
                <Text className="text-white text-2xl font-bold">Welcome Back</Text>
            </View>

            <View className="space-y-4">
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
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text className="text-white font-bold text-lg">
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="items-center mt-4"
                    onPress={() => router.push('/signup')}
                >
                    <Text className="text-gray-400">
                        Don&apos;t have an account? <Text className="text-blue-500">Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Login;