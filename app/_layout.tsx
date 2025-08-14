import { AuthProvider } from '@/contexts/AuthContext';
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import './globals.css';
export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar hidden={true}/>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{headerShown:false}}
        />
        <Stack.Screen
          name="movies/[id]"
          options={{headerShown:false}}
        />
        <Stack.Screen
          name="login"
          options={{headerShown:false}}
        />
        <Stack.Screen
          name="signup"
          options={{headerShown:false}}
        />
      </Stack>
    </AuthProvider>
  )
}
