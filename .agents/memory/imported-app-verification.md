---
name: Imported app verification
description: Keep acceptance checks separate for the Designer and standalone visualization viewer.
---

Do not treat successful startup or API health of the standalone visualization viewer as proof that the WHAMO Designer works.

**Why:** The imported product contains two independently runnable applications. A healthy viewer can hide a Designer MongoDB or authentication failure, and a healthy Designer does not prove the viewer's CSS dependencies are installed.

**How to apply:** Check the Designer's database connection, login and role protection, plus the standalone viewer's asset compilation separately. Preserve the existing app boundaries during setup work.
