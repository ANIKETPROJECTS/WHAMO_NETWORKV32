---
name: Root typecheck baseline
description: The imported WHAMO Designer has an existing TypeScript-check baseline that is separate from runtime startup and production bundling.
---

The root app's `npm run check` is not currently a clean setup gate: it reports legacy client and Express typing errors even when the development server starts, the demo login works, and the production build succeeds.

**Why:** The imported project already contained these errors before feature work; treating them as a new feature regression obscures whether the app is actually runnable.

**How to apply:** For focused feature work, use the production build, workflow startup, browser preview, and relevant feature behavior as the acceptance checks. Track cleanup of the root typecheck separately from feature implementation.