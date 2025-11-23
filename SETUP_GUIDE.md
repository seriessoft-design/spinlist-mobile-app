# Spinlist React Native App - Setup Guide

Complete guide to set up, run, and deploy the Spinlist mobile app.

---

## 📋 Prerequisites

### Required Software:
- **Node.js** 18+ and npm
- **React Native CLI** (`npm install -g react-native-cli`)
- **Xcode** 14+ (for iOS development on Mac)
- **Android Studio** (for Android development)
- **CocoaPods** (for iOS dependencies: `sudo gem install cocoapods`)

### Required Accounts:
- ✅ Firebase account (already configured)
- ✅ AdMob account (already configured)
- ✅ RevenueCat account (Android ready, iOS needs P8 key)
- Apple Developer account (for iOS deployment)
- Google Play Console account (for Android deployment)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd SpinlistApp
npm install
```

### 2. Install iOS Dependencies (Mac only)

```bash
cd ios
pod install
cd ..
```

### 3. Configure Firebase

#### Android Configuration:
1. Download `google-services.json` from Firebase Console:
   - Go to: https://console.firebase.google.com/project/spinlist-d8597/settings/general
   - Select "Android Spinlist" app
   - Click "Download google-services.json"
2. Place file in: `android/app/google-services.json`

#### iOS Configuration:
1. Download `GoogleService-Info.plist` from Firebase Console:
   - Go to: https://console.firebase.google.com/project/spinlist-d8597/settings/general
   - Select "iOS Spinlist" app
   - Click "Download GoogleService-Info.plist"
2. Place file in: `ios/SpinlistApp/GoogleService-Info.plist`
3. Add to Xcode project:
   - Open `ios/SpinlistApp.xcworkspace` in Xcode
   - Drag `GoogleService-Info.plist` into project navigator
   - Ensure "Copy items if needed" is checked

### 4. Update Configuration

Edit `src/constants/config.ts` and update Firebase API keys:

```typescript
export const FIREBASE_CONFIG = {
  ios: {
    apiKey: 'YOUR_IOS_API_KEY', // From GoogleService-Info.plist
    // ... other fields
  },
  android: {
    apiKey: 'YOUR_ANDROID_API_KEY', // From google-services.json
    // ... other fields
  },
};
```

### 5. Run the App

#### iOS (Mac only):
```bash
npx react-native run-ios
```

Or open in Xcode:
```bash
open ios/SpinlistApp.xcworkspace
```

#### Android:
```bash
npx react-native run-android
```

---

## 🔧 Configuration Details

### AdMob Setup

AdMob is already configured with your account IDs in `src/constants/config.ts`:

**iOS:**
- App ID: `ca-app-pub-7913011400514913~1290888174`
- Banner: `ca-app-pub-7913011400514913/5965340792`
- Interstitial: `ca-app-pub-7913011400514913/4652259123`

**Android:**
- App ID: `ca-app-pub-7913011400514913~5038561494`
- Banner: `ca-app-pub-7913011400514913/3802211889`
- Interstitial: `ca-app-pub-7913011400514913/8307706756`

**Test Mode:**
- Set `USE_TEST_ADS = true` in `src/constants/config.ts` for development
- Test ads will show instead of real ads

### RevenueCat Setup

**Android:** Already configured ✅
- API Key: `test_HumBUryPmujsEfxFoWN1YaquAd1`

**iOS:** Needs Apple P8 key
1. Get P8 key from Apple Developer account
2. Upload to RevenueCat dashboard
3. Update `REVENUECAT_CONFIG.iosApiKey` in config.ts

### Firebase Authentication

Already enabled:
- ✅ Email/Password authentication
- ✅ Phone authentication (SMS quota: 10/day on free tier)

**To increase SMS quota:**
- Upgrade Firebase to Blaze (pay-as-you-go) plan
- Or quota increases automatically as app gains users

---

## 📱 Platform-Specific Setup

### iOS Setup

#### 1. Update Bundle Identifier
Edit `ios/SpinlistApp/Info.plist`:
```xml
<key>CFBundleIdentifier</key>
<string>com.yourcompany.spinlist</string>
```

#### 2. Configure Signing
- Open `ios/SpinlistApp.xcworkspace` in Xcode
- Select project → Signing & Capabilities
- Select your Team
- Xcode will auto-generate provisioning profile

#### 3. Add AdMob App ID
Edit `ios/SpinlistApp/Info.plist`:
```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-7913011400514913~1290888174</string>
```

#### 4. Enable Phone Authentication
Add URL scheme in `ios/SpinlistApp/Info.plist`:
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>spinlist-d8597</string>
    </array>
  </dict>
</array>
```

### Android Setup

#### 1. Update Package Name
Edit `android/app/build.gradle`:
```gradle
defaultConfig {
    applicationId "com.yourcompany.spinlist"
    // ...
}
```

#### 2. Add AdMob App ID
Edit `android/app/src/main/AndroidManifest.xml`:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-7913011400514913~5038561494"/>
```

#### 3. Add SHA-1 Fingerprint for Phone Auth
Get debug SHA-1:
```bash
cd android
./gradlew signingReport
```

Add to Firebase Console:
- Project Settings → Your apps → Android app
- Add SHA-1 fingerprint
- Download new `google-services.json`

---

## 🧪 Testing

### Test Accounts
Create test accounts for development:
- Email: test@spinlist.com / password: test123
- Phone: Use Firebase test phone numbers

### Test Features Checklist
- [ ] Onboarding flow (3 slides)
- [ ] Email/password sign up
- [ ] Email/password sign in
- [ ] Phone authentication with OTP
- [ ] Decision Maker (spin wheel)
- [ ] Decision result with confetti
- [ ] Create list (free limit: 3)
- [ ] Add/edit/complete list items
- [ ] List 48-hour timer
- [ ] Renew list
- [ ] Delete list
- [ ] Banner ads (bottom of screens)
- [ ] Interstitial ads (every 5 actions)
- [ ] Pro upgrade screen
- [ ] Subscription purchase (test mode)
- [ ] Restore purchases
- [ ] Settings screen
- [ ] Logout

### Test Ad Integration
1. Set `USE_TEST_ADS = true` in config
2. Verify test ads show correctly
3. Before production, set `USE_TEST_ADS = false`

### Test Subscriptions
1. Use RevenueCat test mode
2. Test purchase flow
3. Test restore purchases
4. Verify Pro features unlock

---

## 🚀 Deployment

### iOS Deployment

#### 1. Prepare for Release
```bash
cd ios
pod install
```

#### 2. Archive in Xcode
- Open `ios/SpinlistApp.xcworkspace`
- Select "Any iOS Device" as target
- Product → Archive
- Wait for archive to complete

#### 3. Upload to App Store Connect
- Window → Organizer
- Select archive → Distribute App
- App Store Connect → Upload
- Fill in app metadata in App Store Connect
- Submit for review

#### 4. App Store Metadata
- App Name: Spinlist
- Subtitle: Spin to decide. List to remember.
- Keywords: decision maker, list keeper, productivity
- Category: Productivity
- Screenshots: Required (use simulator)

### Android Deployment

#### 1. Generate Signing Key
```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore spinlist-release.keystore -alias spinlist -keyalg RSA -keysize 2048 -validity 10000
```

#### 2. Configure Signing
Edit `android/gradle.properties`:
```properties
SPINLIST_UPLOAD_STORE_FILE=spinlist-release.keystore
SPINLIST_UPLOAD_KEY_ALIAS=spinlist
SPINLIST_UPLOAD_STORE_PASSWORD=your_password
SPINLIST_UPLOAD_KEY_PASSWORD=your_password
```

Edit `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        storeFile file(SPINLIST_UPLOAD_STORE_FILE)
        storePassword SPINLIST_UPLOAD_STORE_PASSWORD
        keyAlias SPINLIST_UPLOAD_KEY_ALIAS
        keyPassword SPINLIST_UPLOAD_KEY_PASSWORD
    }
}
```

#### 3. Build Release APK/AAB
```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

#### 4. Upload to Google Play Console
- Go to: https://play.google.com/console
- Create app → Spinlist
- Upload AAB file
- Fill in store listing
- Submit for review

#### 5. Add SHA-1 for Production
Get release SHA-1:
```bash
keytool -list -v -keystore android/app/spinlist-release.keystore
```

Add to Firebase Console (for Phone Auth in production)

---

## 🐛 Troubleshooting

### Common Issues

#### iOS Build Fails
```bash
cd ios
pod deintegrate
pod install
```

#### Android Build Fails
```bash
cd android
./gradlew clean
cd ..
rm -rf node_modules
npm install
```

#### Firebase Not Working
- Verify `google-services.json` / `GoogleService-Info.plist` are in correct locations
- Check Firebase API keys in `config.ts`
- Ensure Firebase services are enabled in console

#### Ads Not Showing
- Verify `USE_TEST_ADS = true` for development
- Check AdMob app IDs in `AndroidManifest.xml` / `Info.plist`
- Wait 1-2 hours after creating ad units (AdMob activation delay)

#### Phone Auth Not Working
- Add SHA-1 fingerprint to Firebase
- Enable Phone authentication in Firebase Console
- Check URL scheme in iOS Info.plist

---

## 📚 Additional Resources

### Documentation
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Firebase Docs](https://firebase.google.com/docs)
- [AdMob Docs](https://developers.google.com/admob)
- [RevenueCat Docs](https://docs.revenuecat.com/)

### Firebase Console
- Project: https://console.firebase.google.com/project/spinlist-d8597

### AdMob Console
- Account: https://apps.admob.com/

### RevenueCat Dashboard
- Account: https://app.revenuecat.com/

---

## 📞 Support

For issues or questions:
- Email: support@spinlist.app
- GitHub Issues: (create repository)

---

**Good luck with your app launch!** 🚀
