import "../global.css";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../../drizzle/migrations'
import { db } from '../database/db'
import { seedDatabase } from '@/database/seed/seed';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const { success: migrationsLoaded, error: migrationError } = useMigrations(db, migrations);

  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Gerenciamento de erros de migração ou fontes [3]
  useEffect(() => {
    if (migrationError || fontError) throw migrationError || fontError;
  }, [migrationError, fontError]);

  useEffect(() => {
    if (migrationsLoaded) {
      seedDatabase(); // Executa a lógica de popular o banco se estiver vazio
    }
  }, [migrationsLoaded]);


  // 2. Só esconde a Splash Screen quando as fontes E as migrações estiverem prontas
  useEffect(() => {
    if (fontsLoaded && migrationsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, migrationsLoaded]);

  if (!fontsLoaded || !migrationsLoaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {

  return (
    
      <Stack
      screenOptions={{ headerShown: false }} 
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    
  );
}
