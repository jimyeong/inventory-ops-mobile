# Firebase Google Authentication Setup Instructions

## Android Setup

The Android app is already configured with the necessary Firebase setup. To run the app:

```sh
npm run android
```

## iOS Setup

For iOS, you'll need to:

1. Add the GoogleService-Info.plist to your Xcode project:
   - Open the Xcode project in the `ios` folder
   - In the Navigator panel, right-click on your project's name and select "Add Files to [project name]"
   - Navigate to `ios/owlverload_analytics/Firebase/GoogleService-Info.plist`, select it, and click "Add"
   - Make sure the file is added to your app's target

2. Add a Run Script Phase to copy the GoogleService-Info.plist file:
   - In Xcode, click on your project in the Navigator panel
   - Select your app's target
   - Go to "Build Phases" tab
   - Click the "+" button at the top left of the panel and select "New Run Script Phase"
   - Expand the new "Run Script" section
   - Enter this script: `"${SRCROOT}/copy_google_services.sh"`

3. Install CocoaPods dependencies:

```sh
cd ios
bundle install
bundle exec pod install
```

4. Run the app:

```sh
npm run ios
```

## Usage

The app will present a login screen if no user is authenticated. After successful Google sign-in, the home screen will be displayed showing the user's profile information and a sign-out button.

## Firebase Console Setup (Already Completed)

The Firebase project has already been set up with:

1. Google authentication enabled
2. Android app registered with SHA-1 certificate fingerprint
3. iOS app registered with bundle ID

If you need to make changes to the Firebase configuration, you can access the Firebase console at: https://console.firebase.google.com/

