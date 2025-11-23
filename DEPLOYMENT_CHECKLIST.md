# 🚀 Spinlist Deployment Checklist

Complete checklist for deploying Spinlist to iOS App Store and Google Play Store.

---

## 📋 Pre-Deployment Checklist

### Code & Configuration
- [ ] Update `USE_TEST_ADS = false` in `src/constants/config.ts`
- [ ] Update `APP_VERSION` in `src/constants/config.ts`
- [ ] Remove all console.log statements
- [ ] Test all features on real devices (iOS & Android)
- [ ] Verify Firebase config files are in place
- [ ] Verify AdMob app IDs are correct
- [ ] Test subscription purchases in sandbox mode
- [ ] Test restore purchases functionality

### Assets & Content
- [ ] App icon (1024x1024 PNG)
- [ ] Launch screen / Splash screen
- [ ] App Store screenshots (iOS: 6.7", 6.5", 5.5")
- [ ] Play Store screenshots (Phone, 7" tablet, 10" tablet)
- [ ] App description (short & long)
- [ ] App keywords
- [ ] Privacy policy URL
- [ ] Terms of service URL
- [ ] Support email: support@spinlist.app

---

## 🍎 iOS App Store Deployment

### 1. Prepare iOS Build

#### Update Version & Build Number
Edit `ios/SpinlistApp/Info.plist`:
```xml
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

#### Configure Signing
- [ ] Open `ios/SpinlistApp.xcworkspace` in Xcode
- [ ] Select project → Signing & Capabilities
- [ ] Select your Team
- [ ] Choose "Automatically manage signing"
- [ ] Verify provisioning profile is created

#### Add Required Info.plist Keys
```xml
<!-- AdMob App ID -->
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-7913011400514913~1290888174</string>

<!-- App Transport Security -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>

<!-- Camera Permission (if needed) -->
<key>NSCameraUsageDescription</key>
<string>We need camera access to scan QR codes</string>

<!-- Photo Library Permission (if needed) -->
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to save images</string>
```

### 2. Archive & Upload

```bash
# Clean build
cd ios
rm -rf build
rm -rf ~/Library/Developer/Xcode/DerivedData
pod install
cd ..
```

#### In Xcode:
- [ ] Select "Any iOS Device" as target
- [ ] Product → Clean Build Folder
- [ ] Product → Archive
- [ ] Wait for archive to complete (5-10 minutes)
- [ ] Window → Organizer
- [ ] Select archive → Distribute App
- [ ] App Store Connect → Upload
- [ ] Wait for upload to complete

### 3. App Store Connect Setup

Go to: https://appstoreconnect.apple.com/

#### Create App
- [ ] My Apps → + → New App
- [ ] Platform: iOS
- [ ] Name: Spinlist
- [ ] Primary Language: English (U.S.)
- [ ] Bundle ID: com.yourcompany.spinlist
- [ ] SKU: spinlist-ios

#### App Information
- [ ] **Name:** Spinlist
- [ ] **Subtitle:** Spin to decide. List to remember.
- [ ] **Category:** Productivity
- [ ] **Secondary Category:** Utilities

#### Pricing & Availability
- [ ] **Price:** Free
- [ ] **In-App Purchases:** Yes
- [ ] **Availability:** All countries

#### App Privacy
- [ ] **Privacy Policy URL:** https://spinlist.app/privacy
- [ ] **Data Collection:**
  - Email Address (for authentication)
  - Phone Number (for authentication)
  - User ID (for analytics)
  - Purchase History (for subscriptions)

#### Version Information
- [ ] **Version:** 1.0.0
- [ ] **Copyright:** © 2024 Spinlist
- [ ] **Description:**
```
Spinlist helps you make decisions and manage lists effortlessly!

🎲 DECISION MAKER
Can't decide what to eat? Where to go? What to watch? Just add your options and spin the wheel! Let fate decide for you with our fun, animated decision maker.

📝 LIST KEEPER
Create lists for anything - shopping, tasks, goals, or ideas. Each list has a 48-hour auto-delete timer to keep your lists fresh and relevant. Renew anytime!

⭐ PRO FEATURES
• Unlimited lists (Free: 3 lists)
• No ads
• Cloud sync across devices
• Custom themes
• Priority support

FEATURES:
• Smooth spin wheel animation
• Confetti celebration on decision
• Real-time list sync
• Progress tracking
• 48-hour auto-delete with renewal
• Email & phone authentication
• Beautiful, intuitive interface

Perfect for:
• Making quick decisions
• Managing shopping lists
• Tracking tasks
• Organizing ideas
• Daily planning

Download Spinlist today and make life simpler!
```

- [ ] **Keywords:** decision maker, spin wheel, list keeper, todo list, task manager, productivity, organizer
- [ ] **Support URL:** https://spinlist.app/support
- [ ] **Marketing URL:** https://spinlist.app

#### Screenshots
Required sizes:
- [ ] 6.7" (iPhone 14 Pro Max): 1290 x 2796
- [ ] 6.5" (iPhone 11 Pro Max): 1242 x 2688
- [ ] 5.5" (iPhone 8 Plus): 1242 x 2208

Minimum 3 screenshots, maximum 10 per size.

#### App Review Information
- [ ] **First Name:** Your Name
- [ ] **Last Name:** Your Last Name
- [ ] **Phone Number:** Your Phone
- [ ] **Email:** your@email.com
- [ ] **Demo Account:**
  - Email: test@spinlist.com
  - Password: test123
- [ ] **Notes:** "Test account provided. Phone auth uses Firebase test numbers."

#### Version Release
- [ ] **Automatically release this version**
- OR
- [ ] **Manually release this version**

### 4. Submit for Review
- [ ] Click "Submit for Review"
- [ ] Review time: 24-48 hours typically
- [ ] Monitor status in App Store Connect

---

## 🤖 Google Play Store Deployment

### 1. Prepare Android Build

#### Update Version
Edit `android/app/build.gradle`:
```gradle
defaultConfig {
    versionCode 1
    versionName "1.0.0"
}
```

#### Generate Signing Key
```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore spinlist-release.keystore -alias spinlist -keyalg RSA -keysize 2048 -validity 10000
```

Save the keystore file and passwords securely!

#### Configure Signing
Edit `android/gradle.properties`:
```properties
SPINLIST_UPLOAD_STORE_FILE=spinlist-release.keystore
SPINLIST_UPLOAD_KEY_ALIAS=spinlist
SPINLIST_UPLOAD_STORE_PASSWORD=your_password
SPINLIST_UPLOAD_KEY_PASSWORD=your_password
```

Edit `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            if (project.hasProperty('SPINLIST_UPLOAD_STORE_FILE')) {
                storeFile file(SPINLIST_UPLOAD_STORE_FILE)
                storePassword SPINLIST_UPLOAD_STORE_PASSWORD
                keyAlias SPINLIST_UPLOAD_KEY_ALIAS
                keyPassword SPINLIST_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 2. Build Release Bundle

```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### 3. Google Play Console Setup

Go to: https://play.google.com/console/

#### Create App
- [ ] Create app → Spinlist
- [ ] Default language: English (United States)
- [ ] App or game: App
- [ ] Free or paid: Free

#### Store Listing
- [ ] **App name:** Spinlist
- [ ] **Short description:** Spin to decide. List to remember.
- [ ] **Full description:**
```
Spinlist helps you make decisions and manage lists effortlessly!

🎲 DECISION MAKER
Can't decide what to eat? Where to go? What to watch? Just add your options and spin the wheel! Let fate decide for you with our fun, animated decision maker.

📝 LIST KEEPER
Create lists for anything - shopping, tasks, goals, or ideas. Each list has a 48-hour auto-delete timer to keep your lists fresh and relevant. Renew anytime!

⭐ PRO FEATURES
• Unlimited lists (Free: 3 lists)
• No ads
• Cloud sync across devices
• Custom themes
• Priority support

FEATURES:
• Smooth spin wheel animation
• Confetti celebration on decision
• Real-time list sync
• Progress tracking
• 48-hour auto-delete with renewal
• Email & phone authentication
• Beautiful, intuitive interface

Perfect for:
• Making quick decisions
• Managing shopping lists
• Tracking tasks
• Organizing ideas
• Daily planning

Download Spinlist today and make life simpler!
```

- [ ] **App icon:** 512 x 512 PNG (32-bit)
- [ ] **Feature graphic:** 1024 x 500 JPG or PNG
- [ ] **Phone screenshots:** Minimum 2, maximum 8 (16:9 or 9:16)
- [ ] **7" tablet screenshots:** Optional
- [ ] **10" tablet screenshots:** Optional

#### Categorization
- [ ] **App category:** Productivity
- [ ] **Tags:** Decision making, Lists, Productivity, Organization

#### Contact Details
- [ ] **Email:** support@spinlist.app
- [ ] **Phone:** Optional
- [ ] **Website:** https://spinlist.app
- [ ] **Privacy policy:** https://spinlist.app/privacy

#### App Content
- [ ] **Privacy Policy:** Upload or provide URL
- [ ] **Ads:** Yes (AdMob)
- [ ] **Content rating:** Fill questionnaire (likely Everyone)
- [ ] **Target audience:** Age 13+
- [ ] **Data safety:** Fill data collection form

#### Pricing & Distribution
- [ ] **Countries:** All countries
- [ ] **Primarily child-directed:** No
- [ ] **Contains ads:** Yes
- [ ] **In-app purchases:** Yes ($4.99 - $49.99)

### 4. Upload App Bundle
- [ ] Release → Production → Create new release
- [ ] Upload `app-release.aab`
- [ ] Release name: 1.0.0
- [ ] Release notes:
```
🎉 Welcome to Spinlist!

• Make decisions with our fun spin wheel
• Manage lists with 48-hour auto-delete
• Email & phone authentication
• Real-time sync across devices
• Pro upgrade for unlimited lists and no ads

Thank you for downloading Spinlist!
```

### 5. Submit for Review
- [ ] Review release
- [ ] Start rollout to Production
- [ ] Review time: 1-7 days typically
- [ ] Monitor status in Play Console

---

## 🔒 Post-Deployment

### Firebase Configuration
- [ ] Add SHA-1 fingerprint for production keystore to Firebase
- [ ] Download new `google-services.json` and rebuild if needed

### AdMob
- [ ] Verify ads are showing correctly
- [ ] Monitor ad performance in AdMob dashboard

### RevenueCat
- [ ] Test subscription purchases in production
- [ ] Monitor subscription analytics

### Monitoring
- [ ] Set up Firebase Crashlytics
- [ ] Set up Firebase Analytics
- [ ] Monitor app performance
- [ ] Monitor user feedback and reviews

### Marketing
- [ ] Create app website: spinlist.app
- [ ] Set up social media accounts
- [ ] Prepare launch announcement
- [ ] Reach out to app review sites

---

## 📊 Launch Day Checklist

- [ ] App is live on App Store
- [ ] App is live on Google Play
- [ ] Website is live
- [ ] Privacy policy is published
- [ ] Terms of service are published
- [ ] Support email is set up
- [ ] Social media accounts are active
- [ ] Analytics are tracking correctly
- [ ] Ads are showing correctly
- [ ] Subscriptions are working
- [ ] Monitoring is set up

---

## 🎉 Congratulations!

Your app is now live! 🚀

### Next Steps:
1. Monitor crash reports and fix bugs quickly
2. Respond to user reviews
3. Gather user feedback
4. Plan feature updates
5. Market your app
6. Celebrate your launch! 🎊

---

**Good luck with your app launch!** 🍀
