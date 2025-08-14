import { View, Text, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { icons } from '@/constants/icons';
import { useAuth } from '@/contexts/AuthContext';
import { getSavedMovies, removeSavedMovie } from '@/services/appwrite';
import MovieCard from '@/components/MovieCard';

const Saved = () => {
    const { user } = useAuth();
    const [savedMovies, setSavedMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadSavedMovies();
        }
    }, [user]);

    const loadSavedMovies = async () => {
        try {
            const movies = await getSavedMovies(user.$id);
            setSavedMovies(movies);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMovie = async (documentId: string) => {
        try {
            await removeSavedMovie(documentId);
            await loadSavedMovies(); // Reload the list
        } catch (error) {
            Alert.alert('Error', 'Failed to remove movie');
        }
    };

    if (!user) {
        return (
            <View className='bg-primary flex-1 px-10 justify-center items-center'>
                <Image source={icons.person} className="size-10 mb-4" tintColor="#666" />
                <Text className='text-gray-500 text-base mb-4'>Please sign in to view saved movies</Text>
            </View>
        );
    }

    return (
        <View className='bg-primary flex-1 px-5'>
            <Text className='text-xl text-white font-bold mt-20 mb-5'>Saved Movies</Text>
            
            {loading ? (
                <View className='flex-1 justify-center items-center'>
                    <Text className='text-gray-500'>Loading...</Text>
                </View>
            ) : savedMovies.length === 0 ? (
                <View className='flex-1 justify-center items-center'>
                    <Image source={icons.save} className="size-10 mb-4" tintColor="#666" />
                    <Text className='text-gray-500 text-base'>No saved movies yet</Text>
                </View>
            ) : (
                <FlatList
                    data={savedMovies}
                    renderItem={({ item }) => (
                        <View className="mb-4">
                            <MovieCard {...item} />
                            <TouchableOpacity
                                className="bg-red-600 p-2 rounded-lg mt-2"
                                onPress={() => handleRemoveMovie(item.$id)}
                            >
                                <Text className="text-white text-center">Remove</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item) => item.$id}
                    numColumns={3}
                    columnWrapperStyle={{
                        justifyContent: "flex-start",
                        gap: 20,
                        paddingRight: 5,
                        marginBottom: 10,
                    }}
                />
            )}
        </View>
    );
};

export default Saved;