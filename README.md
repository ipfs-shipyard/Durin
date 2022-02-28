# Durin

Native mobile apps for share actions on iOS and Android

## Project Details

Created using [ionic](https://ionicframework.com/docs/cli/commands/start).

- Handles `ipfs://` URLs and kicks them to dweb.link
  - `ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/wiki/` to `https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.dweb.link/wiki/`
- Handles `ipns://` URLs and kicks them to dweb.link
  - `ipns://en.wikipedia-on-ipfs.org/wiki/` to `https://en-wikipedia--on--ipfs-org.ipns.dweb.link/wiki/`

## Installation

First make sure you have Xcode installed: https://apps.apple.com/us/app/xcode/id497799835?mt=12

- Copy `.env` to a new file `.env.local` - replace the token with one from https://web3.storage
- Run the following commands:

```sh
xcode-select --install # Install Command Line Tools if you haven't already.
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo gem install cocoapods
npm install
npm run sync
npx ionic capacitor run ios --livereload # Opens and runs the iOS app - you will pick which device to run it on. If you have a physical device plugged in, you can select that as well.
```

### Apple Silicon

If you are using Apple silicon, you will need to follow this first: https://armen-mkrtchian.medium.com/run-cocoapods-on-apple-silicon-and-macos-big-sur-developer-transition-kit-b62acffc1387

## Testing

When making changes or running for the first time, run `npm run sync` to update the native applications.

### iOS

To test on iOS, run `npm run xcode` which will open XCode, then using the UI run it in an emulator.