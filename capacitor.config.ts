import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'tasks-frontend',
  webDir: 'out',
  server: {
    iosScheme: 'cdvfile',
    androidScheme: 'file',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#fcd700',
      androidSplashResourceName: 'splash',
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
