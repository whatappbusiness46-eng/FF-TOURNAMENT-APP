# ZyroX Arena audit/update (20 Nov 2026)

## এই প্যাকেজে যাচাইকৃত
- React Native/Expo app এবং Express backend source রয়েছে।
- Register/login (phone/email + password; OTP নেই), public matches, mode selection, match joining, wallet deposit request, withdrawal request, statements, referral/leaderboard/support UI, Owner/Admin panel source রয়েছে।
- Backend-এ room credentials public match responses থেকে লুকানো এবং participant-only room endpoint রয়েছে।
- Join cutoff: match schedule-এর ৫ মিনিট আগে।
- Room release/start action: schedule-এর ৫ মিনিট আগে থেকে admin start/release করতে পারবে; participant room credentials পাবে কেবল match `started` এবং release window open হলে।
- Profile name/game UID edit, gift endpoint, admin balance adjustment endpoint এবং result editing endpoint আছে (সব UI-তে সংযুক্ত বা payout-safe বলে যাচাই হয়নি)।

## সীমাবদ্ধতা / production blocker
- এই build-এ EAS APK build, Render deploy, physical-device end-to-end testing হয়নি।
- Owner/Admin authentication এবং API authorization সম্পূর্ণ security audit হয়নি; environment secrets সঠিকভাবে সেট করতে হবে।
- JSON file database persistence/backup ও concurrent-write safety production-ready নয়; durable database migration দরকার।
- Real bKash/Nagad payment gateway নেই; manual transaction-ID submission/approval flow মাত্র।
- Result editing payout reconciliation, full user management UI, all modes/rules editing UI, full profile-edit UI, OTP, comprehensive audit logging ও fraud controls অসম্পূর্ণ/অযাচাইকৃত।
- Real-money use-এর জন্য এই package production-ready নয়।
