import { CapacitorConfig } from '@capacitor/cli'
import { KeyboardResize } from '@capacitor/keyboard'

const config: CapacitorConfig = {
  appId: 'ai.protocol.durin',
  appName: 'Durin',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: false
    },
    Keyboard: {
      style: 'dark',
      resize: 'none' as KeyboardResize
    }
  }
}

export default config
