import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'in.gov.doca.oniongrader',
  appName: 'Onion Quality Grader',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FDF8F0',
      androidSplashResourceName: 'splash',
      showSpinner: false
    }
  }
};

export default config;
