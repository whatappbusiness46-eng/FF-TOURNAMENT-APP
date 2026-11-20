# Automatic Kill + Rank Reward Calculation

- Admin saved mode rules supply `perKill` and rank rewards (`rewards` array entries with `rank` and `amount`, including rank ranges such as `4-5`), plus `winnerReward` and `secondReward` fallbacks.
- At result publish, the backend computes `killReward = kills * perKill` and `rankReward` from the saved mode rule, then `prize = killReward + rankReward`.
- Admin result JSON needs only `uid`, `rank`, and `kills`; any submitted `prize` is ignored.
- Results are accepted only for players who joined that match; duplicate UIDs and negative/non-integer ranks/kills are rejected.
- A match can only be published once. Results are credited to wallet and winnings, and ledger records show both calculated components.
- Admin must configure and save mode rules first. If no rank reward is configured for a rank, that rank reward is zero.

Example: 5 kills × ৳10 + Rank 1 prize ৳200 = ৳250.
