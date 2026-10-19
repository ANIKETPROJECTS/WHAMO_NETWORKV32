---
name: Legacy element compatibility
description: Product constraint for hiding retired hydraulic element controls without breaking old network files.
---

Keep retired element types out of new user-facing controls, tables, and guides while retaining their data model, import parsing, and INP generation for existing projects. Imported legacy items should remain visible only as read-only, neutral legacy markers.

**Why:** Existing project files can contain these elements, but they are no longer needed for new modeling.

**How to apply:** Preserve old values during load/save and test import-to-INP round-trips whenever removing or hiding an element type.
