//track the searches made by user
import { Client, Databases, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_MOVIES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_COLLECTION_ID!;

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    try {


        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', query)
        ])

        if (result.documents.length > 0) {
            const existingMovie = result.documents[0];
            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1
                }
            )
        } else {
            const documentId = `search_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
            await database.createDocument(DATABASE_ID, COLLECTION_ID, documentId, {
                searchTerm: query,
                movie_id: movie.id,
                count: 1,
                title: movie.title,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }

    } catch (error) {
        console.log(error);
        throw error;
    }

    //check if a record of that search has already been stored
    // if a document is found increment the searchCount field
    // if no document is found
    //create a n ew document in Appwrite database -> 1

}

export const getTrendingMovies=async():Promise<TrendingMovie[] | undefined>=>{
    try {
 const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count'),
        ])

        return result.documents as unknown as TrendingMovie[];
        
    } catch (error) {
        console.log(error);
        return undefined
        
    }
}


// Add these functions to your existing appwrite.ts file

export const saveMovie = async (userId: string, movie: Movie) => {
    try {
        const documentId = `saved_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const result = await database.createDocument(
            DATABASE_ID, 
            SAVED_MOVIES_COLLECTION_ID,
            documentId,
            {
                userId: userId,
                movieId: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                vote_average: movie.vote_average
            }
        );
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getSavedMovies = async (userId: string) => {
    try {
        const result = await database.listDocuments(
            DATABASE_ID, 
            SAVED_MOVIES_COLLECTION_ID,
            [Query.equal('userId', userId)]
        );
        return result.documents;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const removeSavedMovie = async (documentId: string) => {
    try {
        await database.deleteDocument(DATABASE_ID, SAVED_MOVIES_COLLECTION_ID, documentId);
    } catch (error) {
        console.log(error);
        throw error;
    }
};