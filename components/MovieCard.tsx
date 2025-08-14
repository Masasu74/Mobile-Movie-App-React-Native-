import { icons } from '@/constants/icons';
import { useAuth } from '@/contexts/AuthContext';
import { saveMovie } from '@/services/appwrite';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const MovieCard = ({id, poster_path, title, vote_average, release_date}: {
  id: number;
  poster_path: string;
  title: string;
  vote_average: number;
  release_date: string;
}) => {
  let user = null;
  
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    // AuthProvider not available, user is not authenticated
    user = null;
  }

  const handleSaveMovie = async () => {
    if (!user) {
      // Show login prompt or navigate to login
      return;
    }

    try {
      await saveMovie(user.$id, {
        id,
        poster_path,
        title,
        vote_average,
        release_date,
        adult: false,
        backdrop_path: '',
        genre_ids: [],
        original_language: 'en',
        original_title: title,
        overview: '',
        popularity: 0,
        video: false,
        vote_count: 0
      });
      // You could add a toast notification here
    } catch (error) {
      console.log('Error saving movie:', error);
    }
  };

  return (
    <View className='w-[30%]'>
      <Link href={`/movies/${id}`} asChild>
        <TouchableOpacity>
          <Image
            source={{
              uri: poster_path 
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : 'https://placehold.co/600x400/1a1a1a/ffffff.png'
            }}
            className='w-full h-52 rounded-lg'
            resizeMode='cover'
          />
        </TouchableOpacity>
      </Link>

      <Text className='text-sm font-bold text-white mt-2' numberOfLines={1}>{title}</Text>
      
      <View className='flex-row items-center justify-between mt-2'>
        <View className='flex-row items-center gap-x-1'>
          <Image source={icons.star} className='size-4'/>
          <Text className='text-xs text-white font-bold uppercase'>{Math.round(vote_average/2)}</Text>
        </View>
        
        {user && (
          <TouchableOpacity onPress={handleSaveMovie}>
            <Image source={icons.save} className='size-4' tintColor="#fff"/>
          </TouchableOpacity>
        )}
      </View>

      <Text className='text-xs text-light-300 font-medium mt-1'>
        {release_date?.split('-')[0]}
      </Text>
    </View>
  )
} 

export default MovieCard