import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'ai.protocol.durin',
  appName: 'Durin',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: false
    }
  }
}

export default config
