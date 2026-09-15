# ZyroX Arena — APK-ready Tournament App

This project contains the Expo mobile app plus an Express backend.

## What is included
- Free Fire modes: BR, CS 4v4, Lone Wolf, Clash Squad, Headshot, Survival, Pro League
- Ludo tournament section
- Upcoming/Ongoing + Results tabs
- Match cards with entry fee, prize, per-kill, seats and status
- Participant join system with wallet deduction
- Admin-created matches and manual Free Fire Room ID/password
- Room ID/password released only after admin starts the match
- 5-second real-time polling for match status, seats and balance
- Admin result entry: rank, kills, prize; prizes credited to wallet
- bKash/Nagad manual deposit verification
- bKash/Nagad withdrawal requests
- Referral code + configurable referral percentage
- Leaderboard, statements, support, admin panel
- 15 editable rules stored in backend
- No hardcoded admin/JWT secrets

## Important limitation
The app cannot create an official Free Fire Custom Room automatically unless an official/authorized Free Fire API provides that capability. The admin creates the room in Free Fire and enters the Room ID + Password in ZyroX Arena. The app then controls participant access, room release, status and results.

## APK build
1. Upload the contents of this folder to the root of your GitHub repository.
2. In Expo, open project **ZyroX Arena** and connect the GitHub repository.
3. Add an Expo environment variable named `EXPO_PUBLIC_API_URL` containing your deployed backend URL, for example `https://your-api.onrender.com`.
4. Build Android with the `preview` profile. `eas.json` is already configured to produce an APK.

## Backend on Render
The included `render.yaml` can create a Node web service from the `backend` folder. Render will generate `ADMIN_TOKEN` and `JWT_SECRET` automatically.
After deployment, copy the backend service URL into Expo as `EXPO_PUBLIC_API_URL`.

## Admin
Open the Admin Panel inside the app and enter the `ADMIN_TOKEN` value from the backend environment variables.

## Payment defaults
bKash: 01742166737
Nagad: 01730649062
These are editable from Admin Panel.
