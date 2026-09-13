# ZyroX Arena — Free Fire + Ludo Tournament App

A complete starter project based on the supplied ZyroX Arena branding and the requested tournament rules.

## Included
- Expo React Native mobile app
- Express API server
- JSON-file persistence for easy Render deployment (no native DB build needed)
- Admin controls for modes, BR fee, per-kill reward, reward tiers, payment numbers, referral %, support link, and match creation
- Free Fire modes: BR, CS, Lone Wolf, Clash Squad
- Ludo section
- Wallet, deposit/withdraw request flow, statements, referrals, leaderboard, notifications
- No secrets hardcoded: server admin token and JWT secret are environment variables
- Manual payment verification workflow: users submit transaction IDs; admin approves/rejects

## Important
The project is a functional tournament-app foundation, but it does NOT pretend to be a live payment processor. bKash/Nagad credentials/API access must be supplied by the operator through the official provider and configured securely. Do not put PIN/OTP/private keys in the mobile app.

## Mobile
```bash
cd mobile
npm install
cp .env.example .env
# set EXPO_PUBLIC_API_URL to your deployed API URL
npx expo start
```

## Server
```bash
cd server
npm install
cp .env.example .env
# set ADMIN_TOKEN and JWT_SECRET to strong random values
npm start
```

For Render, create a Web Service pointing to `server/`, build command `npm install`, start command `npm start`, and add the environment variables from `.env.example`.

## Demo admin
There are no hardcoded admin credentials. The admin token is whatever you set in `ADMIN_TOKEN` on the server. Enter that token in the app's Admin section.
