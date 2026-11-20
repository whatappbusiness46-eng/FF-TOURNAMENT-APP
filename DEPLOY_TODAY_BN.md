# ZyroX Arena — আজকের Deploy ও Test Checklist

## গুরুত্বপূর্ণ সত্য
এই ZIP-টি Deploy-ready configuration ও কিছু validation/idempotency fix-সহ প্রস্তুত। এটি 100% production-ready real-money app নয়। বর্তমান Backend JSON ফাইলে ডেটা রাখে এবং Login হলো demo-name login; তাই আসল টাকা/ব্যবহারকারী নেওয়ার আগে স্থায়ী Database ও প্রকৃত authentication দরকার।

## ধাপ 1 — GitHub
1. ZIP extract করুন।
2. এর ভেতরের `FF-TOURNAMENT-APP-main` ফোল্ডারের সব ফাইল আপনার GitHub repository `whatappbusiness46-eng/FF-TOURNAMENT-APP`-এর `main` branch-এ আপলোড/replace করুন।
3. `render.yaml` repository root-এ আছে কিনা নিশ্চিত করুন।

## ধাপ 2 — Render Backend
1. https://dashboard.render.com/ খুলুন।
2. New + → Blueprint নির্বাচন করুন।
3. GitHub repository `whatappbusiness46-eng/FF-TOURNAMENT-APP` connect করুন।
4. Branch `main`, Blueprint file `render.yaml` নির্বাচন করে Apply করুন।
5. Render deploy শেষ হলে service URL কপি করুন।
6. `https://YOUR-SERVICE.onrender.com/api/health` খুলুন। `{"ok":true,...}` এলে server চলছে।
7. `https://YOUR-SERVICE.onrender.com/admin.html` খুলে API URL ও Render Environment-এর `ADMIN_TOKEN` দিয়ে Admin connect করুন।

## ধাপ 3 — APK-তে API URL বসানো
1. Expo/EAS project-এর Environment Variables-এ `EXPO_PUBLIC_API_URL` যোগ করুন।
2. Value দিন Render URL, যেমন `https://zyrox-arena-api.onrender.com` (শেষে slash দেবেন না)।
3. নতুন EAS Android APK build করুন। আগের APK-তে এই URL নিজে থেকে ঢুকবে না।
4. APK install করে Home → API connection → Login → Match list পরীক্ষা করুন।

## ধাপ 4 — বাস্তব পরীক্ষার ক্রম
- Admin দিয়ে একটি test match তৈরি করুন।
- Test player দিয়ে demo login করুন।
- Deposit request পাঠিয়ে Admin থেকে approve/reject পরীক্ষা করুন।
- Test balance থাকলে match join করুন।
- Room ID/Password বসিয়ে Start Match করুন।
- Room details শুধু joined player দেখতে পায় কিনা পরীক্ষা করুন।
- Result publish ও wallet statement পরীক্ষা করুন।
- Withdrawal request, approve/reject ও refund পরীক্ষা করুন।

## এখনো বাধ্যতামূলক Production কাজ
- PostgreSQL বা অন্য persistent database; বর্তমান `backend/data/db.json` Render-এর ephemeral filesystem-এ হারাতে পারে।
- Demo-name login-এর বদলে password/OTP-based account verification, rate limiting ও account recovery।
- Real bKash/Nagad merchant API বা যাচাইকৃত manual reconciliation; বর্তমান flow শুধু Transaction ID জমা ও Admin approval।
- Wallet ledger audit, transaction concurrency protection, duplicate payment proof verification, admin audit log।
- Referral attribution ও commission credit-এর পূর্ণ flow; বর্তমান referral percentage setting থাকলেই commission automatically paid হয় না।
- Admin token নিরাপদে সংরক্ষণ; কাউকে token/JWT secret দেবেন না।
- Free Fire/Ludo gameplay, room handling, payout এবং স্থানীয় আইন/প্ল্যাটফর্মের নিয়ম মেনে পরিচালনা।

## Secret Safety
`ADMIN_TOKEN`, `JWT_SECRET`, database password বা payment credentials কখনো GitHub-এ commit করবেন না বা chat-এ পাঠাবেন না। শুধু Render Environment Variables-এ রাখবেন।

## Data persistence (IMPORTANT)
For Render, add a Persistent Disk (e.g. mount path `/var/data`) to the backend service and set environment variable `DATA_DIR=/var/data`. The backend stores `db.json` in that directory. Without this disk/path configuration, local JSON data may be lost during redeploy/restart. Back up `db.json` regularly. Persistent disk is single-instance storage; for scaling/multi-instance use a database.
