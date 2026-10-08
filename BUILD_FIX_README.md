ZyroX Arena build fix

This package intentionally does NOT include package-lock.json. EAS will use npm install instead of npm ci, avoiding a stale/incomplete lockfile.

Preview APK: eas build --platform android --profile preview
Production/internal APK: eas build --platform android --profile production

For Play Store, use a separate store profile configured for app-bundle (AAB).
