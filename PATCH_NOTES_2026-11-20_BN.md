# ZyroX Arena patch (2026-11-20)

## Changes included
- App registration/login endpoints for name, email, Bangladesh phone and password; password hashing uses Node's PBKDF2.
- OTP verification is intentionally deferred as requested.
- Admin editor allows modifying results after publication; backend adjusts previous prize credits against the new values.
- Admin setting for logo image URL (the URL must be a publicly accessible image; it is not a direct image upload).
- User password hash/salt are removed from /api/me and admin overview responses.
- Removed the redundant nested update ZIP from the project folder.

## Not verified / live setup still required
- No device/APK test, EAS build, Render deployment, or live API test has been performed in this environment.
- Set ADMIN_TOKEN and JWT_SECRET (long random secret) in Render; configure durable storage/DB. JSON-file storage is not production-safe on ephemeral hosting.
- The app API URL must point at the actual deployed backend URL. The existing URL was retained rather than guessing.
- Payments remain manual transaction-ID approval, not automated bKash/Nagad integration. OTP and password recovery are not implemented.
- Admin logo setting accepts a URL; upload/storage hosting is not implemented.
