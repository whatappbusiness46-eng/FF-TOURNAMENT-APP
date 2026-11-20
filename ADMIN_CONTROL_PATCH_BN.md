# Admin Control Update (Bangla)

Added to backend/public/admin.html:
- Match Room ID and Password edit/save controls.
- Start / release room controls (backend only releases details to participants).
- Result JSON publish form; each result row uses uid, rank, kills, prize. Backend credits prize values to wallets and rejects publishing a finished match again.
- Match title, entry fee, prize total and max-player edit fields.
- User search by user ID/name/contact with wallet/winnings, statements and joined match summaries.
- Rules editor and mode editor from the previous patch.

## Result format
`[{"uid":"u...","rank":1,"kills":5,"prize":100}]`
Use the actual app user ID in uid. Prize is the amount credited. This version does not calculate rank/kills prizes automatically from mode rules; admin enters the prize value per result.

## Persistence
Set `DATA_DIR=/var/data` in Render environment and add a Render Persistent Disk mounted at `/var/data`. Without a mounted disk, data in the service filesystem can be lost on redeploy/restart. Back up data regularly.

This is a code patch, not live production verification. Deploy and test using a test account and small/no-value match first. Do not rely on it for real-money operations until verified and reviewed.
