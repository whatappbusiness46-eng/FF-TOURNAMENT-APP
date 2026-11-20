# ZyroX Arena — এই ZIP-এ করা পরিবর্তন

- Finished match-এর result app-এর Match Details-এ দেখানোর UI যোগ হয়েছে (rank/name/kills/prize)।
- Backend finished match-এর result-এ participant UID validation এবং non-negative numeric validation যোগ হয়েছে।
- Public finished-match result-এ player name resolve করে পাঠায়; open match-এর result/room data গোপন থাকে।

## গুরুত্বপূর্ণ সীমাবদ্ধতা / APK ও Deploy

এই ZIP source update; এটি নিজে থেকে Render deploy বা APK build করে না। Backend Render-এ deploy করে তারপর Expo/EAS-এ build করতে হবে। OTP verification এখনো যুক্ত নয় (পরবর্তী কাজ হিসেবে রাখা হয়েছে)। Deposit/withdrawal বর্তমানে admin manual review flow; automatic bKash/Nagad payment integration নয়। Build/device test ও live-server test এখানে সম্পন্ন হয়নি।
