Original prompt: Build a classic Snake game in this repo.

Scope & constraints:
- Implement ONLY the classic Snake loop: grid movement, growing snake, food spawn, score, game-over, restart.
- Reuse existing project tooling/frameworks; do NOT add new dependencies unless truly required.
- Keep UI minimal and consistent with the repo’s existing styles (no new design systems, no extra animations).

Implementation plan:
1) Inspect the repo to find the right place to add a small interactive game (existing pages/routes/components).
2) Implement game state (snake positions, direction, food, score, tick timer) with deterministic, testable logic.
3) Render: simple grid + snake + food; support keyboard controls (arrow keys/WASD) and on-screen controls if mobile is present in the repo.
4) Add basic tests for the core game logic (movement, collisions, growth, food placement) if the repo has a test runner.

Deliverables:
- A small set of files/changes with clear names.
- Short run instructions (how to start dev server + where to navigate).
- A brief checklist of what to manually verify (controls, pause/restart, boundaries).

Additional placement/style request: Footer Easter egg between the year and “CRAFTED BY HUNTER BASTIAN”, with a small 8-bit icon that scales on hover, changes color on click, and opens a minimal black-and-white Snake popup.

Notes:
- Repo inspected: Next.js app with existing Footer component at src/components/Footer.tsx.
- No existing test runner configured in package.json.
- Plan: implement deterministic snake logic module + client footer Easter egg modal + keyboard/touch controls.

## Update 1
- Added deterministic core logic module at `src/lib/snake.ts`.
- Implemented pure functions: init, step, direction updates, collision checks, food placement, restart, and key-to-direction mapping.
- Food placement is deterministic with injected RNG for testability.

## Update 2
- Added `src/components/FooterSnakeEasterEgg.tsx` as a client component.
- Implemented footer trigger icon (pixel style) with hover scale + click/open color change.
- Implemented minimal black/white Snake popup with score, game-over, restart, pause, keyboard controls (Arrow/WASD), and mobile touch controls.
- Exposed `window.render_game_to_text` and `window.advanceTime(ms)` for deterministic external stepping/inspection.
- Integrated component into `src/components/Footer.tsx` between year and crafted-by text.
- Added core logic tests at `src/lib/snake.test.mts` using Node's built-in test runner.

## Update 3
- Validation:
  - `npm run test:snake` passes (7/7 tests).
  - `npm run lint` passes with pre-existing warnings unrelated to snake changes.
  - `npm run build` succeeds.
- Playwright skill loop executed via combined dev+automation command; screenshots and state artifacts captured in:
  - `output/web-game/*`
  - `output/web-game-controls/*`
- Observed existing, unrelated hydration warning on `/archive` route in captured console errors (`output/web-game/errors-0.json`).
