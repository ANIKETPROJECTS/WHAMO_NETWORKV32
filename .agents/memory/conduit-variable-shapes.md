---
name: Conduit variable cross-section shapes
description: Rules for conduit VARIABLE shape selection and numeric D/A persistence
---

Conduit VARIABLE shape selection is UI metadata because WHAMO INP stores only numeric D/A values. Keep the shape coefficients shared with surge-tank SHAPE editing, infer a named shape on import only when the A/D² ratio matches, and preserve custom mode otherwise.

**Why:** Without this rule, a conduit can calculate correctly in the editor but lose its selected shape during INP or spreadsheet round-trips.

**How to apply:** Keep numeric INP output unchanged; update every editing/import/export surface together when adding or changing shape options.