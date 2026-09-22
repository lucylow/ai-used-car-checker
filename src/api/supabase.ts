import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const url = (Constants.expoConfig?.extra?.supabaseUrl as string | undefined) ?? '';
const key = (Constants.expoConfig?.extra?.supabaseAnonKey as string | undefined) ?? '';

export const supabase = createClient(url || 'https://placeholder.supabase.co', key || 'public-anon-key', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
