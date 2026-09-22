import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'CarWise',
  slug: 'carwise',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'carwise',
  userInterfaceStyle: 'automatic',
  icon: './assets/images/icon.png',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0B1220',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.carwise.app',
    buildNumber: '1',
    infoPlist: {
      NSCameraUsageDescription:
        'CarWise uses your camera to photograph vehicles during inspection.',
      NSPhotoLibraryUsageDescription:
        'CarWise needs access to your photos to attach evidence to inspections.',
      NSMicrophoneUsageDescription:
        'CarWise records voice notes to document vehicle observations.',
      NSLocationWhenInUseUsageDescription:
        'CarWise uses your location to find local market pricing.',
      NSFaceIDUsageDescription:
        'CarWise uses Face ID to secure your inspection reports.',
      ITSAppUsesNonExemptEncryption: false,
    },
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryFileTimestamp',
          NSPrivacyAccessedAPITypeReasons: ['C617.1'],
        },
      ],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundColor: '#0B1220',
    },
    package: 'com.carwise.app',
    permissions: ['CAMERA', 'RECORD_AUDIO', 'ACCESS_FINE_LOCATION'],
  },
  plugins: [
    'expo-secure-store',
    'expo-notifications',
    ['expo-camera', { cameraPermission: 'Allow CarWise to use camera.' }],
    ['expo-image-picker', { photosPermission: 'Allow CarWise to access photos.' }],
    ['expo-build-properties', { ios: { useFrameworks: 'static' } }],
  ],
  extra: {
    eas: { projectId: process.env.EAS_PROJECT_ID ?? 'YOUR_EAS_PROJECT_ID' },
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    revenueCatApiKey: process.env.REVENUECAT_IOS_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    sentryDsn: process.env.SENTRY_DSN,
  },
});
