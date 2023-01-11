import { CapacitorConfig } from '@capacitor/cli'
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard'

/// <reference types="@capacitor/splash-screen" />
/// <reference types="@capacitor/keyboard" />
/// <reference types="@awesome-cordova-plugins/clipboard" />

const config: CapacitorConfig = {
  appId: 'ai.protocol.durin',
  appName: 'Durin',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: false
    },
    Clipboard: {},
    Keyboard: {
      style: KeyboardStyle.Dark,
      resize: KeyboardResize.None
    }
  }
}

export default config
