# 🚀 Spinlist Quick Reference Card

Quick commands and configurations for common tasks.

---

## ⚡ Quick Start Commands

```bash
# Install dependencies
npm install

# iOS - Install pods
cd ios && pod install && cd ..

# Run iOS
npx react-native run-ios

# Run Android
npx react-native run-android

# Start Metro bundler
npm start

# Clear cache
npm start -- --reset-cache
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `src/constants/config.ts` | All app configuration |
| `android/app/google-services.json` | Firebase Android config |
| `ios/SpinlistApp/GoogleService-Info.plist` | Firebase iOS config |
| `android/app/src/main/AndroidManifest.xml` | Android manifest |
| `ios/SpinlistApp/Info.plist` | iOS info plist |

---

## 🔑 Configuration Keys

### Firebase
```typescript
// src/constants/config.ts
export const FIREBASE_CONFIG = {
  ios: {
    apiKey: 'YOUR_IOS_API_KEY',
    authDomain: 'spinlist-d8597.firebaseapp.com',
    projectId: 'spinlist-d8597',
    storageBucket: 'spinlist-d8597.firebasestorage.app',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_IOS_APP_ID',
  },
  android: {
    apiKey: 'YOUR_ANDROID_API_KEY',
    authDomain: 'spinlist-d8597.firebaseapp.com',
    projectId: 'spinlist-d8597',
    storageBucket: 'spinlist-d8597.firebasestorage.app',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_ANDROID_APP_ID',
  },
};
```

### AdMob IDs
```typescript
// Already configured in config.ts
iOS App ID: ca-app-pub-7913011400514913~1290888174
iOS Banner: ca-app-pub-7913011400514913/5965340792
iOS Interstitial: ca-app-pub-7913011400514913/4652259123

Android App ID: ca-app-pub-7913011400514913~5038561494
Android Banner: ca-app-pub-7913011400514913/3802211889
Android Interstitial: ca-app-pub-7913011400514913/8307706756
```

### RevenueCat
```typescript
// Already configured in config.ts
Android: test_HumBUryPmujsEfxFoWN1YaquAd1
iOS: Needs Apple P8 key
```

---

## 🐛 Common Issues & Fixes

### iOS Build Fails
```bash
cd ios
rm -rf Pods
rm -rf build
rm Podfile.lock
pod deintegrate
pod install
cd ..
```

### Android Build Fails
```bash
cd android
./gradlew clean
cd ..
rm -rf node_modules
npm install
```

### Metro Bundler Issues
```bash
# Kill Metro
pkill -f "node.*metro"

# Clear cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

# Restart
npm start -- --reset-cache
```

### Firebase Not Working
1. Check config files are in place
2. Verify API keys in `config.ts`
3. Check Firebase Console for enabled services
4. For Android: Add SHA-1 fingerprint

### Ads Not Showing
1. Set `USE_TEST_ADS = true` in config
2. Wait 1-2 hours after creating ad units
3. Check AdMob app IDs in manifest/plist
4. Test on real device (not simulator)

---

## 🧪 Test Accounts

```
Email: test@spinlist.com
Password: test123

Phone: Use Firebase test numbers
```

---

## 📦 Build Commands

### iOS Release
```bash
# In Xcode:
# 1. Select "Any iOS Device"
# 2. Product → Archive
# 3. Distribute App → App Store Connect
```

### Android Release
```bash
cd android
./gradlew clean
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🔧 Configuration Toggles

### Enable/Disable Test Ads
```typescript
// src/constants/config.ts
export const USE_TEST_ADS = true; // false for production
```

### Update App Version
```typescript
// src/constants/config.ts
export const APP_VERSION = '1.0.0';

// iOS: ios/SpinlistApp/Info.plist
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>

// Android: android/app/build.gradle
versionName "1.0.0"
versionCode 1
```

---

## 📱 Platform-Specific

### iOS Info.plist Keys
```xml
<!-- AdMob App ID -->
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-7913011400514913~1290888174</string>

<!-- Firebase URL Scheme -->
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

### Android Manifest
```xml
<!-- AdMob App ID -->
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-7913011400514913~5038561494"/>
```

---

## 🌐 Important URLs

| Service | URL |
|---------|-----|
| Firebase Console | https://console.firebase.google.com/project/spinlist-d8597 |
| AdMob Console | https://apps.admob.com/ |
| RevenueCat Dashboard | https://app.revenuecat.com/ |
| App Store Connect | https://appstoreconnect.apple.com/ |
| Play Console | https://play.google.com/console/ |

---

## 📊 Feature Limits

### Free Users
- Max Lists: 3
- Ads: Yes (Banner + Interstitial every 5 actions)
- Cloud Sync: Yes

### Pro Users
- Max Lists: Unlimited
- Ads: No
- Cloud Sync: Yes
- Custom Themes: Yes (future)

---

## 🎯 Testing Checklist

Quick test before deployment:
- [ ] Login with email/password
- [ ] Login with phone number
- [ ] Create decision and spin
- [ ] Create list (max 3 for free)
- [ ] Add/complete/delete items
- [ ] Renew list timer
- [ ] See banner ad
- [ ] See interstitial ad (after 5 actions)
- [ ] Open Pro upgrade screen
- [ ] Test subscription (sandbox)
- [ ] Restore purchases
- [ ] Logout and login again

---

## 💡 Pro Tips

1. **Always test on real devices** - Simulators don't show ads
2. **Use test mode first** - Set `USE_TEST_ADS = true`
3. **Monitor Firebase Console** - Watch for errors
4. **Check logs** - Use React Native Debugger
5. **Test offline mode** - Ensure graceful degradation

---

## 📞 Quick Support

| Issue | Check |
|-------|-------|
| Build fails | Clean build, reinstall deps |
| Firebase error | Check config files |
| Ads not showing | Test mode, wait 1-2 hours |
| Subscription error | Check RevenueCat dashboard |
| Crash | Check Firebase Crashlytics |

---

**For detailed information, see:**
- README.md - Project overview
- SETUP_GUIDE.md - Complete setup instructions
- DEPLOYMENT_CHECKLIST.md - Deployment guide

---

**Happy coding!** 🚀
