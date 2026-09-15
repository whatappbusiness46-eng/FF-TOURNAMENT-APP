# ZyroX Arena — Final Complete Build

This package contains the Expo mobile app and Node/Express backend.

## Included
- Free Fire BR/CS/Lone Wolf/Clash Squad/Headshot/Survival/Pro League modes
- Ludo
- Match list, join flow, room release, results/prizes
- bKash/Nagad deposit request + admin approval
- Withdraw request + admin approval/refund
- Wallet statements, referral, leaderboard, notifications
- Admin match/settings/rules/deposit/withdraw/result controls
- Expo SDK 54 dependency fixes and startup fallback

## Required once before going live
1. Deploy `backend/` to an always-on server or a Render paid service.
2. Set `ADMIN_TOKEN` and a strong `JWT_SECRET`.
3. Configure persistent production storage/database; the included JSON store is suitable for testing/small MVP use, not a high-volume real-money production ledger.
4. Set Expo preview environment variable `EXPO_PUBLIC_API_URL` to the deployed backend URL, then build the APK.
5. bKash/Nagad automatic payment requires the merchant/API credentials issued by the provider. Without those, deposits are transaction-ID + admin approval.
6. Free Fire custom rooms must be created by an authorized/admin account unless an official room-creation API is available.
