# ZyroX Arena — APK Ready Project

This ZIP is arranged with the Expo mobile app at the repository root so GitHub/Expo EAS can detect `package.json`, `app.json`, `App.js`, and `eas.json` directly.

## Build a directly installable Android APK
1. Upload/extract ALL files in this ZIP into your GitHub repository root.
2. In Expo/EAS, connect the GitHub repository.
3. Build the **preview** profile for Android. This profile is configured as an APK (`buildType: apk`).
4. Download/install the generated APK on Android.

## Important
- The app uses `EXPO_PUBLIC_API_URL` for the backend API. Set this environment variable in Expo/EAS to your deployed backend URL before testing real account, wallet, match, referral, and admin data.
- `backend/` contains the Express backend and admin panel from the full project. Deploy it separately (for example on Render) and then set `EXPO_PUBLIC_API_URL` to its HTTPS URL.
- No secrets are hardcoded. Keep `ADMIN_TOKEN` and `JWT_SECRET` in the backend environment variables.
- The production profile is configured for an Android App Bundle (AAB), suitable for Play Store submission; the preview profile is for an installable APK.

## Branding
App name: ZyroX Arena
Android package: com.zyroxarena.app
