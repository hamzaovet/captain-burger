import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.captainburger.app',
  appName: 'كابتن برجر',
  webDir: 'public',
  server: {
    url: 'https://captain-burger-five.vercel.app',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#F5EBDC',
  },
};

export default config;
