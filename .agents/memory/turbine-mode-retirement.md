---
name: Turbine mode retirement
description: Compatibility rule for turbine operation modes removed from current UI choices.
---

Keep retired turbine operation modes out of new selections, tables, and help content. Preserve old input-file values through parsing and INP generation, display them with a neutral legacy marker, and let users replace them only by choosing a current mode.

**Why:** Removing a mode from new modeling should not silently rewrite an existing project or its input file.

**How to apply:** When retiring another operation mode, update dropdowns and guides but retain its parser/generator paths and test import-to-generate-to-import round-trips.
