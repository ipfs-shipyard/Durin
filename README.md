![image](https://user-images.githubusercontent.com/1844554/208213758-c967debb-2097-4967-9790-58545e73bd6f.png)

## Availability

[<img src="https://user-images.githubusercontent.com/1844554/208214016-4cdbe4e4-f7d6-4ad6-bfda-44d7d5e4ee6d.png" height="50">](https://apps.apple.com/us/app/durin/id1613391995)
[<img src="https://user-images.githubusercontent.com/1844554/208214017-ce2b9ed9-2f25-4d07-b6c6-5a7a41bc2dfe.png" height="50">](https://play.google.com/store/apps/details?id=ai.protocol.durin)

A new way to read and share with IPFS on your mobile device

## Project Details

Created using [ionic](https://ionicframework.com/docs/cli/commands/start).

- Handles `ipfs://` URLs and kicks them to dweb.link
  - `ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/wiki/` to `https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.dweb.link/wiki/`
  - [Test Link](ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/wiki/)
- Handles `ipns://` URLs and kicks them to dweb.link
  - `ipns://en.wikipedia-on-ipfs.org/wiki/` to `https://en-wikipedia--on--ipfs-org.ipns.dweb.link/wiki/`
  - [Test Link](ipns://en.wikipedia-on-ipfs.org/wiki/)

## Installation

- Make sure you have Xcode installed: https://apps.apple.com/us/app/xcode/id497799835?mt=12
- Copy `.env` to a new file `.env.local` - replace the token with one from https://web3.storage
- Run the following commands:

```sh
xcode-select --install # Install Command Line Tools if you haven't already.
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer

brew install --cask android-studio
sudo gem install cocoapods
npm i -g @ionic/cli
npm install
npm run sync
npx ionic capacitor run ios --livereload # Opens and runs the iOS app - you will pick which device to run it on. If you have a physical device plugged in, you can select that as well.
```

Then add `export JAVA_HOME=/Applications/Android\ Studio.app/Contents/jre/Contents/Home/` to your `.bashrc` or `.zshrc`.

### Apple Silicon

If you are using Apple silicon, you will need to follow this first: https://armen-mkrtchian.medium.com/run-cocoapods-on-apple-silicon-and-macos-big-sur-developer-transition-kit-b62acffc1387

## Testing

When making changes or running for the first time, run `npm run sync` to update the native applications.

### iOS

To test on iOS, run `npm run ios` which will open XCode, then using the UI run it in an emulator.

Note: Firefox and Chrome for iOS do not support custom protocols being typed into the address bar. Clicking links should work fine, however.

### Android

To test on Android, run `npm run android` which will open the studio, then using the UI run it in an emulator.

Note: Android chrome [does not support custom protocols](https://developer.chrome.com/docs/multidevice/android/intents/) - you will need to type `intent://durin/CID_GOES_HERE#Intent;scheme=ipfs;end`

## Credits

Made with :heart: by [Justice Engineering](https://justice.engineering) & [Trigram](https://www.trigram.co/)
