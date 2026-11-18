# ZyroX Arena — startup crash fix (v1.2.5)

## What was fixed
- `App.js` was missing `export default App;`. Expo's `expo/AppEntry.js` imports the root component as the default export. This is a concrete startup defect consistent with the reported immediate app crash.
- Restored the established Android package and iOS bundle identifier: `com.zyroxarena.app`.
- Set app version `1.2.5` and Android `versionCode` `5` (the prior project version was 1.2.4 / build 4).
- Kept the existing app screens, assets, backend, and feature code intact.

## Build on Expo / EAS
1. Upload/extract the ZIP contents into the root of the existing GitHub repository (not inside an extra nested folder).
2. Confirm `App.js`, `app.json`, `package.json`, `eas.json`, `babel.config.js`, `assets/`, and `backend/` are at repository root.
3. In EAS, run an Android build using the `preview` profile. It is configured to produce an APK.
4. Install the new APK and test on the phone.

Commands (if using a terminal):
```bash
npm install
npx expo-doctor
npx expo install --check
eas build --platform android --profile preview
```

## Important limits
This ZIP fixes the source-level startup defect found in the supplied project. It is not a signed APK and cannot guarantee zero crashes on every Android device until EAS builds it and the resulting APK is installed and tested. Backend-powered login, deposits, withdrawals, matches, and admin actions require the backend to be deployed and `EXPO_PUBLIC_API_URL` configured in the EAS build environment. Without that URL, the app should still open and show its built-in fallback content, but live server features will not work.
