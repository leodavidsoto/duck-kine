import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cl.duckkinesiologia.app',
  appName: 'Duck Kinesiologia',
  webDir: 'out',
  android: {
    allowMixedContent: true,
  },
  server: {
    androidScheme: 'https',
    allowNavigation: ['api.duckkine.cl', '*.duckkine.cl', 'backend-production-1a1b7.up.railway.app'],
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
