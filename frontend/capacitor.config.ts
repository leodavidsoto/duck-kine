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
    allowNavigation: ['api.duckkine.cl', '*.duckkine.cl'],
  },
};

export default config;
