# Render backend path fix (v1.2.7)

এই ZIP-এ backend package script ঠিক করা হয়েছে: backend/src/src.js চালাবে।

GitHub-এ পুরো project folder upload/replace করার পর Render service Settings-এ Root Directory `backend`, Build Command `npm install`, Start Command `npm start` রাখুন। Environment variables: `ADMIN_TOKEN` এবং `JWT_SECRET`—দুটি দীর্ঘ, নিজস্ব secret value দিন (এগুলো ZIP-এ রাখা নেই)।

এই পরিবর্তনটি path mismatch ঠিক করে; production-ready payment/auth/database/security বা persistent storage নিশ্চিত করে না।
