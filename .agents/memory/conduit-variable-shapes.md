---
name: Conduit and surge-tank shape equivalents
description: Equivalent-diameter exports, separate surge-tank SHAPE pairs, and compatibility with legacy conduit VARIABLE input
---

Conduits retain the user's entered diameter and selected profile in the project. INP export converts that diameter to an equivalent circular diameter using `sqrt(k / 0.785) × D`; Circular remains unchanged. Conduit editors offer named profiles only, not manual VARIABLE/D/A fields.

Legacy INP VARIABLE D/A data should be converted to the entered D and a matching named profile when its A/D² ratio identifies one. Unmatched legacy custom profiles fall back to Circular because manual custom shapes are no longer supported.

Surge-tank diameter profiles must remain separate from the existing SHAPE elevation/area-pair mode. Apply the equivalent diameter only while DIAM mode is active; enabling SHAPE must preserve and export its pairs unchanged.

**Why:** WHAMO receives a circular DIAM value, while the editor needs to preserve the selected tunnel profile and original input diameter.

**How to apply:** Keep the profile coefficients, equivalent-diameter preview, unit conversion, spreadsheet editor, and INP export consistent. Do not overwrite the user's entered diameter with the computed equivalent or reuse surge-tank SHAPE-pair state for a DIAM profile.