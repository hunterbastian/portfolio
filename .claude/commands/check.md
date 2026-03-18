---
description: Build and lint check before committing
allowed-tools: Bash
---

Run the following checks in sequence and report results:

1. `npm run lint` — ESLint
2. `npm run build` — Next.js production build

If either fails, show the errors clearly. Do not fix them automatically — just report.
