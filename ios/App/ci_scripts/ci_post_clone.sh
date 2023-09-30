 #!/bin/sh

# fail if any command fails

echo "🧩 Stage: Post-clone is activated .... "

set -e
# debug log
set -x

# Install dependencies using Homebrew. This is MUST! Do not delete.
brew install node cocoapods fastlane

 # Install npm and pods dependencies
cd ../../../ && npm install && npm run sync ios

echo "🎯 Stage: Post-clone is done .... "

exit 0