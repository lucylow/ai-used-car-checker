import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig & { extra: { appName: string; appSlug: string; logoUrl: string } } = {
  name: 'AI Used Car Checker',
  slug: 'ai-used-car-checker',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  icon: './assets/images/icon.png',
  splash: { image: './assets/images/splash-icon.png', resizeMode: 'contain', backgroundColor: '#0B1220' },
  assetBundlePatterns: ['**/*'],
  ios: { bundleIdentifier: 'com.carwise.usedcarchecker' },
  android: { package: 'com.carwise.usedcarchecker', adaptiveIcon: { foregroundImage: './assets/images/android-icon-foreground.png', backgroundColor: '#0B1220' } },
  web: { favicon: './assets/images/favicon.png' },
  plugins: ['expo-font'],
  extra: {
    appName: 'AI Used Car Checker',
    appSlug: 'ai-used-car-checker',
    logoUrl: '/manus-storage/carwise-icon_41b3cf23.png'
  }
};

export default config;
