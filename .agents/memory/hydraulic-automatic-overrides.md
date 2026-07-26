---
name: Hydraulic automatic overrides
description: Interaction rule for calculated hydraulic values and manual overrides
---

Calculated celerity/wave speed and friction values should remain visibly marked as automatic while their source inputs are valid. A user-entered replacement must be held in a confirmation dialog before it becomes a manual override.

**Why:** These values are derived from pipe geometry/material inputs, so silently accepting a typed replacement can make the network inconsistent without the user realizing the dependency was disabled.

**How to apply:** Keep the explanatory message near the fields, identify the source inputs in the warning, preserve the automatic value when cancelled, and return to automatic mode when a source input changes.