# Owner Control and login setup

Render Environment Variables (do not share these):
- ADMIN_TOKEN: strong random secret
- JWT_SECRET: different strong random secret
- OWNER_ACCOUNT: your account email or Bangladesh phone, exactly as used at registration (normalized lowercase; phone format 01XXXXXXXXX)

This build offers password-based email/phone login, not OTP verification. The owner button is hidden for other accounts in the UI; sensitive admin API calls still require ADMIN_TOKEN. Set OWNER_ACCOUNT before owner registration/login.

Admin panel: /admin.html. Use API URL and ADMIN_TOKEN. User search requires admin token and supports UID/name/contact.

Do not use this for real money until persistent database storage, account verification, security review and transaction reconciliation are implemented.
