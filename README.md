# 🎲 Spinlist - Decision Maker & List Keeper

**Spin to decide. List to remember.**

A React Native mobile app that helps you make decisions and manage lists with a fun, engaging interface.

---

## ✨ Features

### 🎲 Decision Maker
- Add 2-10 options for any decision
- Spin the wheel with smooth animations
- Get instant results with confetti celebration
- Save decision history

### 📝 List Keeper
- Create unlimited lists (Pro) or up to 3 lists (Free)
- Add, edit, and complete items
- 48-hour auto-delete timer with renewal option
- Progress tracking for each list
- Real-time sync across devices

### ⭐ Pro Features
- Unlimited lists
- Ad-free experience
- Cloud sync
- Custom themes
- Priority support

---

## 🛠️ Tech Stack

- **Framework:** React Native 0.82.1
- **Language:** TypeScript
- **Navigation:** React Navigation 6
- **Backend:** Firebase (Auth + Firestore)
- **Ads:** Google AdMob
- **Subscriptions:** RevenueCat
- **Animations:** React Native Reanimated

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- React Native CLI
- Xcode 14+ (for iOS)
- Android Studio (for Android)

### Installation

```bash
# Install dependencies
npm install

# iOS only - Install pods
cd ios && pod install && cd ..

# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android
```

### Configuration

1. **Firebase Setup:**
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Place in respective directories (see SETUP_GUIDE.md)

2. **Update Config:**
   - Edit `src/constants/config.ts`
   - Add your Firebase API keys

3. **Test Mode:**
   - Set `USE_TEST_ADS = true` for development

📖 **For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

---

## 📂 Project Structure

```
src/
├── screens/          # All app screens (10 screens)
├── components/       # Reusable components
├── navigation/       # Navigation setup
├── services/         # Firebase, AdMob, RevenueCat
├── utils/            # Utility functions
├── types/            # TypeScript types
├── constants/        # App constants & config
└── assets/           # Images, sounds, etc.
```

---

## 🔧 Configuration

### Firebase
- **Project ID:** spinlist-d8597
- **Authentication:** Email/Password + Phone (SMS)
- **Database:** Firestore

### AdMob
- **iOS App ID:** `ca-app-pub-7913011400514913~1290888174`
- **Android App ID:** `ca-app-pub-7913011400514913~5038561494`

### RevenueCat
- **Android:** Configured ✅
- **iOS:** Needs Apple P8 key

---

## 🧪 Testing

### Test Features Checklist
- [ ] Onboarding flow (3 slides)
- [ ] Email/Password authentication
- [ ] Phone authentication with OTP
- [ ] Decision Maker with spin animation
- [ ] Decision result with confetti
- [ ] Create/manage lists
- [ ] 48-hour timer and renewal
- [ ] Banner and interstitial ads
- [ ] Pro upgrade and subscriptions
- [ ] Settings and logout

---

## 📦 Deployment

### iOS
1. Archive in Xcode
2. Upload to App Store Connect
3. Submit for review

### Android
1. Build release AAB: `./gradlew bundleRelease`
2. Upload to Google Play Console
3. Submit for review

📖 **See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions**

---

## 🐛 Troubleshooting

**iOS build fails:**
```bash
cd ios && pod deintegrate && pod install
```

**Android build fails:**
```bash
cd android && ./gradlew clean
```

**Firebase not working:**
- Verify config files are in correct locations
- Check API keys in `config.ts`

**Ads not showing:**
- Set `USE_TEST_ADS = true` for development
- Wait 1-2 hours after creating ad units

---

## 📄 License

Copyright © 2024 Spinlist. All rights reserved.

---

## 📞 Support

- **Email:** support@spinlist.app
- **Documentation:** See SETUP_GUIDE.md

---

**Built with ❤️ using React Native**
