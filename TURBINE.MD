# WHAMO Designer — Turbine User Guide

This guide covers only the Turbine element in WHAMO Designer. It explains the controls currently available in the software, what the generated input contains, and why each setting is present.

> **Scope and engineering note:** This document describes the behavior implemented by this version of WHAMO Designer. It is not a substitute for the official WHAMO manual, turbine manufacturer data, or a qualified engineering review. Use plant-specific data and confirm the generated `.INP` with the WHAMO executable used for the study.

## 1. Turbine concepts in the software

Three related items appear in a turbine input file:

1. **The Turbine element** identifies the turbine in the network and stores its model parameters.
2. **TCHAR data** describes the turbine's characteristic curves. A turbine refers to one numbered TCHAR type.
3. **The Operation Mode (`OPTURB`)** tells WHAMO how that turbine operates during the simulation.

The word `TURBINE` can therefore mean the network element/input block, not an operation mode. The current Operation Mode dropdown contains **GENERATE, GOVERN, OFF, REJECT, and STARTUP**.

## 2. Add and edit a turbine

1. Create the upstream and downstream network nodes.
2. Select **Turbine** from the Insert toolbar to activate turbine-link mode.
3. Connect from the upstream/high-head node to the downstream/tailrace node.
4. Select the turbine and configure its properties in the Properties panel. The same turbine data is also available through the Flex Table where applicable.
5. Complete the settings required for the chosen mode before generating an `.INP`.

Use a unique turbine label (for example, `T1`). WHAMO uses the label to connect the turbine definition, its operation mode, schedules, and other references.

## 3. Turbine properties

### Label / ID

The label is the turbine's identifier in the network and generated input. It is not a physical measurement. Keep it unique and use the same label when comparing or editing generated `.INP` text.

### Comment

An optional note for people working on the network, such as the turbine model or the source of its data. A comment does not change turbine calculations.

### TCHAR Configuration

**TCHAR Type** selects a numbered set of turbine characteristics. The selected number is written in the turbine definition as `TYPE n`; the matching curve data is written separately as `TCHAR TYPE n`.

The panel provides:

- **TCHAR Type** — chooses one of the characteristic sets currently in the project.
- **+ TCHAR** — creates a new numbered characteristic set.
- **Del** — removes the selected set, when more than one set exists.
- **Turbine Characteristics (TCHAR TYPE n)** — expands the curve editor for the selected set.

The curve editor contains:

| Curve data | Meaning | Why it is present |
| --- | --- | --- |
| **GATE** | Wicket-gate positions in percent of full opening (0 = closed; 100 = fully open). | Identifies the gate positions at which the characteristic data is defined. |
| **HEAD** | Head values for the characteristic data. | Provides the head points across which the turbine behavior is represented. |
| **Q** | Flow matrix, with one row per gate value and values across the head points. | Represents turbine flow for the gate/head combinations. |
| **EFFICIENCY** | Efficiency matrix in the same row/column arrangement as Q. | Represents efficiency for the corresponding gate/head combinations. |

Enter the values in the format expected by the project and the WHAMO manual: values in GATE and HEAD are space-separated; Q and EFFICIENCY use one space-separated row per gate value. Keep the matrix rows and columns aligned with the selected gate and head lists. The software writes the supplied values into the `.INP`; creating a TCHAR type does **not** invent or validate manufacturer curves.

TCHAR data is **shared by all turbines assigned the same type number**. Editing a type therefore affects every turbine using that type. Add a separate type when turbines need different characteristic data.

### Parameters

| Field | Meaning | Why it is present / guidance |
| --- | --- | --- |
| **Sync Speed `SYNCSPD` (RPM)** | Synchronous rotational speed of the turbine-generator set. | Used to describe the turbine's operating speed, including synchronous-speed operation. Use the value appropriate to the generator and WHAMO model. |
| **WR² — Moment of Inertia** | Rotational inertia associated with the turbine-generator set. | Inertia affects how quickly rotational speed changes during a transient such as load rejection. Use a source value for the combined equipment represented by the model. The panel does not show a unit next to this field; check the WHAMO unit convention before entering a value. |
| **Diameter** | Turbine runner diameter. The panel shows metres in SI mode or feet in FPS mode. | Included as a turbine model input. The generator converts this diameter to the FPS value written in the `.INP`; do not pre-convert it when entering it in the panel. |
| **Friction** | Turbine friction input. | Kept as a separate turbine parameter for the WHAMO model. The panel does not show a unit or convert this value; use the value and convention required by the WHAMO input format. |
| **Windage** | Turbine windage input. | Represents the model's windage-related turbine loss. The panel does not show a unit or convert this value; use the value and convention required by the WHAMO input format. |

The generator writes the turbine definition using `TYPE`, `SYNCSPD`, `WR2`, optional `DIAMETER`, `FRICTION`, and `WINDAGE`. Values for `SYNCSPD`, `WR2`, `FRICTION`, and `WINDAGE` are passed through numerically by the current generator. Check their units against the WHAMO manual and the unit system of the input file.

## 4. Operation Mode options

Choose the mode that represents the operating event you want to simulate. The mode is written in the `OPTURB` section.

| Mode | What it means in the software | Mode-specific settings | Why the option is kept |
| --- | --- | --- | --- |
| **GENERATE** | Turbine operates at synchronous speed using a gate schedule. | A positive whole-number **VSCHEDULE number** and at least two **T/G pairs**. | Represents generating operation where gate position is prescribed over time. |
| **STARTUP** | Starts the turbine from zero RPM using non-governor wicket-gate control. Turbine speed varies, with no transition to synchronized operation. | A positive whole-number **VSCHEDULE number** and at least two **T/G pairs**. | Models a turbine startup transient. It does not model startup in pumping mode. |
| **GOVERN** | Turbine uses governor control with a generator-load schedule. | Positive **TW**, a positive whole-number **Load schedule number**, and a **Generator load (HP)** value. | Represents a governed turbine responding under the specified load/control setup, instead of using the gate schedule used by GENERATE or REJECT. |
| **OFF** | Turbine is not operated by an active operating schedule. | No mode-specific gate or load schedule is generated. | Lets the network include a turbine definition without activating one of the other operating cases. |
| **REJECT** | Simulates load rejection at the specified **TOFF** time, using a gate schedule. | Positive **TOFF (s)**, a positive whole-number **VSCHEDULE number**, and at least two **T/G pairs**. | Represents a load-rejection transient and the turbine gate response associated with that event. |

### GENERATE

The `.INP` contains an `OPTURB` entry with `GENERATE` and the selected `VSCHEDULE` number. The schedule describes gate position over simulation time.

Use this when the intended case is synchronous-speed generation controlled by a prescribed gate schedule. Do not choose it when the case requires the governor/load controls represented by **GOVERN**.

### STARTUP

The WHAMO manual defines STARTUP as turbine startup from **0 RPM** under **non-governor wicket-gate control**. Turbine speed is allowed to vary; STARTUP does **not** transition the turbine into synchronized operation. The manual also states that startup in pumping mode is not simulated.

The `.INP` contains an `OPTURB` entry with `STARTUP` and a `VSCHEDULE` number. The selected gate schedule describes wicket-gate opening over time. In the app, STARTUP uses the same schedule editor and minimum-pair validation as GENERATE and REJECT. It does not use TOFF or the GOVERN mode's governor/load controls.

Use STARTUP only when this non-governor, variable-speed startup condition matches the case being modeled. If the study requires synchronization or a pump-mode startup, this mode does not represent that behavior.

### GOVERN

The `.INP` contains a `GOVERNOR` definition with the turbine ID and `TW`, followed by an `OPTURB` entry referencing an `LSCHEDULE`.

In the current implementation, **Generator load (HP)** is a single value. The app generates a constant load schedule at time 0 and at the simulation end time (`TMAX`). It does not currently provide a time-varying generator-load curve for GOVERN mode. The load schedule number is a reference number; turbines sharing a number must use the same load value.

Use **GOVERN** only when the governor and load values are appropriate for the intended system. The interface's presence of a GOVERN option does not itself establish that a particular set of values is physically valid.

### OFF

The `.INP` contains `OFF` for the turbine's `OPTURB` mode. The turbine's definition and selected characteristics can remain in the network, but the app does not add a gate or load schedule for this mode.

### REJECT and TOFF

**TOFF** is the time in seconds at which the load-rejection event is applied. The Properties panel shows **Rejection time TOFF (s)** only when **REJECT** is selected. The generated entry includes `REJECT TOFF <value>` and the selected `VSCHEDULE`.

The interface defaults TOFF to **2 seconds**. A positive value is required by the generator; zero or a negative value is rejected. The default is a convenience, not a recommendation for every study. Set TOFF to match the event timing in the scenario being modeled.

## 5. Gate schedules (`VSCHEDULE`)

GENERATE, REJECT, and STARTUP use a numbered gate schedule. Each row is a **T/G pair**:

- **T** — simulation time, in seconds.
- **G** — wicket-gate opening position as a percentage of fully open: normally 0 means closed and 100 means fully open.

The WHAMO manual requires the first time to be **0 seconds**, with subsequent times in increasing order. In the Properties panel, select the schedule number, then add, edit, or delete pairs. A schedule number must be a positive whole number, and the selected schedule must contain **at least two pairs** before the app will generate the turbine operation. The app currently checks the schedule number and pair count; it does not check that time starts at zero, times increase, or gate positions match the intended event. Review those values before generating the file.

The same schedule number can be referenced by more than one turbine. If they need different gate histories, give them different schedule numbers. Review the time points, gate fractions, and overall closure/opening shape against the actual operating event; the app's minimum-pair check is not an engineering review of the schedule.

## 6. What the app writes to the `.INP`

For a turbine with ID `T1`, the input is conceptually organized like this. Exact values and optional lines depend on the properties entered:

```text
TURBINE
 ID T1
 TYPE 1
 SYNCSPD ...
 WR2 ...
 DIAMETER ...
 FRICTION ...
 WINDAGE ...
FINISH

OPTURB
 ID T1
 GENERATE
 VSCHEDULE 1
FINISH
```

For STARTUP, the operation block is:

```text
OPTURB
 ID T1
 STARTUP
 VSCHEDULE 1
FINISH
```

The other operation-specific blocks are:

```text
OPTURB
 ID T1
 GOVERN
 LSCHEDULE 1
FINISH
```

```text
OPTURB
 ID T1
 REJECT TOFF 2
 VSCHEDULE 1
FINISH
```

```text
OPTURB
 ID T1
 OFF
FINISH
```

The app also writes the referenced TCHAR data and the required VSCHEDULE or LSCHEDULE blocks. These snippets are explanatory examples, not complete runnable input files.

## 7. Import and compatibility notes

- The current dropdown options are **GENERATE, GOVERN, OFF, REJECT, and STARTUP**.
- Older imported values are normalized by the app: `TURBGOV` becomes **GOVERN**, `EMERGENCY` becomes **REJECT**, and `TURBINE` becomes **OFF**. These are compatibility mappings; they are not additional current dropdown choices.
- `TURBINE` is also the name of the turbine definition block in the `.INP`; it should not be confused with an operation mode.
- STARTUP applies to turbine startup from zero RPM under non-governor wicket-gate control; it does not model pump-mode startup or transition to synchronized speed.
- An imported `.INP` may contain data beyond what is editable in this panel. After importing, review the displayed mode, schedules, and characteristic data before generating a new file.

## 8. Recommended setup and review checklist

Before generating an `.INP`:

1. Confirm the turbine ID is unique and the link connects the intended upstream and downstream nodes.
2. Select the correct TCHAR type and confirm its GATE, HEAD, Q, and EFFICIENCY data are complete and aligned.
3. Enter the turbine parameters from a reliable source and confirm their units, especially WR², friction, and windage.
4. Choose the operation mode that matches the modeled event.
5. For GENERATE, REJECT, or STARTUP, verify the schedule number and at least two T/G pairs.
6. For REJECT, set a positive TOFF that matches the event time; do not rely on the 2-second default without checking.
7. For GOVERN, verify TW, load, and schedule number. Remember the current app emits a constant load schedule, not a varying load curve.
8. Generate the `.INP`, inspect the turbine blocks and schedules, then run it through the target WHAMO executable.
9. Review the WHAMO diagnostics and simulation results. Successful file generation alone does not prove that the model inputs or resulting hydraulics are appropriate.

## 9. Reference

The mode names and WHAMO input concepts should be checked against the official manual for the WHAMO version being used:

Fitzgerald, R. and Van Blaricum, V. L., *Water Hammer and Mass Oscillation (WHAMO) 3.0 User’s Manual*, USACERL ADP Report 98/129, September 1998. Relevant sections include **2.5, “System Operating Conditions,”** and **4.1, `OPTURB`**.

- [Official ERDC manual PDF](https://erdc-library.erdc.dren.mil/server/api/core/bitstreams/81b728f8-a880-4ef8-e053-411ac80adeb3/content)
- [ERDC catalog record](https://erdc-library.erdc.dren.mil/items/81b728f7-899f-4ef8-e053-411ac80adeb3)

Always follow the manual and executable version used for the project when an input detail differs from this software guide.
