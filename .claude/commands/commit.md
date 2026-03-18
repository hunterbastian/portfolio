---
description: Build-verify and commit changes
allowed-tools: Bash, Read, Grep
---

Before committing, run the project's verification:

1. Run `npm run lint` — fix any auto-fixable issues
2. Run `npm run build` — must pass before committing
3. If both pass, stage the changed files (not `git add -A` — be specific)
4. Write a concise commit message that focuses on "why" not "what"
5. Commit with the message

If verification fails, report errors and do not commit.
